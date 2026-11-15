import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { z } from 'zod';
import { UserRole, UserProfile, UserSignUpData, BusinessCategory } from './types';

export const signUpSchema = z.object({
  email: z.string().email('Email invalide').max(255),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').max(100),
  pseudo: z.string().min(2, 'Le pseudo doit contenir au moins 2 caractères').max(50),
  phone: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  department: z.string().optional(),
  arrondissement: z.string().optional(),
  quartier: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  role: z.enum(['merchant', 'client', 'consumer']).default('consumer'),
  businessName: z.string().optional(),
  businessCategory: z.string().optional(),
  businessDescription: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;

export interface ProfileData {
  pseudo: string;
  phone?: string;
  country?: string;
  province?: string;
  department?: string;
  arrondissement?: string;
  quartier?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  role: string;
}

export interface BusinessData {
  business_name: string;
  business_category: string;
  description?: string;
  country?: string;
  province?: string;
  department?: string;
  arrondissement?: string;
  quartier?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  is_primary: boolean;
  is_active: boolean;
}

const NETWORK_ERROR_MESSAGE =
  "Service momentanément indisponible. Vérifiez votre connexion ou entrez sans compte.";

function normalizeAuthError(error: any) {
  const msg = String(error?.message ?? error ?? '');
  if (error?.name === 'AuthRetryableFetchError' || /Failed to fetch|NetworkError|Load failed/i.test(msg)) {
    return { ...(typeof error === 'object' ? error : {}), message: NETWORK_ERROR_MESSAGE };
  }
  return error;
}

export class AuthService {
  private static readonly VALID_BUSINESS_CATEGORIES: readonly BusinessCategory[] = [
    'agriculture', 'automotive', 'beauty', 'education', 'entertainment',
    'finance', 'fitness', 'healthcare', 'manufacturing', 'other',
    'real_estate', 'restaurant', 'retail', 'services', 'technology'
  ];

  static async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as UserProfile;
  }

  static async waitForProfile(userId: string, attempts = 5, delay = 1000): Promise<UserProfile | null> {
    for (let i = 0; i < attempts; i++) {
      const profile = await this.getProfile(userId);
      if (profile) return profile;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return null;
  }

  static async signUp(data: SignUpData): Promise<{ user: User | null; data?: any; error: any }>;
  static async signUp(email: string, password: string, userData: UserSignUpData): Promise<{ data: any; user?: User | null; error: any }>;
  static async signUp(
    emailOrData: string | SignUpData,
    password?: string,
    userData?: UserSignUpData
  ): Promise<{ data?: any; user?: User | null; error: any }> {
    // Signature 1: signUp(data: SignUpData)
    if (typeof emailOrData === 'object') {
      try {
        const validatedData = signUpSchema.parse(emailOrData);
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              pseudo: validatedData.pseudo,
              role: validatedData.role,
              first_name: validatedData.firstName,
              last_name: validatedData.lastName,
            },
          },
        });

        if (signUpError) {
          return { user: null, data: null, error: normalizeAuthError(signUpError) };
        }

        return { user: signUpData?.user ?? null, data: signUpData, error: null };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            user: null,
            data: null,
            error: { message: error.errors[0].message },
          };
        }
        return { user: null, data: null, error: normalizeAuthError(error) };
      }
    }

    // Signature 2: signUp(email, password, userData)
    const email = emailOrData;
    const pwd = password || '';
    const profileInput = userData || { pseudo: email.split('@')[0], role: 'consumer' as UserRole };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        data: null,
        user: null,
        error: { message: "Format d'email invalide" }
      };
    }

    if (pwd.length < 6) {
      return {
        data: null,
        user: null,
        error: { message: "Le mot de passe doit contenir au moins 6 caractères" }
      };
    }

    const redirectUrl = `${window.location.origin}/auth`;

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: pwd,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          pseudo: profileInput.pseudo,
          role: profileInput.role,
          phone: profileInput.phone,
          full_name: profileInput.pseudo
        }
      }
    });

    if (error) {
      console.error('Supabase signup error:', error);

      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        try { localStorage.setItem('prefillEmail', email); } catch { /* Ignore */ }
        return {
          data,
          user: null,
          error: { message: "EXISTING_USER", email }
        };
      }

      if (error.message.includes('invalid') || error.message.includes('Invalid')) {
        return {
          data,
          user: null,
          error: { message: "L'adresse email n'est pas valide. Utilisez une adresse email réelle." }
        };
      }

      return { data, user: null, error: normalizeAuthError({ message: error.message }) };
    }

    if (data.user && data.session) {
      try {
        const sessionUser = data.user;
        const profile = await this.waitForProfile(sessionUser.id);

        if (!profile) {
          console.warn('Trigger failed, creating profile manually');
          await this.createUserProfile(sessionUser.id, {
            pseudo: profileInput.pseudo,
            role: profileInput.role,
            phone: profileInput.phone,
            country: profileInput.country || 'Gabon',
            province: profileInput.province,
            department: profileInput.department,
            arrondissement: profileInput.arrondissement,
            quartier: profileInput.quartier,
            address: profileInput.address,
            latitude: profileInput.latitude,
            longitude: profileInput.longitude,
          });
        }

        if (profileInput.role === 'merchant' && profileInput.businessName && profileInput.businessName.trim()) {
          await this.setupMerchantBusiness(sessionUser.id, profileInput);
        }
      } catch (err) {
        console.error('Error during post-signup:', err);
      }
    }

    return { data, user: data?.user ?? null, error: null };
  }

  static async signIn(credentials: SignInData): Promise<{ user: User | null; error: any }> {
    try {
      const validatedData = signInSchema.parse(credentials);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      return { user: data?.user ?? null, error: error ? normalizeAuthError(error) : null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          user: null,
          error: { message: error.errors[0].message }
        };
      }
      return { user: null, error: normalizeAuthError(error) };
    }
  }

  static async signOut(): Promise<{ error: any }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  static async resetPassword(email: string): Promise<{ error: any }> {
    try {
      const validEmail = z.string().email().parse(email);
      const { error } = await supabase.auth.resetPasswordForEmail(validEmail, {
        redirectTo: `${window.location.origin}/auth?mode=reset`
      });
      return { error };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { error: { message: 'Email invalide' } };
      }
      return { error };
    }
  }

  static async createUserProfile(userId: string, data: ProfileData): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        pseudo: data.pseudo,
        role: data.role,
        phone: data.phone,
        country: data.country || 'Gabon',
        province: data.province,
        department: data.department,
        arrondissement: data.arrondissement,
        quartier: data.quartier,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        visibility: 'public'
      });

    return { error };
  }

  static async createBusinessProfile(userId: string, data: BusinessData): Promise<{ businessId: string | null; error: any }> {
    const { data: businessData, error } = await supabase
      .from('business_profiles')
      .insert([{
        user_id: userId,
        business_name: data.business_name,
        business_category: data.business_category as any,
        description: data.description,
        country: data.country || 'Gabon',
        province: data.province,
        department: data.department,
        arrondissement: data.arrondissement,
        quartier: data.quartier,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        is_primary: data.is_primary,
        is_active: data.is_active
      }])
      .select('id')
      .single();

    return {
      businessId: businessData?.id || null,
      error
    };
  }

  static async initializeBusinessMode(userId: string, businessId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_current_mode')
      .upsert({
        user_id: userId,
        current_mode: 'business',
        current_business_id: businessId
      });

    return { error };
  }

  private static async setupMerchantBusiness(userId: string, userData: UserSignUpData) {
    const category = userData.businessCategory?.toLowerCase() || 'services';
    const businessCategory: BusinessCategory = this.VALID_BUSINESS_CATEGORIES.includes(category as BusinessCategory)
      ? category as BusinessCategory
      : 'services';

    const { businessId, error: businessError } = await this.createBusinessProfile(userId, {
      business_name: userData.businessName || '',
      business_category: businessCategory,
      description: userData.businessDescription || '',
      country: userData.country || 'Gabon',
      province: userData.province,
      department: userData.department,
      arrondissement: userData.arrondissement,
      quartier: userData.quartier,
      address: userData.address,
      latitude: userData.latitude,
      longitude: userData.longitude,
      is_primary: true,
      is_active: true
    });

    if (businessError || !businessId) {
      console.error('Error creating business profile:', businessError);
      return;
    }

    const { error: collabError } = await supabase
      .from('business_collaborators')
      .insert({
        user_id: userId,
        business_id: businessId,
        role: 'owner',
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        permissions: {
          manage_products: true,
          manage_orders: true,
          manage_staff: true,
          view_analytics: true,
          edit_settings: true
        }
      });

    if (collabError) {
      console.error('Error creating business collaborator:', collabError);
    }

    await this.initializeBusinessMode(userId, businessId);
  }
}

