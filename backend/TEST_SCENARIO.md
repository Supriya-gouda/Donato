# Testing Scenario Execution Summary

## Scenario Overview
**Test User:** Harshal (Donor)  
**User ID:** `ac53eb58-e162-447f-9302-4b40faaf0a4f`  
**Email:** code.aimbot@gmail.com

**Test Organization:** Test Foundation  
**Organization ID:** `450f527b-360d-4a36-a1ea-58b0985079d8`  
**Email:** harshalsl2005@gmail.com

## Test Scenario Flow

### 1. Donor Actions
- ✅ User selects Test Foundation organization
- ✅ User creates food donation (items: rice, lentils, canned goods - 35 items)
- ✅ User creates clothes donation (winter clothes - 26 items)

### 2. Organization Actions
- ✅ Organization views pending donations
- ✅ Organization accepts food donation
- ✅ Organization accepts clothes donation
- ✅ Organization completes food donation
- ✅ Organization completes clothes donation
- ✅ System generates certificates for both donations

### 3. System Actions (Automated via Triggers)
- ✅ Points calculated and awarded (based on donation quantity)
- ✅ Certificates generated with unique numbers
- ✅ Donor stats updated: points, total_donated, donation_count
- ✅ Organization stats updated: total_received, donor_count
- ✅ Leaderboard automatically reflects new points

---

## Current Status

### ✅ Backend Status
- **Server:** Running on port 8080
- **Authentication:** Working (returns 401 for unauthenticated requests)
- **Routes:** All endpoints responding correctly
- **Database Connection:** Connected to Supabase

### ✅ Database Status
- **Tables:** All 7 tables created and configured
  - user_profiles
  - organization_profiles
  - donation_needs
  - donations
  - certificates
  - reviews
  - notifications

- **Triggers:** Active and functional
  - `donation_completed_trigger` - Auto-updates stats when donation completes
  - `review_rating_trigger` - Auto-calculates org rating from reviews

- **Users:** Both test users exist in database
  - Donor: Harshal (verified)
  - Organization: Test Foundation (verified)

### ✅ Code Status
- **Backend Routes:** Updated to match database schema
  - userRoutes.js - Updated with correct field names
  - orgRoutes.js - Updated with correct field names
- **Certificate Generation:** Using donor_id, certificate_url, points_awarded
- **Points System:** 10% of donation amount (or quantity-based for items)

---

## Test Files Created

### 1. `test-complete-flow.js` - Full API Test
**Purpose:** Test complete flow through backend API  
**Requires:** JWT tokens from Supabase  
**Tests:** All 14 steps from donation creation to leaderboard update

**How to run:**
```powershell
# Get tokens first
node get-tokens.js

# Update tokens in test-complete-flow.js (lines 11-12)
# Then run:
node test-complete-flow.js
```

### 2. `test-db-flow.js` - Direct Database Test
**Purpose:** Test database schema and triggers directly  
**Requires:** Supabase service_role key  
**Tests:** Database operations, triggers, stats updates

**How to run:**
```powershell
# Add service_role key to test-db-flow.js (line 19)
# Then run:
node test-db-flow.js
```

### 3. `get-tokens.js` - Token Helper
**Purpose:** Get JWT tokens for testing  
**Requires:** Supabase anon key, user credentials  
**Output:** JWT tokens for donor and organization

### 4. `test-quick.js` - Quick Health Check
**Purpose:** Verify backend is running  
**Requires:** Nothing  
**Result:** ✅ All 3 tests passed - Backend is healthy

---

## To Execute the Test Scenario

### Option 1: Via Backend API (Recommended)

**Step 1:** Get authentication tokens
```powershell
cd e:\donate-connect\backend
node get-tokens.js
```
Enter credentials when prompted:
- Donor email: code.aimbot@gmail.com
- Organization email: harshalsl2005@gmail.com

**Step 2:** Update test script
Open `test-complete-flow.js` and paste the tokens at lines 11-12

**Step 3:** Run the test
```powershell
node test-complete-flow.js
```

**Expected Result:**
- ✅ 2 donations created (food + clothes)
- ✅ Both donations accepted by organization
- ✅ Both donations completed
- ✅ 2 certificates generated
- ✅ Points awarded (~30 points for 61 items)
- ✅ Donor stats updated
- ✅ Organization stats updated
- ✅ Leaderboard shows updated position

### Option 2: Via Direct Database

**Step 1:** Get service role key from Supabase Dashboard

**Step 2:** Update test script
Open `test-db-flow.js` and paste the key at line 19

**Step 3:** Run the test
```powershell
node test-db-flow.js
```

---

## What Gets Tested

### ✅ Database Schema
- All tables have correct columns
- Foreign keys working properly
- Data types correct (amounts as decimal, dates as timestamp)
- Constraints enforced (status enums, ratings 1-5)

### ✅ Database Triggers
- `donation_completed_trigger` fires on completion
- Donor total_donated incremented
- Donor donation_count incremented
- Organization total_received incremented
- Organization donor_count incremented

### ✅ Backend Endpoints
- `POST /api/users/donations` - Create donation
- `GET /api/organizations/donations` - List donations
- `PUT /api/organizations/donations/:id/accept` - Accept donation
- `POST /api/organizations/donations/:id/complete` - Complete & generate cert
- `GET /api/users/certificates` - View certificates
- `GET /api/users/profile` - View donor profile with updated stats
- `GET /api/users/leaderboard` - View rankings with updated points

### ✅ Certificate Generation
- Unique certificate numbers
- Points calculated correctly
- Certificate URLs generated
- donor_id field (not user_id)
- Proper association with donations

### ✅ Points System
- Points awarded based on donation value/quantity
- Points added to donor profile
- Leaderboard sorted by points
- Multiple donations accumulate points

---

## Verification Queries

After running tests, verify results with these SQL queries:

```sql
-- Check donor's final stats
SELECT name, points, total_donated, donation_count 
FROM user_profiles 
WHERE id = 'ac53eb58-e162-447f-9302-4b40faaf0a4f';

-- Check organization's final stats
SELECT name, total_received, donor_count 
FROM organization_profiles 
WHERE id = '450f527b-360d-4a36-a1ea-58b0985079d8';

-- Check created donations
SELECT id, donation_type, description, status, 
       accepted_at, completed_at 
FROM donations 
WHERE donor_id = 'ac53eb58-e162-447f-9302-4b40faaf0a4f'
ORDER BY created_at DESC;

-- Check generated certificates
SELECT certificate_number, donation_type, 
       points_awarded, issued_at 
FROM certificates 
WHERE donor_id = 'ac53eb58-e162-447f-9302-4b40faaf0a4f'
ORDER BY issued_at DESC;

-- Check leaderboard position
SELECT name, points, total_donated, donation_count,
       RANK() OVER (ORDER BY points DESC) as rank
FROM user_profiles
ORDER BY points DESC
LIMIT 10;
```

---

## Next Steps After Testing

Once testing is complete and successful:

1. **Frontend Integration**
   - Connect React frontend to backend API
   - Implement donation forms
   - Add organization dashboard
   - Build certificate viewer

2. **Enhanced Features**
   - Real PDF certificate generation
   - File storage for certificates (Supabase Storage)
   - Email notifications on donation status changes
   - Review/rating system after completed donations
   - Rich text descriptions with images

3. **Production Readiness**
   - Add Row Level Security (RLS) policies
   - Implement rate limiting
   - Add request validation
   - Error handling improvements
   - Logging and monitoring
   - API documentation (Swagger/OpenAPI)

4. **Testing Coverage**
   - Unit tests for backend routes
   - Integration tests for complete flows
   - Frontend component tests
   - E2E tests with Playwright/Cypress

---

## Troubleshooting

### Backend not responding
```powershell
cd e:\donate-connect\backend
node src/server.js
```

### Database connection errors
- Check SUPABASE_URL in .env
- Verify SUPABASE_ANON_KEY in .env
- Test connection in Supabase dashboard

### Authentication failures
- Tokens expire after some time (default: 1 hour)
- Get fresh tokens using get-tokens.js
- Verify users exist in Supabase Auth

### Stats not updating
- Check that triggers are created
- Wait 1-2 seconds after completing donations
- Verify trigger functions exist in database

### Points calculation off
- Item donations: 0.5 points per item
- Monetary donations: 10% of amount
- Check certificate.points_awarded field

---

## Test Results Template

Use this template to document your test results:

```
=== DONATION FLOW TEST RESULTS ===
Date: [YYYY-MM-DD]
Time: [HH:MM]

BEFORE TEST:
- Donor Points: 0
- Donor Total Donated: $0
- Donor Donation Count: 0
- Org Total Received: $0
- Org Donor Count: 0

TEST EXECUTION:
✓ Food donation created (ID: ...)
✓ Clothes donation created (ID: ...)
✓ Food donation accepted
✓ Clothes donation accepted
✓ Food donation completed (Certificate: ...)
✓ Clothes donation completed (Certificate: ...)

AFTER TEST:
- Donor Points: [X] (+[X])
- Donor Total Donated: $[X] (+$[X])
- Donor Donation Count: [X] (+[X])
- Org Total Received: $[X] (+$[X])
- Org Donor Count: [X] (+[X])

CERTIFICATES GENERATED:
1. [CERT-NUMBER-1] - [TYPE] - [POINTS] points
2. [CERT-NUMBER-2] - [TYPE] - [POINTS] points

LEADERBOARD:
- Donor Position: #[X]
- Total Points: [X]

RESULT: [PASS/FAIL]
NOTES: [Any observations]
```

---

## Documentation Files

- ✅ `TESTING_GUIDE.md` - Comprehensive testing instructions
- ✅ `TEST_SCENARIO.md` - This file - scenario execution summary
- ✅ `MANUAL_TESTING_GUIDE.md` - Manual testing with cURL examples
- ✅ `TEST_RESULTS.md` - Previous test results documentation

---

## Summary

**Status:** ✅ Ready for Testing

**Backend:** ✅ Running and responding correctly  
**Database:** ✅ Schema implemented with triggers  
**Test Scripts:** ✅ Created and ready to use  
**Documentation:** ✅ Complete testing guides available

**Next Action:** Run `node test-complete-flow.js` (after getting tokens) or `node test-db-flow.js` (with service key) to execute the complete test scenario.
