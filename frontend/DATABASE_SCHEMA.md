# Supabase Database Schema Documentation

## Overview
This document describes the database schema for the Donatio platform, including all tables, relationships, Row Level Security (RLS) policies, and usage examples.

## Database Tables

### 1. user_profiles
Stores donor/user profile information, extending Supabase Auth users.

**Columns:**
- `id` (UUID, PK) - References auth.users.id
- `user_type` (user_type) - Either 'donor' or 'organization'
- `name` (TEXT, NOT NULL) - User's full name
- `phone` (TEXT, NULLABLE) - Phone number
- `location` (TEXT, NULLABLE) - User location
- `points` (INTEGER, DEFAULT 0) - Reward points
- `total_donated` (DECIMAL, DEFAULT 0) - Total amount donated
- `donation_count` (INTEGER, DEFAULT 0) - Number of donations made
- `achievements` (TEXT[], DEFAULT '{}') - Array of achievement badges
- `badge` (badge_type, DEFAULT 'bronze') - Current badge level
- `avatar_url` (TEXT, NULLABLE) - Profile picture URL
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

**Indexes:**
- `idx_user_profiles_user_type` - On user_type
- `idx_user_profiles_points` - On points DESC (for leaderboard)

**RLS Policies:**
- Anyone authenticated can view all profiles
- Users can only insert/update their own profile

### 2. organization_profiles
Stores organization profile information, extending Supabase Auth users.

**Columns:**
- `id` (UUID, PK) - References auth.users.id
- `name` (TEXT, NOT NULL) - Organization name
- `description` (TEXT, NULLABLE) - Organization description
- `mission` (TEXT, NULLABLE) - Mission statement
- `category` (TEXT, NULLABLE) - Organization category
- `location` (TEXT, NULLABLE) - Organization location
- `address` (TEXT, NULLABLE) - Physical address
- `registration_number` (TEXT, NULLABLE) - Registration/tax ID
- `phone` (TEXT, NULLABLE) - Contact phone
- `logo_url` (TEXT, NULLABLE) - Logo image URL
- `banner_url` (TEXT, NULLABLE) - Banner image URL
- `images` (TEXT[], DEFAULT '{}') - Additional images
- `verification_status` (verification_status, DEFAULT 'pending') - Verification status
- `total_received` (DECIMAL, DEFAULT 0) - Total donations received
- `donor_count` (INTEGER, DEFAULT 0) - Number of unique donors
- `active_requests` (INTEGER, DEFAULT 0) - Number of active donation requests
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

**Indexes:**
- `idx_organization_profiles_verification` - On verification_status
- `idx_organization_profiles_category` - On category

**RLS Policies:**
- Authenticated users can view verified organizations or their own
- Organizations can only insert/update their own profile

### 3. donation_needs
Tracks donation requests/needs posted by organizations.

**Columns:**
- `id` (UUID, PK, AUTO) - Unique identifier
- `organization_id` (UUID, NOT NULL) - References organization_profiles.id
- `title` (TEXT, NOT NULL) - Need title
- `description` (TEXT, NULLABLE) - Detailed description
- `category` (TEXT, NOT NULL) - Category of donation needed
- `urgency` (urgency_level, DEFAULT 'medium') - Urgency level
- `target_quantity` (TEXT, NULLABLE) - Target amount/quantity
- `current_quantity` (TEXT, NULLABLE) - Current progress
- `is_active` (BOOLEAN, DEFAULT TRUE) - Whether the need is still active
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

**Indexes:**
- `idx_donation_needs_organization` - On organization_id
- `idx_donation_needs_active` - On is_active

**RLS Policies:**
- Anyone can view active donation needs
- Organizations can manage their own donation needs

### 4. donations
Tracks all donation transactions between donors and organizations.

**Columns:**
- `id` (UUID, PK, AUTO) - Unique identifier
- `donor_id` (UUID, NOT NULL) - References user_profiles.id
- `organization_id` (UUID, NOT NULL) - References organization_profiles.id
- `donation_need_id` (UUID, NULLABLE) - References donation_needs.id
- `type` (TEXT, NOT NULL) - Type of donation
- `quantity` (TEXT, NOT NULL) - Quantity/amount
- `category` (TEXT, NOT NULL) - Category
- `delivery_method` (delivery_method, NOT NULL) - 'pickup' or 'dropoff'
- `preferred_date` (DATE, NULLABLE) - Preferred delivery date
- `preferred_time` (TEXT, NULLABLE) - Preferred delivery time
- `notes` (TEXT, NULLABLE) - Additional notes
- `status` (donation_status, DEFAULT 'pending') - Current status
- `reward_points` (INTEGER, NULLABLE) - Points awarded
- `certificate_url` (TEXT, NULLABLE) - Certificate URL
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

**Indexes:**
- `idx_donations_donor` - On donor_id
- `idx_donations_organization` - On organization_id
- `idx_donations_status` - On status

**RLS Policies:**
- Users can view donations they're involved in (as donor or organization)
- Donors can create donations
- Donors can update pending donations
- Organizations can update donations sent to them

### 5. certificates
Stores donation certificates issued to donors.

**Columns:**
- `id` (UUID, PK, AUTO) - Unique identifier
- `donation_id` (UUID, NOT NULL) - References donations.id
- `user_id` (UUID, NOT NULL) - References user_profiles.id
- `certificate_url` (TEXT, NOT NULL) - Certificate file URL
- `issued_at` (TIMESTAMPTZ, DEFAULT NOW()) - Issue timestamp

**RLS Policies:**
- Users can view their own certificates
- System can insert certificates

## Enum Types

### user_type
- `donor` - Regular user who makes donations
- `organization` - Organization receiving donations

### verification_status
- `pending` - Awaiting verification
- `verified` - Verified organization
- `rejected` - Verification rejected

### donation_status
- `pending` - Donation created, awaiting acceptance
- `accepted` - Organization accepted the donation
- `rejected` - Organization rejected the donation
- `completed` - Donation completed successfully
- `cancelled` - Donation cancelled

### delivery_method
- `pickup` - Organization will pick up the donation
- `dropoff` - Donor will drop off the donation

### urgency_level
- `low` - Low urgency
- `medium` - Medium urgency
- `high` - High urgency

### badge_type
- `bronze` - Bronze badge (0-100 points)
- `silver` - Silver badge (101-500 points)
- `gold` - Gold badge (501-1000 points)
- `platinum` - Platinum badge (1000+ points)

## Database Triggers

### Auto-create Profile on Signup
**Trigger:** `on_auth_user_created`
**Function:** `handle_new_user()`

Automatically creates a user_profile or organization_profile record when a new user signs up, based on the `user_type` in their metadata.

### Auto-update updated_at
**Triggers:** 
- `update_user_profiles_updated_at`
- `update_organization_profiles_updated_at`
- `update_donation_needs_updated_at`
- `update_donations_updated_at`

**Function:** `update_updated_at_column()`

Automatically updates the `updated_at` timestamp whenever a record is modified.

## Relationships

```
auth.users (Supabase Auth)
    ↓
    ├── user_profiles (donor profiles)
    │       ↓
    │       └── donations (as donor)
    │               ↓
    │               └── certificates
    │
    └── organization_profiles (organization profiles)
            ↓
            ├── donation_needs (posted by org)
            └── donations (received by org)
```

## Usage Examples

### Creating a Donation
```typescript
import { donationService } from '@/services/supabaseService';

const donation = await donationService.create({
  donor_id: user.id,
  organization_id: org.id,
  type: 'Food',
  quantity: '10 kg',
  category: 'food',
  delivery_method: 'dropoff',
  preferred_date: '2025-12-10',
  notes: 'Fresh vegetables',
});
```

### Getting User Donations
```typescript
const donations = await donationService.getByDonor(userId);
```

### Getting Leaderboard
```typescript
import { userProfileService } from '@/services/supabaseService';

const topDonors = await userProfileService.getLeaderboard(10);
```

### Creating Donation Need
```typescript
import { donationNeedsService } from '@/services/supabaseService';

const need = await donationNeedsService.create({
  organization_id: org.id,
  title: 'Winter Clothing Drive',
  description: 'We need warm clothes for winter',
  category: 'clothing',
  urgency: 'high',
  target_quantity: '100 items',
});
```

### Getting Verified Organizations
```typescript
import { organizationProfileService } from '@/services/supabaseService';

const orgs = await organizationProfileService.getVerifiedOrganizations();
```

## Security Considerations

1. **Row Level Security (RLS)** is enabled on all tables
2. **User profiles** are automatically created via trigger
3. **Verified organizations** are the only ones visible to donors
4. **Donors** can only modify their own pending donations
5. **Organizations** can only manage their own data
6. All sensitive operations require authentication

## Migration Notes

The database schema is created using the following SQL files:
- Tables and types creation
- Indexes for performance
- RLS policies for security
- Triggers for automation
- Permissions grants

All migrations have been applied to the Supabase project: **Donatio** (xtalowxxymzlsyhajway)
