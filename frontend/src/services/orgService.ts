import { Organization, Donation } from "@/types";
import { mockOrganizations, mockDonations, mockOrgAuth } from "./mockData";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthToken = () => localStorage.getItem('org_token');

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const orgService = {
  async login(email: string, password: string): Promise<{ organization: Organization; token: string }> {
    try {
      const response = await fetch(`${API_URL}/organizations/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }

      // Transform backend data to frontend format
      const organization: Organization = {
        id: result.data.organization.id,
        name: result.data.organization.name,
        email: result.data.organization.email,
        phone: result.data.organization.phone || '',
        description: result.data.organization.description || '',
        mission: result.data.organization.mission || '',
        category: result.data.organization.category || 'other',
        location: result.data.organization.location || '',
        address: result.data.organization.address || '',
        registrationNumber: result.data.organization.registration_number || '',
        logoUrl: result.data.organization.logo_url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100&h=100&fit=crop',
        bannerUrl: result.data.organization.banner_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=400&fit=crop',
        images: result.data.organization.images || [],
        donationNeeds: [],
        totalDonations: 0,
        createdAt: result.data.organization.created_at || new Date().toISOString(),
      };

      return { 
        organization, 
        token: result.data.token 
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async signup(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    registrationNumber: string;
    location: string;
    category: string;
  }): Promise<{ organization: Organization; token: string }> {
    try {
      const response = await fetch(`${API_URL}/organizations/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          registrationNumber: data.registrationNumber,
          location: data.location,
          category: data.category
        })
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Signup failed');
      }

      // Transform backend data to frontend format
      const organization: Organization = {
        id: result.data.organization.id,
        name: result.data.organization.name,
        email: result.data.organization.email,
        phone: result.data.organization.phone || '',
        description: result.data.organization.description || '',
        mission: result.data.organization.mission || '',
        category: result.data.organization.category || 'other',
        location: result.data.organization.location || '',
        address: result.data.organization.address || '',
        registrationNumber: result.data.organization.registration_number || '',
        logoUrl: result.data.organization.logo_url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100&h=100&fit=crop',
        bannerUrl: result.data.organization.banner_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=400&fit=crop',
        images: result.data.organization.images || [],
        donationNeeds: [],
        totalDonations: 0,
        createdAt: result.data.organization.created_at || new Date().toISOString(),
      };

      return { 
        organization, 
        token: result.data.token 
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async getOrganizations(location?: string): Promise<Organization[]> {
    try {
      const url = location 
        ? `${API_URL}/public/organizations?location=${encodeURIComponent(location)}`
        : `${API_URL}/public/organizations`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch organizations');
      const result = await response.json();
      
      // Transform backend data to frontend format
      const organizations = result.data.map((org: any) => ({
        id: org.id,
        name: org.name,
        email: org.email,
        phone: org.phone,
        description: org.description || '',
        mission: org.mission || '',
        category: org.category || 'other',
        location: org.location || '',
        address: org.address || '',
        registrationNumber: org.registration_number || '',
        logoUrl: org.logo_url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100&h=100&fit=crop',
        bannerUrl: org.banner_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=400&fit=crop',
        images: org.images || [],
        donationNeeds: org.donation_needs || [],
        totalDonations: org.total_donations || 0,
        verificationStatus: org.verification_status,
        createdAt: org.created_at,
      }));
      
      // Filter by location if provided
      if (location) {
        return organizations.filter((org: Organization) => 
          org.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      return organizations;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      // Fallback to mock data
      await delay(400);
      if (location) {
        return mockOrganizations.filter(org => 
          org.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      return mockOrganizations;
    }
  },

  async getOrganizationById(id: string): Promise<Organization | null> {
    try {
      const response = await fetch(`${API_URL}/public/organizations/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch organization');
      const result = await response.json();
      
      // Transform backend data to frontend format
      const org = result.data;
      return {
        id: org.id,
        name: org.name,
        email: org.email,
        phone: org.phone,
        description: org.description || '',
        mission: org.mission || '',
        category: org.category || 'other',
        location: org.location || '',
        address: org.address || '',
        registrationNumber: org.registration_number || '',
        logoUrl: org.logo_url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100&h=100&fit=crop',
        bannerUrl: org.banner_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=400&fit=crop',
        images: org.images || [],
        donationNeeds: org.donation_needs || [],
        totalDonations: org.total_donations || 0,
        verificationStatus: org.verification_status,
        createdAt: org.created_at,
      };
    } catch (error) {
      console.error('Error fetching organization:', error);
      // Fallback to mock data
      await delay(300);
      return mockOrganizations.find(org => org.id === id) || null;
    }
  },

  async getOrgProfile(): Promise<Organization> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/organizations/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching org profile:', error);
      // Fallback to mock data
      await delay(300);
      return mockOrgAuth as Organization;
    }
  },

  async updateOrgProfile(data: Partial<Organization>): Promise<Organization> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/organizations/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating org profile:', error);
      // Fallback to mock data
      await delay(400);
      return { ...mockOrgAuth, ...data } as Organization;
    }
  },

  async getOrgDonations(status?: string): Promise<Donation[]> {
    try {
      const token = getAuthToken();
      const url = status 
        ? `${API_URL}/organizations/donations?status=${status}`
        : `${API_URL}/organizations/donations`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch donations');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching org donations:', error);
      // Fallback to mock data
      await delay(400);
      return mockDonations.filter(d => d.organizationId === mockOrgAuth.id);
    }
  },

  async getReceivedDonations(status?: string): Promise<any[]> {
    try {
      const token = getAuthToken();
      const url = status 
        ? `${API_URL}/organizations/received-donations?status=${status}`
        : `${API_URL}/organizations/received-donations`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch received donations');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching received donations:', error);
      throw error;
    }
  },

  async getReceivedDonationDetails(id: string): Promise<any> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/organizations/received-donations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch donation details');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching donation details:', error);
      throw error;
    }
  },

  async updateDonationNotes(id: string, notes: string): Promise<any> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/organizations/received-donations/${id}/notes`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
      });
      
      if (!response.ok) throw new Error('Failed to update notes');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating notes:', error);
      throw error;
    }
  },

  async acceptDonation(id: string): Promise<Donation> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/organizations/donations/${id}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to accept donation');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error accepting donation:', error);
      throw error;
    }
  },

  async rejectDonation(id: string, reason: string): Promise<Donation> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/organizations/donations/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      
      if (!response.ok) throw new Error('Failed to reject donation');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error rejecting donation:', error);
      throw error;
    }
  },

  async completeDonation(id: string, pointsAwarded: number, certificateData?: any): Promise<any> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/organizations/donations/${id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          points_awarded: pointsAwarded,
          certificate_url: certificateData?.certificate_url,
          certificate_number: certificateData?.certificate_number
        })
      });
      
      if (!response.ok) throw new Error('Failed to complete donation');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error completing donation:', error);
      throw error;
    }
  },

  async getOrgStats(): Promise<{
    totalDonations: number;
    pendingDonations: number;
    completedDonations: number;
    totalPointsGiven: number;
    totalReceived?: number;
    byType?: any;
    totalAmount?: number;
    totalItems?: number;
  }> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/organizations/donation-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch stats');
      const result = await response.json();
      
      // Map backend stats to frontend format
      return {
        totalDonations: result.data.total_received || 0,
        pendingDonations: 0, // Can be calculated from donations list
        completedDonations: result.data.total_received || 0,
        totalPointsGiven: 0, // Not available in current stats
        totalReceived: result.data.total_received,
        byType: result.data.by_type,
        totalAmount: result.data.total_amount,
        totalItems: result.data.total_items
      };
    } catch (error) {
      console.error('Error fetching org stats:', error);
      // Fallback to mock data
      await delay(300);
      const orgDonations = mockDonations.filter(d => d.organizationId === mockOrgAuth.id);
      return {
        totalDonations: orgDonations.length,
        pendingDonations: orgDonations.filter(d => d.status === "pending").length,
        completedDonations: orgDonations.filter(d => d.status === "completed").length,
        totalPointsGiven: orgDonations.reduce((sum, d) => sum + (d.rewardPoints || 0), 0),
      };
    }
  },
};
