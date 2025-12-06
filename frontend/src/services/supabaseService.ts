import { supabase } from '@/lib/supabase';
import type { User, Organization } from '@/types';

// User Profile Operations
export const userProfileService = {
  // Get user profile from database
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get leaderboard
  async getLeaderboard(limit: number = 10) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('points', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};

// Organization Profile Operations
export const organizationProfileService = {
  // Get organization profile from database
  async getProfile(orgId: string) {
    const { data, error } = await supabase
      .from('organization_profiles')
      .select('*')
      .eq('id', orgId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update organization profile
  async updateProfile(orgId: string, updates: Partial<Organization>) {
    const { data, error } = await supabase
      .from('organization_profiles')
      .update(updates)
      .eq('id', orgId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all verified organizations
  async getVerifiedOrganizations() {
    const { data, error } = await supabase
      .from('organization_profiles')
      .select('*')
      .eq('verification_status', 'verified')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get organizations by category
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('organization_profiles')
      .select('*')
      .eq('category', category)
      .eq('verification_status', 'verified')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

// Donation Operations
export const donationService = {
  // Create a new donation
  async create(donation: {
    donor_id: string;
    organization_id: string;
    type: string;
    quantity: string;
    category: string;
    delivery_method: 'pickup' | 'dropoff';
    preferred_date?: string;
    preferred_time?: string;
    notes?: string;
  }) {
    const { data, error } = await supabase
      .from('donations')
      .insert(donation)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get donations by donor
  async getByDonor(donorId: string) {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        organization:organization_profiles(name, logo_url)
      `)
      .eq('donor_id', donorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get donations by organization
  async getByOrganization(orgId: string) {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        donor:user_profiles(name, avatar_url)
      `)
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update donation status
  async updateStatus(donationId: string, status: string) {
    const { data, error } = await supabase
      .from('donations')
      .update({ status })
      .eq('id', donationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get donation by ID
  async getById(donationId: string) {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        donor:user_profiles(name, phone, avatar_url),
        organization:organization_profiles(name, phone, logo_url, address)
      `)
      .eq('id', donationId)
      .single();

    if (error) throw error;
    return data;
  },
};

// Donation Needs Operations
export const donationNeedsService = {
  // Create donation need
  async create(need: {
    organization_id: string;
    title: string;
    description?: string;
    category: string;
    urgency?: 'low' | 'medium' | 'high';
    target_quantity?: string;
  }) {
    const { data, error } = await supabase
      .from('donation_needs')
      .insert(need)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get active donation needs
  async getActive() {
    const { data, error } = await supabase
      .from('donation_needs')
      .select(`
        *,
        organization:organization_profiles(name, logo_url, location)
      `)
      .eq('is_active', true)
      .order('urgency', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get needs by organization
  async getByOrganization(orgId: string) {
    const { data, error } = await supabase
      .from('donation_needs')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update donation need
  async update(needId: string, updates: Partial<{
    title: string;
    description?: string;
    category: string;
    urgency?: 'low' | 'medium' | 'high';
    target_quantity?: string;
    current_quantity?: string;
    is_active?: boolean;
  }>) {
    const { data, error } = await supabase
      .from('donation_needs')
      .update(updates)
      .eq('id', needId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete donation need
  async delete(needId: string) {
    const { error } = await supabase
      .from('donation_needs')
      .delete()
      .eq('id', needId);

    if (error) throw error;
  },
};

// Certificate Operations
export const certificateService = {
  // Create certificate
  async create(certificate: {
    donation_id: string;
    user_id: string;
    certificate_url: string;
  }) {
    const { data, error } = await supabase
      .from('certificates')
      .insert(certificate)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get certificates by user
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        donation:donations(
          type,
          quantity,
          organization:organization_profiles(name)
        )
      `)
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};
