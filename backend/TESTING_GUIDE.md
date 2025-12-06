# Complete Donation Flow Testing Guide

## Test Scenario

**Donor:** Harshal (UID: `ac53eb58-e162-447f-9302-4b40faaf0a4f`)  
**Organization:** Test Foundation (UID: `450f527b-360d-4a36-a1ea-58b0985079d8`)

### Flow:
1. Donor donates food items
2. Donor donates clothes
3. Organization accepts both donations
4. Organization completes both donations
5. Certificates generated for both donations
6. Points awarded to donor
7. Leaderboard updated

---

## Option 1: Test via Backend API (Recommended)

This tests the complete backend API endpoints with authentication.

### Step 1: Get JWT Tokens

You have two options to get JWT tokens:

#### Option A: Use Supabase Dashboard
1. Go to Supabase Dashboard > Authentication > Users
2. Find the donor user (code.aimbot@gmail.com)
3. Click on the user to view details
4. Copy the JWT token or reset password to login

#### Option B: Use the token helper script
```powershell
cd e:\donate-connect\backend
node get-tokens.js
```

Follow the prompts to enter email/password for both users.

### Step 2: Update Test Script

Open `test-complete-flow.js` and paste the tokens at lines 11-12:
```javascript
const DONOR_TOKEN = 'eyJhbGc...'; // Your actual token
const ORG_TOKEN = 'eyJhbGc...';   // Your actual token
```

### Step 3: Run the Test

Make sure backend is running:
```powershell
# Terminal 1 - Start backend
cd e:\donate-connect\backend
node src/server.js
```

Then run the test:
```powershell
# Terminal 2 - Run test
cd e:\donate-connect\backend
node test-complete-flow.js
```

### Expected Output:
```
============================================================
STEP 1: Get Donor Profile (Before)
============================================================
✓ Donor profile retrieved
ℹ Current Points: 0
ℹ Total Donated: $0
ℹ Donation Count: 0

============================================================
STEP 2: Get Organization Profile (Before)
============================================================
✓ Organization profile retrieved
...

============================================================
STEP 4: Donate Food Items
============================================================
✓ Food donation created successfully
ℹ Donation ID: ...
ℹ Status: pending

... (continues through all steps)

============================================================
TEST SUMMARY
============================================================
✓ Food donation created, accepted, and completed
✓ Clothes donation created, accepted, and completed
✓ Certificates generated for both donations
✓ Points awarded to donor
✓ Donor profile updated with stats
✓ Organization stats updated
✓ Leaderboard reflects new points

All steps completed successfully! 🎉
```

---

## Option 2: Test via Direct Database (Faster)

This bypasses the backend and tests the database schema, triggers, and constraints directly.

### Step 1: Get Service Role Key

1. Go to Supabase Dashboard > Project Settings > API
2. Copy the **service_role** key (⚠️ Keep this secret!)
3. Open `test-db-flow.js`
4. Paste the key at line 19

### Step 2: Run the Test

```powershell
cd e:\donate-connect\backend
node test-db-flow.js
```

### Expected Output:
```
======================================================================
STEP 1: Get Initial State
======================================================================
✓ Donor: Harshal
  Email: code.aimbot@gmail.com
  Points: 0
  Total Donated: $0.00
  Donation Count: 0

✓ Organization: Test Foundation
  Email: harshalsl2005@gmail.com
  Total Received: $0.00
  Donor Count: 0

======================================================================
STEP 2: Create Food Donation
======================================================================
✓ Food donation created
  ID: ...
  Type: items
  Quantity: 35 items
  Status: pending

... (continues through all steps)

======================================================================
✅ TEST COMPLETED SUCCESSFULLY
======================================================================
✓ Food donation: Created → Accepted → Completed → Certificate Generated
✓ Clothes donation: Created → Accepted → Completed → Certificate Generated
✓ Total Points Awarded: 30
✓ Donor stats updated by triggers
✓ Organization stats updated by triggers
✓ Leaderboard reflects new points

🎉 All database operations completed successfully!
```

---

## What Gets Tested

### Database Operations:
- ✅ Creating donations with item descriptions
- ✅ Accepting donations (status change)
- ✅ Completing donations (status + timestamp)
- ✅ Generating certificates with points
- ✅ Updating user points
- ✅ Automatic stats updates via triggers

### Database Triggers:
- ✅ `donation_completed_trigger` - Auto-updates donor and org stats
- ✅ Stats include: total_donated, donation_count, total_received, donor_count

### Backend Endpoints (Option 1 only):
- ✅ `GET /api/users/profile` - Get donor profile
- ✅ `GET /api/users/organizations/:id` - Get organization details
- ✅ `GET /api/users/organizations/:id/needs` - Get donation needs
- ✅ `POST /api/users/donations` - Create donation
- ✅ `GET /api/organizations/donations` - List org donations
- ✅ `PUT /api/organizations/donations/:id/accept` - Accept donation
- ✅ `POST /api/organizations/donations/:id/complete` - Complete & generate cert
- ✅ `GET /api/users/certificates` - Get donor certificates
- ✅ `GET /api/users/leaderboard` - View leaderboard

---

## Verify Results

### Check Database Directly:

```sql
-- Check donor stats
SELECT name, points, total_donated, donation_count 
FROM user_profiles 
WHERE id = 'ac53eb58-e162-447f-9302-4b40faaf0a4f';

-- Check organization stats
SELECT name, total_received, donor_count 
FROM organization_profiles 
WHERE id = '450f527b-360d-4a36-a1ea-58b0985079d8';

-- Check donations
SELECT id, donation_type, description, status, completed_at 
FROM donations 
WHERE donor_id = 'ac53eb58-e162-447f-9302-4b40faaf0a4f' 
ORDER BY created_at DESC;

-- Check certificates
SELECT certificate_number, donation_type, points_awarded, issued_at 
FROM certificates 
WHERE donor_id = 'ac53eb58-e162-447f-9302-4b40faaf0a4f' 
ORDER BY issued_at DESC;

-- Check leaderboard
SELECT name, points, total_donated, donation_count 
FROM user_profiles 
ORDER BY points DESC 
LIMIT 10;
```

### Manual Testing via Frontend:

1. Start frontend: `cd e:\donate-connect\frontend; npm run dev`
2. Login as donor (code.aimbot@gmail.com)
3. Browse organizations and select Test Foundation
4. Make donations (food, clothes)
5. Logout and login as organization (harshalsl2005@gmail.com)
6. View pending donations
7. Accept and complete donations
8. Logout and login back as donor
9. Check profile for new points
10. View certificates
11. Check leaderboard position

---

## Troubleshooting

### Backend not running:
```powershell
cd e:\donate-connect\backend
node src/server.js
```

### Authentication errors:
- Make sure JWT tokens are fresh (they expire)
- Verify the users exist in Supabase Auth
- Check that UIDs match the users in the database

### Database connection errors:
- Verify Supabase URL and keys in backend/.env
- Check that database tables exist
- Verify triggers are created

### Points not updating:
- Check that triggers exist: `donation_completed_trigger`
- Verify trigger function: `update_org_stats_on_donation()`
- Wait 1-2 seconds after completing donations

### Certificates not generated:
- Check certificates table schema
- Verify donor_id field (not user_id)
- Check that organization has permission

---

## Clean Up Test Data (Optional)

If you want to reset the test data:

```sql
-- Delete test certificates
DELETE FROM certificates 
WHERE donor_id = 'ac53eb58-e162-447f-9302-4b40faaf0a4f';

-- Delete test donations
DELETE FROM donations 
WHERE donor_id = 'ac53eb58-e162-447f-9302-4b40faaf0a4f';

-- Reset donor stats
UPDATE user_profiles 
SET points = 0, total_donated = 0, donation_count = 0 
WHERE id = 'ac53eb58-e162-447f-9302-4b40faaf0a4f';

-- Reset organization stats
UPDATE organization_profiles 
SET total_received = 0, donor_count = 0 
WHERE id = '450f527b-360d-4a36-a1ea-58b0985079d8';
```

---

## Next Steps

After successful testing:

1. ✅ Database schema is working correctly
2. ✅ Triggers are functioning properly
3. ✅ Backend endpoints are connected
4. ✅ Certificate generation is working
5. ✅ Points system is operational
6. ✅ Leaderboard updates automatically

You can now:
- Implement the frontend components
- Add real certificate PDF generation
- Set up file storage for certificates
- Add email notifications
- Implement review/rating system
- Add more complex donation flows
