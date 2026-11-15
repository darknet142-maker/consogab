import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { GUEST_USER_ID } from '@/features/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createDomainLogger } from '@/lib/logger';
import { getDemoBusinesses } from '@/mocks/consoGabDemoData';

const GUEST_MODE_STORAGE_KEY = 'consogab_guest_profile_mode_v1';
const GUEST_MODE_EVENT = 'consogab-guest-mode-change';

function getGuestDemoProfiles(): BusinessProfile[] {
  return getDemoBusinesses()
    .filter((b) => b.user_id === GUEST_USER_ID)
    .map((b) => ({
      id: b.id,
      business_name: b.business_name,
      logo_url: b.logo_url,
      is_primary: b.is_primary,
      role: 'owner',
      is_owner: true,
    }));
}

function readGuestModeState(): { mode: ProfileMode; businessId: string | null } {
  try {
    const raw = localStorage.getItem(GUEST_MODE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        mode: parsed.mode === 'business' ? 'business' : 'consumer',
        businessId: parsed.businessId || null,
      };
    }
  } catch {
    // Ignore storage errors
  }
  return { mode: 'consumer', businessId: null };
}

export type ProfileMode = 'consumer' | 'business';

interface BusinessProfile {
  id: string;
  business_name: string;
  logo_url?: string;
  is_primary: boolean;
  role: string;
  is_owner: boolean;
}

interface UserCurrentMode {
  current_mode: ProfileMode;
  current_business_id?: string;
}

const profileLogger = createDomainLogger('profile-manager');

export const useProfileMode = () => {
  const { user } = useAuth();
  const [currentMode, setCurrentMode] = useState<ProfileMode>('consumer');
  const [currentBusinessId, setCurrentBusinessId] = useState<string | null>(null);
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const loadBusinessProfiles = useCallback(async () => {
    if (!user) return;

    try {
      profileLogger.debug('Loading business profiles', { 
        action: 'load_business_profiles',
        user_id: user.id 
      });
      
      // Load business profiles owned by the user
      const { data, error } = await supabase
        .from('business_profiles')
        .select('id, business_name, logo_url, is_primary, user_id, owner_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        profileLogger.error('Failed to load business profiles', { 
          action: 'load_business_profiles',
          user_id: user.id 
        }, error);
        setBusinessProfiles([]);
        return;
      }

      profileLogger.info('Business profiles loaded', { 
        action: 'load_business_profiles',
        user_id: user.id,
        status: 'success'
      }, { count: data?.length || 0 });
      
      // Transform the data to match expected interface
      const transformedProfiles = (data || []).map(profile => ({
        id: profile.id,
        business_name: profile.business_name,
        logo_url: profile.logo_url,
        is_primary: profile.is_primary || false,
        role: 'owner',
        is_owner: true
      }));
      
      setBusinessProfiles(transformedProfiles);
      
    } catch (error) {
      profileLogger.error('Exception loading business profiles', { 
        action: 'load_business_profiles',
        user_id: user.id 
      }, error);
      setBusinessProfiles([]);
    }
  }, [user]);

  const loadCurrentMode = useCallback(async () => {
    if (!user) return;

    try {
      profileLogger.debug('Loading current mode', { 
        action: 'load_current_mode',
        user_id: user.id 
      });
      
      const { data, error } = await supabase
        .from('user_current_mode')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        profileLogger.error('Failed to load current mode', { 
          action: 'load_current_mode',
          user_id: user.id 
        }, error);
        return;
      }

      if (data) {
        profileLogger.info('Current mode loaded', { 
          action: 'load_current_mode',
          user_id: user.id,
          status: 'success'
        }, { mode: data.current_mode, business_id: data.current_business_id });
        
        setCurrentMode(data.current_mode as ProfileMode);
        setCurrentBusinessId(data.current_business_id || null);
      } else {
        profileLogger.info('No mode defined, initializing consumer mode', { 
          action: 'init_consumer_mode',
          user_id: user.id,
          status: 'success'
        });
        
        setCurrentMode('consumer');
        setCurrentBusinessId(null);
        
        await supabase
          .from('user_current_mode')
          .insert({
            user_id: user.id,
            current_mode: 'consumer',
            current_business_id: null
          });
      }
      
    } catch (error) {
      profileLogger.error('Exception loading current mode', { 
        action: 'load_current_mode',
        user_id: user.id 
      }, error);
      setCurrentMode('consumer');
      setCurrentBusinessId(null);
    }
  }, [user]);

  // Initialisation des données à la connexion - SEULEMENT UNE FOIS
  useEffect(() => {
    if (!user) {
      setCurrentMode('consumer');
      setCurrentBusinessId(null);
      setBusinessProfiles([]);
      setLoading(false);
      setInitialized(false);
      return;
    }

    if (user.id === GUEST_USER_ID) {
      const guestState = readGuestModeState();
      setCurrentMode(guestState.mode);
      setCurrentBusinessId(guestState.businessId);
      setBusinessProfiles(getGuestDemoProfiles());
      setLoading(false);
      setInitialized(true);

      const handleGuestModeSync = (event: Event) => {
        const customEvent = event as CustomEvent<{ mode: ProfileMode; businessId: string | null }>;
        if (customEvent.detail) {
          setCurrentMode(customEvent.detail.mode);
          setCurrentBusinessId(customEvent.detail.businessId);
        }
      };

      window.addEventListener(GUEST_MODE_EVENT, handleGuestModeSync);
      return () => {
        window.removeEventListener(GUEST_MODE_EVENT, handleGuestModeSync);
      };
    }

    if (initialized) return; // Éviter les initialisations multiples

    const initializeUserProfile = async () => {
      try {
        setLoading(true);
        profileLogger.info('Initializing user profile', { 
          action: 'initialize_profile',
          user_id: user.id 
        });
        
        await Promise.all([
          loadBusinessProfiles(),
          loadCurrentMode()
        ]);
        
        setInitialized(true);
        
      } catch (error) {
        profileLogger.error('Failed to initialize profile', { 
          action: 'initialize_profile',
          user_id: user.id 
        }, error);
        toast.error("Erreur lors du chargement du profil");
        
        setCurrentMode('consumer');
        setCurrentBusinessId(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUserProfile();

    // Abonnement aux changements de mode en temps réel
    const channel = supabase
      .channel('profile-mode-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_current_mode',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const data = payload.new || payload.old;
        if (data && typeof data === 'object') {
          const newMode = (data as any).current_mode as ProfileMode;
          const newBusinessId = (data as any).current_business_id || null;
          
          profileLogger.info('Mode changed via realtime', { 
            action: 'realtime_mode_change',
            user_id: user.id,
            from: currentMode,
            to: newMode,
            business_id: newBusinessId,
            status: 'success'
          });
          
          setCurrentMode(newMode);
          setCurrentBusinessId(newBusinessId);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, initialized]); // Supprimer currentMode des deps pour éviter la boucle



  const switchMode = async (mode: ProfileMode, businessId?: string, callback?: () => void) => {
    if (!user) {
      toast.error("Vous devez être connecté pour changer de mode");
      return;
    }

    if (user.id === GUEST_USER_ID) {
      const nextBusinessId = mode === 'business' ? (businessId || null) : null;
      if (mode === 'business' && nextBusinessId) {
        const business = businessProfiles.find((bp) => bp.id === nextBusinessId);
        if (!business) {
          toast.error("Profil business non accessible");
          return;
        }
      }
      try {
        localStorage.setItem(
          GUEST_MODE_STORAGE_KEY,
          JSON.stringify({ mode, businessId: nextBusinessId })
        );
      } catch {
        // Ignore storage errors
      }
      setCurrentMode(mode);
      setCurrentBusinessId(nextBusinessId);
      window.dispatchEvent(
        new CustomEvent(GUEST_MODE_EVENT, {
          detail: { mode, businessId: nextBusinessId },
        })
      );
      const businessName = nextBusinessId
        ? businessProfiles.find((bp) => bp.id === nextBusinessId)?.business_name
        : '';
      toast.success(
        mode === 'business'
          ? `Vous êtes maintenant en mode ${businessName}`
          : 'Vous êtes maintenant en mode consommateur'
      );
      callback?.();
      return;
    }

    try {
      profileLogger.info('Attempting mode switch', { 
        action: 'switch_mode',
        user_id: user.id,
        from: currentMode,
        to: mode,
        business_id: businessId 
      });

      // Validation du profil business si nécessaire
      if (mode === 'business' && businessId) {
        const business = businessProfiles.find(bp => bp.id === businessId);
        if (!business) {
          profileLogger.error('Business profile not accessible', { 
            action: 'switch_mode',
            user_id: user.id,
            business_id: businessId 
          });
          toast.error("Profil business non accessible");
          return;
        }
        
        profileLogger.info('Business profile validated', { 
          action: 'validate_business',
          user_id: user.id,
          business_id: businessId,
          business_name: business.business_name,
          status: 'success'
        });
      }

      // Utiliser la fonction RPC sécurisée pour basculer
      const { data, error } = await supabase.rpc('switch_user_profile', {
        profile_id: businessId || null
      });

      if (error) {
        profileLogger.error('RPC switch_user_profile failed', { 
          action: 'switch_mode',
          user_id: user.id,
          business_id: businessId 
        }, error);
        throw new Error(error.message || 'Impossible de basculer de profil');
      }

      profileLogger.info('Mode switch successful', { 
        action: 'switch_mode',
        user_id: user.id,
        from: currentMode,
        to: mode,
        business_id: businessId,
        status: 'success'
      });

      // Mise à jour immédiate du state local pour la réactivité
      setCurrentMode(mode);
      setCurrentBusinessId(businessId || null);

      // Notification de succès
      const businessName = businessId ? businessProfiles.find(bp => bp.id === businessId)?.business_name : '';
      const message = mode === 'business' 
        ? `Vous êtes maintenant en mode ${businessName}` 
        : `Vous êtes maintenant en mode consommateur`;
      
      toast.success(message);

      // Appeler le callback optionnel après succès
      callback?.();

    } catch (error: any) {
      profileLogger.error('Mode switch failed', { 
        action: 'switch_mode',
        user_id: user.id,
        from: currentMode,
        to: mode,
        business_id: businessId 
      }, error);
      toast.error(error.message || "Impossible de changer de mode");
    }
  };

  const getCurrentBusiness = () => {
    if (currentMode !== 'business' || !currentBusinessId) return null;
    return businessProfiles.find(bp => bp.id === currentBusinessId) || null;
  };

  const isOwnerOfBusiness = (businessId: string) => {
    const business = businessProfiles.find(bp => bp.id === businessId);
    return business?.is_owner === true;
  };

  const canAccessBusinessPro = (businessId: string) => {
    return isOwnerOfBusiness(businessId);
  };

  return {
    currentMode,
    currentBusinessId,
    businessProfiles,
    loading,
    switchMode,
    getCurrentBusiness,
    isOwnerOfBusiness,
    canAccessBusinessPro,
    refreshBusinessProfiles: loadBusinessProfiles
  };
};