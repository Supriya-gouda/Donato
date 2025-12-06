import axios from 'axios';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = 'http://localhost:8080/api';

// Get auth token from Supabase session
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Dashboard
export const getUserDashboard = async () => {
  const response = await api.get('/users/dashboard');
  return response.data;
};

// User Profile Services
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (profileData: {
  name?: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
}) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

// Organizations
export const getOrganizations = async (location?: string) => {
  const params = location ? { location } : {};
  const response = await api.get('/users/organizations', { params });
  return response.data;
};

export const getOrganizationById = async (id: string) => {
  const response = await api.get(`/users/organizations/${id}`);
  return response.data;
};

// Donations
export const createDonation = async (donationData: {
  organization_id: string;
  donation_need_id?: string;
  amount?: number;
  donation_type: string;
  items?: string[];
  message?: string;
}) => {
  const response = await api.post('/users/donations', donationData);
  return response.data;
};

export const getUserDonations = async () => {
  const response = await api.get('/users/donations');
  return response.data;
};

// Certificates
export const getUserCertificates = async () => {
  const response = await api.get('/users/certificates');
  return response.data;
};

// Leaderboard
export const getLeaderboard = async (location?: string) => {
  const params = location ? { location } : {};
  const response = await api.get('/users/leaderboard', { params });
  return response.data;
};

// Public Services (no auth required)
export const getAllOrganizations = async () => {
  const response = await api.get('/public/organizations');
  return response.data;
};

export const getPublicLeaderboard = async () => {
  const response = await api.get('/public/leaderboard');
  return response.data;
};
