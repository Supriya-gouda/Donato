# Manual Testing Guide: Complete Donation Flow

## 🎯 Objective
Test the complete donation lifecycle from creation to certificate generation using the provided user credentials.

## 👥 Test Credentials
- **Donor UID**: `ac53eb58-e162-447f-9302-4b40faaf0a4f`
- **Organization UID**: `450f527b-360d-4a36-a1ea-58b0985079d8`

---

## 📋 Step-by-Step Testing Process

### Step 1: Get JWT Tokens

#### For Donor:
1. Open browser: `http://localhost:5173/signup`
2. Sign in with your donor account
3. Open DevTools (F12)
4. Go to: **Application** → **Local Storage** → `http://localhost:5173`
5. Find the Supabase session object
6. Copy the `access_token` value
7. Save it as `DONOR_TOKEN`

#### For Organization:
1. Open browser (new tab/incognito): `http://localhost:5173/org/signup`
2. Sign in with your organization account
3. Open DevTools (F12)
4. Go to: **Application** → **Local Storage** → `http://localhost:5173`
5. Find the Supabase session object
6. Copy the `access_token` value
7. Save it as `ORG_TOKEN`

---

### Step 2: Create Donation (As Donor)

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer DONOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organization_id": "450f527b-360d-4a36-a1ea-58b0985079d8",
    "donation_type": "monetary",
    "amount": 5000,
    "description": "Educational support for underprivileged children"
  }' \
  http://localhost:8080/api/users/donations
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "donation-uuid-here",
    "donor_id": "ac53eb58-e162-447f-9302-4b40faaf0a4f",
    "organization_id": "450f527b-360d-4a36-a1ea-58b0985079d8",
    "donation_type": "monetary",
    "amount": 5000,
    "status": "pending",
    "description": "Educational support for underprivileged children",
    "created_at": "2025-12-05T..."
  },
  "message": "Donation created successfully"
}
```

**📝 Save the `donation_id` from the response!**

---

### Step 3: View Pending Donations (As Organization)

**Request:**
```bash
curl -H "Authorization: Bearer ORG_TOKEN" \
  http://localhost:8080/api/organizations/donations
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "donation-uuid-here",
      "donor_id": "ac53eb58-e162-447f-9302-4b40faaf0a4f",
      "amount": 5000,
      "status": "pending",
      "donor_profile": {
        "name": "John Doe",
        "email": "donor@example.com"
      }
    }
  ]
}
```

---

### Step 4: Accept Donation (As Organization)

**Request:**
```bash
curl -X PUT \
  -H "Authorization: Bearer ORG_TOKEN" \
  http://localhost:8080/api/organizations/donations/DONATION_ID/accept
```

**Replace `DONATION_ID` with the actual donation ID from Step 2**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "donation-uuid-here",
    "status": "accepted",
    "accepted_at": "2025-12-05T..."
  },
  "message": "Donation accepted successfully"
}
```

---

### Step 5: Complete Donation & Generate Certificate (As Organization)

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer ORG_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "certificate_url": "https://storage.example.com/certificates/CERT-2025-001.pdf",
    "certificate_number": "CERT-2025-001"
  }' \
  http://localhost:8080/api/organizations/donations/DONATION_ID/complete
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "donation": {
      "id": "donation-uuid-here",
      "status": "completed",
      "completed_at": "2025-12-05T..."
    },
    "certificate": {
      "id": "certificate-uuid",
      "certificate_number": "CERT-2025-001",
      "certificate_url": "https://storage.example.com/certificates/CERT-2025-001.pdf",
      "points_awarded": 500,
      "issued_at": "2025-12-05T..."
    },
    "points_awarded": 500
  },
  "message": "Donation completed and certificate generated"
}
```

---

### Step 6: Verify Results (As Donor)

#### 6.1 Check Updated Dashboard

**Request:**
```bash
curl -H "Authorization: Bearer DONOR_TOKEN" \
  http://localhost:8080/api/users/dashboard
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "ac53eb58-e162-447f-9302-4b40faaf0a4f",
      "name": "John Doe",
      "points": 500,
      "total_donated": 5000,
      "location": "Mumbai"
    },
    "stats": {
      "total_donations": 1,
      "pending_donations": 0,
      "completed_donations": 1,
      "total_amount": 5000
    },
    "recent_donations": [...]
  }
}
```

#### 6.2 View Certificates

**Request:**
```bash
curl -H "Authorization: Bearer DONOR_TOKEN" \
  http://localhost:8080/api/users/certificates
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "certificate-uuid",
      "certificate_number": "CERT-2025-001",
      "certificate_url": "https://storage.example.com/certificates/CERT-2025-001.pdf",
      "points_awarded": 500,
      "amount": 5000,
      "donation_type": "monetary",
      "organization_name": "Helping Hands Foundation",
      "issued_at": "2025-12-05T..."
    }
  ]
}
```

#### 6.3 Check Leaderboard Position

**Request:**
```bash
curl -H "Authorization: Bearer DONOR_TOKEN" \
  "http://localhost:8080/api/users/leaderboard?location=Mumbai"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ac53eb58-e162-447f-9302-4b40faaf0a4f",
      "name": "John Doe",
      "points": 500,
      "total_donated": 5000,
      "rank": 1
    },
    ...
  ]
}
```

---

## ✅ Verification Checklist

- [ ] Donation created successfully with status "pending"
- [ ] Organization can view the pending donation
- [ ] Donation status changed to "accepted"
- [ ] Donation completed with certificate generated
- [ ] Points awarded to donor (10% of donation amount)
- [ ] Donor dashboard shows updated points and stats
- [ ] Certificate stored in database
- [ ] Donor can retrieve certificate
- [ ] Leaderboard reflects new points

---

## 🔄 Testing Multiple Donations

To test multiple donations, repeat Steps 2-5 with different amounts:

```bash
# Donation 1: ₹5,000 (500 points)
# Donation 2: ₹10,000 (1000 points)
# Donation 3: ₹2,500 (250 points)
```

**Total Expected Points**: 1,750  
**Total Expected Amount**: ₹17,500

---

## 🧪 Alternative: Using Postman/Thunder Client

1. **Import Collection**: Create a new collection with the above requests
2. **Set Environment Variables**:
   - `DONOR_TOKEN`: Your donor JWT token
   - `ORG_TOKEN`: Your organization JWT token
   - `BASE_URL`: `http://localhost:8080/api`
   - `DONATION_ID`: Save from create donation response

3. **Execute Requests in Order**:
   - POST Create Donation
   - GET View Organization Donations
   - PUT Accept Donation
   - POST Complete Donation
   - GET View Dashboard
   - GET View Certificates
   - GET View Leaderboard

---

## 🐛 Troubleshooting

### Issue: "No token provided"
**Solution**: Ensure you're including the Authorization header with Bearer token

### Issue: "Invalid token"
**Solution**: Token might be expired. Sign in again and get a fresh token

### Issue: "Donation not found"
**Solution**: Verify you're using the correct donation_id from the creation response

### Issue: "User not authorized"
**Solution**: Ensure you're using the donor token for donor endpoints and org token for org endpoints

---

## 📊 Expected Database State After Testing

### `donations` table:
- Status: `completed`
- Donor ID: `ac53eb58-e162-447f-9302-4b40faaf0a4f`
- Organization ID: `450f527b-360d-4a36-a1ea-58b0985079d8`
- Amount: `5000`

### `certificates` table:
- New certificate record created
- Linked to donation
- Points awarded: `500`

### `user_profiles` table:
- Points updated: `+500`
- Total donated updated: `+5000`

### `organization_profiles` table:
- Total donations received updated
- Completed donations count increased

---

## 🎉 Success Criteria

✅ **All steps completed without errors**  
✅ **Certificate generated with correct details**  
✅ **Points awarded = 10% of donation amount**  
✅ **All database records updated correctly**  
✅ **Donor can view certificate and updated stats**
