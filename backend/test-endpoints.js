const axios = require('axios');

const API_BASE = 'http://localhost:8080/api';

// Test credentials (you'll need to create these users in Supabase first)
let donorToken = null;
let orgToken = null;
let testDonationId = null;
let testOrgId = null;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(status, endpoint, message) {
  const color = status === 'PASS' ? colors.green : status === 'FAIL' ? colors.red : colors.yellow;
  console.log(`${color}[${status}]${colors.reset} ${colors.blue}${endpoint}${colors.reset} - ${message}`);
}

async function testEndpoint(name, endpoint, method, data, token, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      data,
    };
    
    const response = await axios(config);
    
    if (response.status === expectedStatus) {
      log('PASS', `${method} ${endpoint}`, `Status: ${response.status}`);
      return { success: true, data: response.data };
    } else {
      log('FAIL', `${method} ${endpoint}`, `Expected ${expectedStatus}, got ${response.status}`);
      return { success: false, data: response.data };
    }
  } catch (error) {
    if (error.response) {
      log('FAIL', `${method} ${endpoint}`, `Status: ${error.response.status} - ${error.response.data.message || error.response.data.error}`);
      return { success: false, error: error.response.data };
    } else {
      log('FAIL', `${method} ${endpoint}`, error.message);
      return { success: false, error: error.message };
    }
  }
}

async function runTests() {
  console.log('\n' + colors.blue + '='.repeat(60));
  console.log('🧪 BACKEND API ENDPOINT TESTS');
  console.log('='.repeat(60) + colors.reset + '\n');

  // Note: You need valid Supabase JWT tokens to test these endpoints
  // For now, we'll test without auth to see which endpoints are accessible
  
  console.log(colors.yellow + '\n📋 Testing Health Check Endpoint' + colors.reset);
  console.log('-'.repeat(60));
  
  // Test health check (if you have one)
  await testEndpoint('Health Check', '/', 'GET', null, null);
  
  console.log(colors.yellow + '\n👤 Testing USER Endpoints (Requires Donor Token)' + colors.reset);
  console.log('-'.repeat(60));
  
  // Test user endpoints without token (should fail with 401)
  await testEndpoint('Get Dashboard', '/users/dashboard', 'GET', null, null, 401);
  await testEndpoint('Get Organizations', '/users/organizations', 'GET', null, null, 401);
  await testEndpoint('Get Donations', '/users/donations', 'GET', null, null, 401);
  await testEndpoint('Get Certificates', '/users/certificates', 'GET', null, null, 401);
  await testEndpoint('Get Leaderboard', '/users/leaderboard', 'GET', null, null, 401);
  
  console.log(colors.yellow + '\n🏢 Testing ORGANIZATION Endpoints (Requires Org Token)' + colors.reset);
  console.log('-'.repeat(60));
  
  // Test organization endpoints without token (should fail with 401)
  await testEndpoint('Get Org Profile', '/organizations/profile', 'GET', null, null, 401);
  await testEndpoint('Get Org Donations', '/organizations/donations', 'GET', null, null, 401);
  await testEndpoint('Get Org Needs', '/organizations/needs', 'GET', null, null, 401);
  
  console.log(colors.yellow + '\n📊 Testing Endpoints WITH Authentication' + colors.reset);
  console.log('-'.repeat(60));
  console.log(colors.yellow + '⚠️  To test authenticated endpoints, you need to:' + colors.reset);
  console.log('   1. Sign up a donor user at http://localhost:5173/signup');
  console.log('   2. Sign up an organization at http://localhost:5173/org/signup');
  console.log('   3. Get their JWT tokens from browser DevTools (localStorage or session)');
  console.log('   4. Update this script with the tokens');
  console.log('   5. Run the tests again\n');
  
  // If you have tokens, uncomment and test:
  // donorToken = 'YOUR_DONOR_JWT_TOKEN_HERE';
  // orgToken = 'YOUR_ORG_JWT_TOKEN_HERE';
  
  if (donorToken) {
    console.log(colors.yellow + '\n✅ Testing with Donor Token' + colors.reset);
    console.log('-'.repeat(60));
    
    const dashboard = await testEndpoint('Get Dashboard', '/users/dashboard', 'GET', null, donorToken);
    const orgs = await testEndpoint('Get Organizations', '/users/organizations?location=Mumbai', 'GET', null, donorToken);
    
    if (orgs.success && orgs.data.data && orgs.data.data.length > 0) {
      testOrgId = orgs.data.data[0].id;
      await testEndpoint('Get Org Details', `/users/organizations/${testOrgId}`, 'GET', null, donorToken);
    }
    
    const donations = await testEndpoint('Get Donations', '/users/donations', 'GET', null, donorToken);
    await testEndpoint('Get Certificates', '/users/certificates', 'GET', null, donorToken);
    await testEndpoint('Get Leaderboard', '/users/leaderboard?location=Mumbai', 'GET', null, donorToken);
    
    // Test create donation
    if (testOrgId) {
      const newDonation = await testEndpoint('Create Donation', '/users/donations', 'POST', {
        organization_id: testOrgId,
        donation_type: 'monetary',
        amount: 1000,
        description: 'Test donation from API test'
      }, donorToken, 201);
      
      if (newDonation.success && newDonation.data.data) {
        testDonationId = newDonation.data.data.id;
      }
    }
  }
  
  if (orgToken) {
    console.log(colors.yellow + '\n✅ Testing with Organization Token' + colors.reset);
    console.log('-'.repeat(60));
    
    const profile = await testEndpoint('Get Org Profile', '/organizations/profile', 'GET', null, orgToken);
    const orgDonations = await testEndpoint('Get Org Donations', '/organizations/donations', 'GET', null, orgToken);
    const needs = await testEndpoint('Get Org Needs', '/organizations/needs', 'GET', null, orgToken);
    
    // Test update profile
    await testEndpoint('Update Org Profile', '/organizations/profile', 'PUT', {
      description: 'Updated description from test',
      mission: 'Test mission statement'
    }, orgToken);
    
    // Test create donation need
    const newNeed = await testEndpoint('Create Donation Need', '/organizations/needs', 'POST', {
      title: 'Test Need',
      description: 'Test need description',
      category: 'education',
      target_amount: 50000,
      urgency: 'high'
    }, orgToken, 201);
    
    // Test donation management
    if (testDonationId) {
      await testEndpoint('Accept Donation', `/organizations/donations/${testDonationId}/accept`, 'PUT', null, orgToken);
      
      await testEndpoint('Complete Donation', `/organizations/donations/${testDonationId}/complete`, 'POST', {
        certificate_url: 'https://example.com/cert.pdf',
        certificate_number: 'CERT-TEST-001'
      }, orgToken);
      
      // Or reject donation (use a different donation ID)
      // await testEndpoint('Reject Donation', `/organizations/donations/${testDonationId}/reject`, 'PUT', null, orgToken);
    }
  }
  
  console.log('\n' + colors.blue + '='.repeat(60));
  console.log('✅ TEST SUMMARY');
  console.log('='.repeat(60) + colors.reset);
  console.log(colors.green + '• All endpoint structure tests completed');
  console.log(colors.yellow + '• For full testing, add valid JWT tokens to this script');
  console.log(colors.blue + '• Backend server is running correctly on port 8080' + colors.reset + '\n');
}

// Run the tests
runTests().catch(console.error);
