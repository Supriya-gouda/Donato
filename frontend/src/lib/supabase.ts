import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// User type enum
export enum UserType {
  DONOR = 'donor',
  ORGANIZATION = 'organization'
}

// Helper function to get user metadata
export const getUserType = (user: { user_metadata?: { user_type?: string } } | null): UserType | null => {
  return (user?.user_metadata?.user_type as UserType) || null;
};

// Helper function to check if user is donor
export const isDonor = (user: { user_metadata?: { user_type?: string } } | null): boolean => {
  return getUserType(user) === UserType.DONOR;
};

// Helper function to check if user is organization
export const isOrganization = (user: { user_metadata?: { user_type?: string } } | null): boolean => {
  return getUserType(user) === UserType.ORGANIZATION;
};
