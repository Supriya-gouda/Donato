import { Donation, LeaderboardEntry } from "@/types";
import { mockDonations, mockLeaderboard } from "./mockData";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const API_URL = 'http://localhost:8080/api';

const getAuthToken = (): string => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');
  return token;
};

let donations = [...mockDonations];

export const donationService = {
  async createDonation(data: {
    organizationId: string;
    organizationName: string;
    type: string;
    quantity: string;
    deliveryMethod: "pickup" | "dropoff";
    preferredDate: string;
    preferredTime: string;
    notes: string;
  }): Promise<Donation> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/users/donations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organization_id: data.organizationId,
          donation_type: data.type,
          quantity: data.quantity,
          delivery_method: data.deliveryMethod,
          preferred_date: data.preferredDate,
          preferred_time: data.preferredTime,
          notes: data.notes
        })
      });
      
      if (!response.ok) throw new Error('Failed to create donation');
      const result = await response.json();
      
      // Transform backend format to frontend format
      const donation: Donation = {
        id: result.data.id,
        donorId: result.data.donor_id,
        donorName: result.data.donor_name || 'Unknown',
        organizationId: result.data.organization_id,
        organizationName: data.organizationName,
        type: result.data.donation_type,
        quantity: result.data.quantity,
        deliveryMethod: result.data.delivery_method,
        preferredDate: result.data.preferred_date,
        preferredTime: result.data.preferred_time,
        notes: result.data.notes,
        status: result.data.status,
        createdAt: result.data.created_at,
        updatedAt: result.data.created_at
      };
      
      return donation;
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error;
    }
  },

  async getDonationById(id: string): Promise<Donation | null> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/users/donations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch donation');
      const result = await response.json();
      
      // Transform backend format to frontend format
      const donation: Donation = {
        id: result.data.id,
        donorId: result.data.donor_id,
        donorName: result.data.donor_name || 'Unknown',
        organizationId: result.data.organization_id,
        organizationName: result.data.organization_name || 'Unknown',
        type: result.data.donation_type,
        quantity: result.data.quantity,
        deliveryMethod: result.data.delivery_method,
        preferredDate: result.data.preferred_date,
        preferredTime: result.data.preferred_time,
        notes: result.data.notes,
        status: result.data.status,
        rewardPoints: result.data.reward_points,
        certificateUrl: result.data.certificate_url,
        createdAt: result.data.created_at,
        updatedAt: result.data.created_at
      };
      
      return donation;
    } catch (error) {
      console.error('Error fetching donation:', error);
      // Fallback to mock data
      await delay(300);
      return donations.find(d => d.id === id) || null;
    }
  },

  async updateDonationStatus(
    id: string,
    status: Donation["status"],
    rewardPoints?: number
  ): Promise<Donation> {
    try {
      // For organizations, use org_token
      const token = localStorage.getItem('org_token') || localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      let response;
      
      if (status === 'accepted') {
        // Accept donation
        response = await fetch(`${API_URL}/organizations/donations/${id}/accept`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else if (status === 'rejected') {
        // Reject donation
        response = await fetch(`${API_URL}/organizations/donations/${id}/reject`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            reason: 'Donation rejected by organization'
          })
        });
      } else if (status === 'completed') {
        // Complete donation with points
        if (!rewardPoints) throw new Error('Reward points required for completion');
        
        response = await fetch(`${API_URL}/organizations/donations/${id}/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            points_awarded: rewardPoints,
            certificate_url: '',
            certificate_number: ''
          })
        });
      } else {
        throw new Error('Invalid status');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update donation status`);
      }
      
      const result = await response.json();
      
      // Transform backend format to frontend format
      const donationData = result.data.donation || result.data;
      const donation: Donation = {
        id: donationData.id,
        donorId: donationData.donor_id,
        donorName: donationData.donor_name || 'Unknown',
        organizationId: donationData.organization_id,
        organizationName: donationData.organization_name || 'Unknown',
        type: donationData.donation_type,
        quantity: donationData.quantity,
        deliveryMethod: donationData.delivery_method,
        preferredDate: donationData.preferred_date || donationData.created_at,
        preferredTime: donationData.preferred_time || '10:00 AM',
        notes: donationData.notes,
        status: donationData.status,
        rewardPoints: result.data.points_awarded || rewardPoints,
        certificateUrl: result.data.certificate?.certificate_url,
        createdAt: donationData.created_at,
        updatedAt: new Date().toISOString()
      };
      
      return donation;
    } catch (error) {
      console.error('Error updating donation status:', error);
      throw error;
    }
  },

  async getLeaderboard(location?: string): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(`${API_URL}/public/leaderboard${location && location !== 'all' ? `?location=${location}` : ''}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const result = await response.json();
      
      // Transform backend data to frontend format
      const leaderboard: LeaderboardEntry[] = result.data.map((user: any) => ({
        rank: user.rank,
        userId: user.id,
        name: user.name,
        location: user.location || '',
        points: user.points || 0,
        badge: user.badge || 'bronze'
      }));
      
      return leaderboard;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback to mock data
      await delay(400);
      if (location && location !== "all") {
        return mockLeaderboard.filter(entry => 
          entry.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      return mockLeaderboard;
    }
  },
};
