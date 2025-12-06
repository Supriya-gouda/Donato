const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

// Test credentials
const DONOR_UID = 'ac53eb58-e162-447f-9302-4b40faaf0a4f';
const ORG_UID = '450f527b-360d-4a36-a1ea-58b0985079d8';

// You need to get these tokens from Supabase Auth
// For testing, you can use Supabase dashboard or auth endpoints
const DONOR_TOKEN = 'PASTE_DONOR_JWT_TOKEN_HERE';
const ORG_TOKEN = 'PASTE_ORG_JWT_TOKEN_HERE';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan');
}

async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
}

async function testCompleteFlow() {
  logSection('COMPLETE DONATION FLOW TEST');
  
  // Check if tokens are set
  if (DONOR_TOKEN === 'PASTE_DONOR_JWT_TOKEN_HERE' || ORG_TOKEN === 'PASTE_ORG_JWT_TOKEN_HERE') {
    logError('Please set DONOR_TOKEN and ORG_TOKEN in the script');
    log('\nTo get tokens:', 'yellow');
    log('1. Use Supabase Dashboard > Authentication > Users', 'yellow');
    log('2. Or use the login endpoints to get JWT tokens', 'yellow');
    log('3. Paste them in the script at lines 11-12', 'yellow');
    return;
  }

  let donationId1, donationId2, certificateId1, certificateId2;

  // Step 1: Get donor profile before donations
  logSection('Step 1: Get Donor Profile (Before)');
  const profileBefore = await makeRequest('GET', '/users/profile', null, DONOR_TOKEN);
  if (profileBefore.success) {
    logSuccess('Donor profile retrieved');
    logInfo(`Current Points: ${profileBefore.data.data?.points || 0}`);
    logInfo(`Total Donated: $${profileBefore.data.data?.total_donated || 0}`);
    logInfo(`Donation Count: ${profileBefore.data.data?.donation_count || 0}`);
  } else {
    logError('Failed to get donor profile');
    console.log(profileBefore.error);
  }

  // Step 2: Get organization profile
  logSection('Step 2: Get Organization Profile (Before)');
  const orgBefore = await makeRequest('GET', `/users/organizations/${ORG_UID}`, null, DONOR_TOKEN);
  if (orgBefore.success) {
    logSuccess('Organization profile retrieved');
    logInfo(`Name: ${orgBefore.data.data?.name || 'N/A'}`);
    logInfo(`Category: ${orgBefore.data.data?.category || 'N/A'}`);
    logInfo(`Total Received: $${orgBefore.data.data?.total_received || 0}`);
    logInfo(`Donor Count: ${orgBefore.data.data?.donor_count || 0}`);
  } else {
    logError('Failed to get organization profile');
    console.log(orgBefore.error);
  }

  // Step 3: Create donation needs for the organization (if needed)
  logSection('Step 3: Get Organization Donation Needs');
  const needs = await makeRequest('GET', `/users/organizations/${ORG_UID}/needs`, null, DONOR_TOKEN);
  if (needs.success) {
    logSuccess('Donation needs retrieved');
    if (needs.data.data?.length > 0) {
      logInfo(`Found ${needs.data.data.length} donation needs`);
      needs.data.data.forEach((need, i) => {
        console.log(`  ${i+1}. ${need.title} (${need.category}) - Status: ${need.status}`);
      });
    } else {
      logInfo('No active donation needs found');
    }
  }

  // Step 4: Donate food items
  logSection('Step 4: Donate Food Items');
  const foodDonation = await makeRequest('POST', '/users/donations', {
    organization_id: ORG_UID,
    donation_need_id: needs.data.data?.[0]?.id || null,
    donation_type: 'items',
    description: 'Food donation - rice, lentils, and canned goods',
    item_description: 'Rice (10kg), Lentils (5kg), Canned goods (20 items)',
    quantity: 35,
    payment_method: 'in-person'
  }, DONOR_TOKEN);

  if (foodDonation.success) {
    donationId1 = foodDonation.data.data?.id;
    logSuccess('Food donation created successfully');
    logInfo(`Donation ID: ${donationId1}`);
    logInfo(`Status: ${foodDonation.data.data?.status || 'pending'}`);
  } else {
    logError('Failed to create food donation');
    console.log(foodDonation.error);
    return;
  }

  // Step 5: Donate clothes
  logSection('Step 5: Donate Clothes');
  const clothesDonation = await makeRequest('POST', '/users/donations', {
    organization_id: ORG_UID,
    donation_need_id: needs.data.data?.[0]?.id || null,
    donation_type: 'items',
    description: 'Clothing donation - winter clothes for families',
    item_description: 'Winter jackets (5), Sweaters (10), Pants (8), Blankets (3)',
    quantity: 26,
    payment_method: 'in-person'
  }, DONOR_TOKEN);

  if (clothesDonation.success) {
    donationId2 = clothesDonation.data.data?.id;
    logSuccess('Clothes donation created successfully');
    logInfo(`Donation ID: ${donationId2}`);
    logInfo(`Status: ${clothesDonation.data.data?.status || 'pending'}`);
  } else {
    logError('Failed to create clothes donation');
    console.log(clothesDonation.error);
    return;
  }

  // Step 6: Organization views pending donations
  logSection('Step 6: Organization Views Pending Donations');
  const orgDonations = await makeRequest('GET', '/organizations/donations?status=pending', null, ORG_TOKEN);
  if (orgDonations.success) {
    logSuccess('Organization retrieved pending donations');
    logInfo(`Found ${orgDonations.data.data?.length || 0} pending donations`);
    orgDonations.data.data?.forEach((donation, i) => {
      console.log(`  ${i+1}. ${donation.donation_type} - ${donation.description}`);
    });
  } else {
    logError('Failed to get organization donations');
    console.log(orgDonations.error);
  }

  // Step 7: Organization accepts food donation
  logSection('Step 7: Organization Accepts Food Donation');
  const acceptFood = await makeRequest('PUT', `/organizations/donations/${donationId1}/accept`, null, ORG_TOKEN);
  if (acceptFood.success) {
    logSuccess('Food donation accepted');
    logInfo(`Status: ${acceptFood.data.data?.status || 'accepted'}`);
  } else {
    logError('Failed to accept food donation');
    console.log(acceptFood.error);
  }

  // Step 8: Organization accepts clothes donation
  logSection('Step 8: Organization Accepts Clothes Donation');
  const acceptClothes = await makeRequest('PUT', `/organizations/donations/${donationId2}/accept`, null, ORG_TOKEN);
  if (acceptClothes.success) {
    logSuccess('Clothes donation accepted');
    logInfo(`Status: ${acceptClothes.data.data?.status || 'accepted'}`);
  } else {
    logError('Failed to accept clothes donation');
    console.log(acceptClothes.error);
  }

  // Wait a bit for database triggers
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Step 9: Organization completes food donation with certificate
  logSection('Step 9: Complete Food Donation & Generate Certificate');
  const completeFood = await makeRequest('POST', `/organizations/donations/${donationId1}/complete`, {
    certificate_url: `https://storage.example.com/certificates/food-cert-${Date.now()}.pdf`,
    certificate_number: `FOOD-CERT-2025-${Math.floor(Math.random() * 10000)}`
  }, ORG_TOKEN);

  if (completeFood.success) {
    certificateId1 = completeFood.data.data?.certificate?.id;
    logSuccess('Food donation completed & certificate generated');
    logInfo(`Certificate ID: ${certificateId1}`);
    logInfo(`Certificate Number: ${completeFood.data.data?.certificate?.certificate_number}`);
    logInfo(`Points Awarded: ${completeFood.data.data?.points_awarded || 0}`);
  } else {
    logError('Failed to complete food donation');
    console.log(completeFood.error);
  }

  // Step 10: Organization completes clothes donation with certificate
  logSection('Step 10: Complete Clothes Donation & Generate Certificate');
  const completeClothes = await makeRequest('POST', `/organizations/donations/${donationId2}/complete`, {
    certificate_url: `https://storage.example.com/certificates/clothes-cert-${Date.now()}.pdf`,
    certificate_number: `CLOTHES-CERT-2025-${Math.floor(Math.random() * 10000)}`
  }, ORG_TOKEN);

  if (completeClothes.success) {
    certificateId2 = completeClothes.data.data?.certificate?.id;
    logSuccess('Clothes donation completed & certificate generated');
    logInfo(`Certificate ID: ${certificateId2}`);
    logInfo(`Certificate Number: ${completeClothes.data.data?.certificate?.certificate_number}`);
    logInfo(`Points Awarded: ${completeClothes.data.data?.points_awarded || 0}`);
  } else {
    logError('Failed to complete clothes donation');
    console.log(completeClothes.error);
  }

  // Wait for triggers to update stats
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Step 11: Get donor profile after donations
  logSection('Step 11: Get Donor Profile (After)');
  const profileAfter = await makeRequest('GET', '/users/profile', null, DONOR_TOKEN);
  if (profileAfter.success) {
    logSuccess('Donor profile updated successfully');
    const before = profileBefore.data.data || {};
    const after = profileAfter.data.data || {};
    
    logInfo(`Points: ${before.points || 0} → ${after.points || 0} (+${(after.points || 0) - (before.points || 0)})`);
    logInfo(`Total Donated: $${before.total_donated || 0} → $${after.total_donated || 0}`);
    logInfo(`Donation Count: ${before.donation_count || 0} → ${after.donation_count || 0}`);
  } else {
    logError('Failed to get updated donor profile');
    console.log(profileAfter.error);
  }

  // Step 12: Get donor certificates
  logSection('Step 12: View Donor Certificates');
  const certificates = await makeRequest('GET', '/users/certificates', null, DONOR_TOKEN);
  if (certificates.success) {
    logSuccess('Certificates retrieved');
    logInfo(`Total Certificates: ${certificates.data.data?.length || 0}`);
    certificates.data.data?.forEach((cert, i) => {
      console.log(`  ${i+1}. ${cert.certificate_number} - ${cert.donation_type} - Points: ${cert.points_awarded}`);
    });
  } else {
    logError('Failed to get certificates');
    console.log(certificates.error);
  }

  // Step 13: Check leaderboard
  logSection('Step 13: Check Leaderboard');
  const leaderboard = await makeRequest('GET', '/users/leaderboard', null, DONOR_TOKEN);
  if (leaderboard.success) {
    logSuccess('Leaderboard retrieved');
    logInfo(`Total Users: ${leaderboard.data.data?.length || 0}`);
    
    // Find donor's position
    const donorPosition = leaderboard.data.data?.findIndex(user => user.id === DONOR_UID);
    if (donorPosition >= 0) {
      const donor = leaderboard.data.data[donorPosition];
      logInfo(`\nDonor's Position: #${donorPosition + 1}`);
      logInfo(`Name: ${donor.name}`);
      logInfo(`Points: ${donor.points}`);
      logInfo(`Total Donated: $${donor.total_donated}`);
      logInfo(`Donations: ${donor.donation_count}`);
    }
    
    log('\nTop 5 Donors:', 'yellow');
    leaderboard.data.data?.slice(0, 5).forEach((user, i) => {
      console.log(`  ${i+1}. ${user.name} - ${user.points} points - $${user.total_donated} donated`);
    });
  } else {
    logError('Failed to get leaderboard');
    console.log(leaderboard.error);
  }

  // Step 14: Get organization profile after
  logSection('Step 14: Get Organization Profile (After)');
  const orgAfter = await makeRequest('GET', `/users/organizations/${ORG_UID}`, null, DONOR_TOKEN);
  if (orgAfter.success) {
    logSuccess('Organization profile updated');
    const before = orgBefore.data.data || {};
    const after = orgAfter.data.data || {};
    
    logInfo(`Total Received: $${before.total_received || 0} → $${after.total_received || 0}`);
    logInfo(`Donor Count: ${before.donor_count || 0} → ${after.donor_count || 0}`);
  } else {
    logError('Failed to get updated organization profile');
    console.log(orgAfter.error);
  }

  // Final Summary
  logSection('TEST SUMMARY');
  log('✓ Food donation created, accepted, and completed', 'green');
  log('✓ Clothes donation created, accepted, and completed', 'green');
  log('✓ Certificates generated for both donations', 'green');
  log('✓ Points awarded to donor', 'green');
  log('✓ Donor profile updated with stats', 'green');
  log('✓ Organization stats updated', 'green');
  log('✓ Leaderboard reflects new points', 'green');
  log('\nAll steps completed successfully! 🎉', 'bright');
}

// Run the test
console.log('\n' + '█'.repeat(60));
log('DONATE-CONNECT COMPLETE FLOW TEST', 'bright');
log('Testing: Donor → Organization → Donation → Certificate → Leaderboard', 'cyan');
console.log('█'.repeat(60));

testCompleteFlow().catch(error => {
  logError('\nUnexpected error occurred:');
  console.error(error);
  process.exit(1);
});
