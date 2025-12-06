import { User, Donation, Certificate } from "@/types";
import { mockUser, mockDonations, mockCertificates } from "./mockData";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const API_URL = 'http://localhost:8080/api';

const getAuthToken = (): string => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');
  return token;
};

export const userService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) throw new Error('Invalid credentials');
      const result = await response.json();
      
      // Store token
      localStorage.setItem('token', result.data.token);
      
      return {
        user: result.data.user,
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
  }): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Signup failed');
      const result = await response.json();
      
      // Store token
      localStorage.setItem('token', result.data.token);
      
      return {
        user: result.data.user,
        token: result.data.token
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async getProfile(): Promise<User> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to mock data
      await delay(300);
      return mockUser;
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/users/profile`, {
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
      console.error('Error updating profile:', error);
      // Fallback to mock data
      await delay(400);
      return { ...mockUser, ...data };
    }
  },

  async getDonationHistory(): Promise<Donation[]> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/users/donations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch donations');
      const result = await response.json();
      
      // Transform backend data to frontend format
      const donations: Donation[] = result.data.map((d: any) => ({
        id: d.id,
        donorId: d.donor_id,
        donorName: 'You',
        organizationId: d.organization_id,
        organizationName: d.organization_profiles?.name || 'Unknown',
        type: d.donation_type || 'items',
        quantity: d.quantity || d.item_description || 'N/A',
        deliveryMethod: d.delivery_method || 'dropoff',
        preferredDate: d.preferred_date || d.created_at,
        preferredTime: d.preferred_time || '10:00 AM',
        notes: d.notes || d.description || '',
        status: d.status,
        rewardPoints: d.certificates?.[0]?.points_awarded || undefined,
        certificateUrl: d.certificates?.[0]?.certificate_url,
        createdAt: d.created_at,
        updatedAt: d.updated_at || d.created_at
      }));
      
      return donations;
    } catch (error) {
      console.error('Error fetching donations:', error);
      // Fallback to mock data
      await delay(400);
      return mockDonations.filter(d => d.donorId === mockUser.id);
    }
  },

  async getCertificates(): Promise<Certificate[]> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/users/certificates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch certificates');
      const result = await response.json();
      
      // Transform backend data to frontend format
      const certificates: Certificate[] = result.data.map((c: any) => ({
        id: c.id,
        donationId: c.donation_id,
        organizationName: c.organization_profiles?.name || 'Unknown',
        donationType: c.donations?.donation_type || c.donation_type || 'items',
        amount: c.amount || c.donations?.amount,
        points: c.points_awarded,
        date: c.issued_at || c.created_at,
        certificateUrl: c.certificate_url,
        certificateNumber: c.certificate_number
      }));
      
      return certificates;
    } catch (error) {
      console.error('Error fetching certificates:', error);
      // Fallback to mock data
      await delay(300);
      return mockCertificates;
    }
  },
};
