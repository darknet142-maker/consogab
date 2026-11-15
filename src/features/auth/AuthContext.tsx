import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthState, UserProfile, UserSignUpData, SignUpResult, SignInResult, ResetPasswordResult } from './types';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { toast } from 'sonner';

export const GUEST_STORAGE_KEY = 'gb_prototype_access';
export const GUEST_USER_ID = 'guest-prototype-user';

const createGuestSession = (): { guestUser: User; guestProfile: UserProfile } => {
  const now = new Date().toISOString();
  const guestUser: User = {
    id: GUEST_USER_ID,
    email: 'invite@consogab.ga',
    app_metadata: {},
    user_metadata: {
      pseudo: 'Invité ConsoGab',
      role: 'consumer'
    },
    aud: 'authenticated',
    created_at: now
  };

  const guestProfile: UserProfile = {
    id: 'guest-profile',
    user_id: GUEST_USER_ID,
    role: 'consumer',
    pseudo: 'Invité ConsoGab',
    visibility: 'public',
    created_at: now,
    updated_at: now
  };

  return { guestUser, guestProfile };
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isGuest: false,
    loading: true,
    initialized: false
  });

  const refreshProfile = useCallback(async () => {
    if (!state.user || state.isGuest || state.user.id === GUEST_USER_ID) return;
    const profile = await AuthService.getProfile(state.user.id);
    setState(prev => ({ ...prev, profile }));
  }, [state.user, state.isGuest]);

  const signInWithoutAuth = useCallback(() => {
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
    const { guestUser, guestProfile } = createGuestSession();
    setState({
      user: guestUser,
      session: null,
      profile: guestProfile,
      isGuest: true,
      loading: false,
      initialized: true
    });
    toast.success('Connexion sans authentification activée');
  }, []);

  // Initialize Auth
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        let isGuestAccess = false;
        try {
          isGuestAccess = localStorage.getItem(GUEST_STORAGE_KEY) === 'true';
        } catch {
          isGuestAccess = false;
        }

        if (isGuestAccess) {
          const { guestUser, guestProfile } = createGuestSession();
          if (mounted) {
            setState({
              user: guestUser,
              session: null,
              profile: guestProfile,
              isGuest: true,
              loading: false,
              initialized: true
            });
          }
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        let profile = null;
        if (session?.user) {
          profile = await AuthService.getProfile(session.user.id);
        }

        if (mounted) {
          setState({
            user: session?.user ?? null,
            session,
            profile,
            isGuest: false,
            loading: false,
            initialized: true
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setState(prev => ({ ...prev, loading: false, initialized: true }));
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state change:', event, session?.user?.email);
      
      // Synchronous state update first
      const user = session?.user ?? null;
      
      if (event === 'SIGNED_OUT') {
        SessionService.clearSession();
        setState({
          user: null,
          session: null,
          profile: null,
          isGuest: false,
          loading: false,
          initialized: true
        });
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        try {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {
          // Ignore storage errors
        }
        // Update state immediately with user info
        setState(prev => ({
          ...prev,
          user,
          session,
          isGuest: false,
          loading: false,
          initialized: true
        }));
        
        // Initialize session tracking
        if (user && event === 'SIGNED_IN') {
          SessionService.initSession(user.id);
        }

        // Defer profile fetch to avoid deadlock
        if (user) {
          setTimeout(async () => {
            try {
              const profile = await AuthService.getProfile(user.id);
              setState(prev => ({
                ...prev,
                profile: profile || prev.profile
              }));
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          }, 0);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    try {
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: normalizedEmail, 
        password 
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        // Improved French error messages
        if (error.message.includes('Invalid login credentials')) {
          return {
            data,
            error: { message: "Email ou mot de passe incorrect. Vérifiez vos identifiants." }
          };
        }
        if (error.message.includes('Email not confirmed')) {
          return {
            data,
            error: { message: "Veuillez confirmer votre email avant de vous connecter." }
          };
        }
        if (error.message.includes('Invalid email')) {
          return {
            data,
            error: { message: "Format d'email invalide." }
          };
        }
        return { data, error: { message: error.message } };
      }

      // Log successful login
      if (data.user) {
        await supabase.from('activity_log').insert({
          user_id: data.user.id,
          action_type: 'USER_LOGIN',
          action_description: `Connexion réussie`,
          metadata: {
            email: normalizedEmail,
            timestamp: new Date().toISOString()
          }
        });
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      return { data: null, error: { message: error.message || "Erreur de connexion" } };
    }
  };

  const signUp = async (email: string, password: string, userData: UserSignUpData): Promise<SignUpResult> => {
    try {
      const result = await AuthService.signUp(email, password, userData);
      
      if (result.error) {
        // Handle existing user
        if (result.error.message === "EXISTING_USER") {
          return {
            data: result.data,
            error: { 
              message: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
              email: result.error.email
            }
          };
        }
        return { 
          data: result.data, 
          error: { message: result.error.message || "Erreur lors de l'inscription" } 
        };
      }

      // Log successful signup
      if (result.data?.user) {
        await supabase.from('activity_log').insert({
          user_id: result.data.user.id,
          action_type: 'USER_SIGNUP',
          action_description: `Inscription réussie`,
          metadata: {
            email: email.trim().toLowerCase(),
            full_name: String(userData.full_name || ''),
            timestamp: new Date().toISOString()
          }
        });
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: { message: error.message || "Erreur lors de l'inscription" } 
      };
    }
  };

  const signOut = async () => {
    try {
      try {
        localStorage.removeItem(GUEST_STORAGE_KEY);
        localStorage.removeItem('consogab_guest_profile_mode_v1');
      } catch {
        // Ignore storage errors
      }

      if (state.isGuest || state.user?.id === GUEST_USER_ID) {
        setState({
          user: null,
          session: null,
          profile: null,
          isGuest: false,
          loading: false,
          initialized: true
        });
        toast.success('Déconnexion réussie');
        window.location.href = '/auth';
        return;
      }

      const currentUser = state.user;
      
      // Log logout before signing out
      if (currentUser) {
        await supabase.from('activity_log').insert({
          user_id: currentUser.id,
          action_type: 'USER_LOGOUT',
          action_description: `Déconnexion`,
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
      }

      await supabase.auth.signOut();
      SessionService.clearSession();
      toast.success('Déconnexion réussie');
      
      // Redirect to auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const resetPassword = async (email: string): Promise<ResetPasswordResult> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) {
        return { error: { message: error.message } };
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || "Erreur lors de la réinitialisation" } };
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      signUp,
      signOut,
      signInWithoutAuth,
      resetPassword,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
