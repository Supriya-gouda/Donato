export type UserType = 'donor' | 'recipient';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  points?: number;        // For donors
  verified?: boolean;     // For recipient organizations
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  address: string;
  image: string;
  phone: string;
  email: string;
  website?: string;
  coordinates: Coordinates;
  distance: number;
  priorityLevel: number;   // 1-3 with 3 being highest priority
  verified: boolean;
  donationNeeds: DonationNeed[];
  donationCount: number;
  events?: boolean;        // If they accept event celebrations
}

export interface DonationNeed {
  id: string;
  type: DonationType;
  description: string;
  priority: number;        // 1-3 with 3 being highest priority
  quantity?: number;       // For quantifiable items
}

export type DonationType = 'food' | 'books' | 'clothes' | 'money' | 'infrastructure' | 'other';

export interface Donation {
  id: string;
  donorId: string;
  organizationId: string;
  type: DonationType;
  description: string;
  date: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  certificateId?: string;
  pointsAwarded?: number;
}

export interface Certificate {
  id: string;
  donationId: string;
  donorId: string;
  organizationId: string;
  date: string;
  verificationCode: string;
  downloadUrl: string;
}

export interface Event {
  id: string;
  donorId: string;
  organizationId: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  attendees?: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LeaderboardEntry {
  id: string;
  donorId: string;
  donorName: string;
  donorImage?: string;
  points: number;
  donationCount: number;
  rank: number;
}