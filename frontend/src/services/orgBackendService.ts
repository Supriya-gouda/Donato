import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('org_token');
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Organization Profile Services
export const getOrgProfile = async () => {
  const response = await api.get('/organizations/profile');
  return response.data;
};

export const updateOrgProfile = async (profileData: {
  name?: string;
  description?: string;
  mission?: string;
  category?: string;
  location?: string;
  phone?: string;
  logo_url?: string;
  address?: string;
  registration_number?: string;
  website_url?: string;
  images?: string[];
  banner_url?: string;
}) => {
  const response = await api.put('/organizations/profile', profileData);
  return response.data;
};

export const getOrgDonations = async () => {
  const response = await api.get('/organizations/donations');
  return response.data;
};

export const getOrgDonationById = async (donationId: string) => {
  const response = await api.get(`/organizations/donations/${donationId}`);
  return response.data;
};

export const getOrgNeeds = async () => {
  const response = await api.get('/organizations/needs');
  return response.data;
};

export const createDonationNeed = async (needData: {
  title: string;
  description: string;
  category: string;
  target_amount: number;
  urgency: string;
}) => {
  const response = await api.post('/organizations/needs', needData);
  return response.data;
};

// Dashboard specific services
export const getOrgDashboard = async () => {
  const response = await api.get('/organizations/dashboard/stats');
  return response.data;
};

export const getPendingDonations = async () => {
  const response = await api.get('/organizations/donations');
  return response.data;
};

export const getDonationStats = async () => {
  const response = await api.get('/organizations/dashboard/stats');
  return response.data;
};

// Donation Management Services
export const acceptDonation = async (donationId: string) => {
  const response = await api.put(`/organizations/donations/${donationId}/accept`);
  return response.data;
};

export const completeDonation = async (donationId: string, certificateData: {
  certificate_url: string;
  certificate_number: string;
}) => {
  const response = await api.post(`/organizations/donations/${donationId}/complete`, certificateData);
  return response.data;
};

export const rejectDonation = async (donationId: string) => {
  const response = await api.put(`/organizations/donations/${donationId}/reject`);
  return response.data;
};
