# Supabase Authentication Setup

## Overview
This application uses Supabase Auth for user authentication with two distinct user types:
- **Donors** (Application Users)
- **Organizations**

## Configuration

### Environment Variables
Copy `.env.example` to `.env` and add your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important:** Never commit the `.env` file to version control. It's already included in `.gitignore`.

## User Types

### Donor (Application User)
- Sign up at `/signup`
- Login at `/login`
- User metadata includes:
  - `user_type`: 'donor'
  - `name`: User's full name
  - `phone`: Phone number
  - `points`: Reward points (default: 0)
  - `totalDonated`: Total amount donated (default: 0)
  - `donationCount`: Number of donations (default: 0)
  - `achievements`: Array of achievements

### Organization
- Sign up at `/org/signup`
- Login at `/org/login`
- User metadata includes:
  - `user_type`: 'organization'
  - `name`: Organization name
  - `description`: Organization description
  - `verificationStatus`: Verification status (default: 'pending')
  - `totalReceived`: Total donations received (default: 0)
  - `donorCount`: Number of donors (default: 0)
  - `activeRequests`: Number of active requests (default: 0)

## Authentication Flow

### Sign Up
1. User fills out registration form
2. Supabase creates user account with email/password
3. User metadata is stored in Supabase Auth
4. Email verification is sent (Supabase default)
5. User is redirected to login page

### Login
1. User enters email and password
2. Supabase validates credentials
3. User type is checked (donor vs organization)
4. If type matches the login form, user is authenticated
5. User is redirected to appropriate dashboard

### Logout
- Calls `supabase.auth.signOut()`
- Clears local session
- Redirects to home/login page

## Authentication Context

The `AuthContext` provides:
- `user`: Current logged-in donor (or null)
- `organization`: Current logged-in organization (or null)
- `isAuthenticated`: Boolean for donor authentication
- `isOrgAuthenticated`: Boolean for organization authentication
- `supabaseUser`: Raw Supabase user object
- `session`: Current Supabase session
- `loading`: Loading state during auth check
- `signupUser()`: Sign up a new donor
- `loginUser()`: Login a donor
- `logoutUser()`: Logout a donor
- `signupOrg()`: Sign up a new organization
- `loginOrg()`: Login an organization
- `logoutOrg()`: Logout an organization
- `updateUser()`: Update donor profile
- `updateOrg()`: Update organization profile

## Usage Example

```tsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, organization, isAuthenticated, loginUser } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const { error } = await loginUser(email, password);
    if (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <button onClick={() => handleLogin("user@example.com", "password")}>
          Login
        </button>
      )}
    </div>
  );
}
```

## Supabase Configuration Required

### 1. Email Authentication
Enable email authentication in Supabase Dashboard:
- Go to Authentication → Providers
- Enable Email provider
- Configure email templates (optional)

### 2. User Metadata
The application stores user type and profile data in `user_metadata`. No additional database tables are required for basic auth.

### 3. Row Level Security (RLS)
When you add database tables for donations, organizations, etc., make sure to:
- Enable RLS on all tables
- Create policies based on `auth.uid()`
- Use `user_metadata` to check user type in policies

Example RLS policy:
```sql
-- Only allow donors to insert donations
CREATE POLICY "Donors can create donations"
ON donations FOR INSERT
TO authenticated
USING (
  auth.jwt() ->> 'user_metadata' ->> 'user_type' = 'donor'
);
```

## Security Notes

1. **Environment Variables**: Never commit `.env` file
2. **Anon Key**: The anon key is safe to use client-side if RLS is properly configured
3. **User Type Validation**: Always validate user type on both client and server
4. **Email Verification**: Consider enforcing email verification before allowing actions
5. **Password Policy**: Minimum 6 characters (enforced in forms)

## Next Steps

1. Set up Supabase database tables for:
   - User profiles (additional fields beyond metadata)
   - Organization profiles
   - Donations
   - Donation requests
   
2. Configure RLS policies for all tables

3. Set up real-time subscriptions for notifications

4. Implement password reset flow

5. Add social authentication providers (optional)
