export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  points: number;
  totalDonated?: number;
  donationCount?: number;
  achievements?: string[];
  badge?: "bronze" | "silver" | "gold" | "platinum";
  avatarUrl?: string;
  createdAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone?: string;
  description: string;
  logo?: string;
  mission?: string;
  category?: string;
  location?: string;
  address?: string;
  registrationNumber?: string;
  logoUrl?: string;
  bannerUrl?: string;
  images?: string[];
  verificationStatus?: "pending" | "verified" | "rejected";
  emailVerified?: boolean;
  totalReceived?: number;
  donorCount?: number;
  activeRequests?: number;
  donationNeeds?: DonationNeed[];
  totalDonations?: number;
  createdAt?: string;
}

export interface DonationNeed {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: "low" | "medium" | "high";
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  organizationId: string;
  organizationName: string;
  type: string;
  quantity: string;
  deliveryMethod: "pickup" | "dropoff";
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  rewardPoints?: number;
  certificateUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  location: string;
  points: number;
  badge: "bronze" | "silver" | "gold" | "platinum";
}

export interface Certificate {
  id: string;
  donationId: string;
  userId: string;
  organizationName: string;
  donationType: string;
  date: string;
  downloadUrl: string;
}

export type DonationCategory = 
  | "food"
  | "clothing"
  | "books"
  | "electronics"
  | "furniture"
  | "medical"
  | "monetary"
  | "other";

export type OrganizationCategory =
  | "education"
  | "healthcare"
  | "environment"
  | "animal-welfare"
  | "poverty-relief"
  | "disaster-relief"
  | "elderly-care"
  | "other";
