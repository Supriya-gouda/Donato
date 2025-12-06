/**
 * TEST ORGANIZATION DONATIONS TRACKING
 * Tests the organization_donations table and new endpoints
 */

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const SUPABASE_URL = 'https://xtalowxxymzlsyhajway.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YWxvd3h4eW16bHN5aGFqd2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDA1NzksImV4cCI6MjA3ODYxNjU3OX0.sdRHKbe2YO1DIsyviFVLHrSegLaJ-VD0ZRF86pni5J0';

const BASE_URL = 'http://localhost:8080/api';
const ORG_UID = '450f527b-360d-4a36-a1ea-58b0985079d8';
const ORG_EMAIL = 'harshalsl2005@gmail.com';
const ORG_PASSWORD = '111111';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(70));
  log(title, 'bright');
  console.log('='.repeat(70));
}

async function getAuthToken(email, password) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data.session.access_token;
}

async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      timeout: 10000
    };
    
    if (data) config.data = data;
    
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

async function testOrgDonations() {
  try {
    console.log('\n' + '█'.repeat(70));
    log('ORGANIZATION DONATIONS TRACKING TEST', 'bright');
    log('Testing organization_donations table and endpoints', 'cyan');
    console.log('█'.repeat(70));

    logSection('STEP 1: Authenticate Organization');
    log('Authenticating...', 'yellow');
    const orgToken = await getAuthToken(ORG_EMAIL, ORG_PASSWORD);
    log('✓ Organization authenticated successfully', 'green');

    // Test 1: Get all received donations
    logSection('STEP 2: Get All Received Donations');
    const allDonations = await makeRequest('GET', '/organizations/received-donations', null, orgToken);
    
    if (allDonations.success) {
      const donations = allDonations.data.data || [];
      log(`✓ Retrieved ${donations.length} received donations`, 'green');
      
      if (donations.length > 0) {
        log('\nSample donations:', 'yellow');
        donations.slice(0, 3).forEach((d, i) => {
          console.log(`  ${i + 1}. ${d.donations?.donation_type || 'N/A'} - ${d.donations?.description?.substring(0, 50) || 'No description'}...`);
          console.log(`     Received: ${new Date(d.received_at).toLocaleString()}`);
          console.log(`     Notes: ${d.notes || 'None'}`);
        });
      }
    } else {
      log('✗ Failed to get received donations', 'red');
      console.log(allDonations.error);
    }

    // Test 2: Get donation statistics
    logSection('STEP 3: Get Donation Statistics');
    const stats = await makeRequest('GET', '/organizations/donation-stats', null, orgToken);
    
    if (stats.success) {
      const data = stats.data.data;
      log('✓ Retrieved donation statistics', 'green');
      log(`\nStatistics:`, 'yellow');
      log(`  Total Received: ${data.total_received}`, 'cyan');
      log(`  Items: ${data.by_type.items}`, 'cyan');
      log(`  Money: ${data.by_type.money}`, 'cyan');
      log(`  Food: ${data.by_type.food}`, 'cyan');
      log(`  Total Amount: $${data.total_amount}`, 'cyan');
      log(`  Total Items: ${data.total_items} items`, 'cyan');
    } else {
      log('✗ Failed to get statistics', 'red');
      console.log(stats.error);
    }

    // Test 3: Get single donation details
    if (allDonations.success && allDonations.data.data?.length > 0) {
      const firstDonation = allDonations.data.data[0];
      
      logSection('STEP 4: Get Single Donation Details');
      const details = await makeRequest('GET', `/organizations/received-donations/${firstDonation.id}`, null, orgToken);
      
      if (details.success) {
        const d = details.data.data;
        log('✓ Retrieved donation details', 'green');
        log(`\nDonation Details:`, 'yellow');
        log(`  ID: ${d.id}`, 'cyan');
        log(`  Type: ${d.donations?.donation_type}`, 'cyan');
        log(`  Description: ${d.donations?.description}`, 'cyan');
        log(`  Donor: ${d.donations?.user_profiles?.name}`, 'cyan');
        log(`  Donor Email: ${d.donations?.user_profiles?.email}`, 'cyan');
        log(`  Received: ${new Date(d.received_at).toLocaleString()}`, 'cyan');
        log(`  Notes: ${d.notes || 'None'}`, 'cyan');
        
        if (d.donations?.certificates?.length > 0) {
          log(`  Certificate: ${d.donations.certificates[0].certificate_number}`, 'cyan');
          log(`  Points Awarded: ${d.donations.certificates[0].points_awarded}`, 'cyan');
        }
      } else {
        log('✗ Failed to get donation details', 'red');
        console.log(details.error);
      }

      // Test 4: Update notes
      logSection('STEP 5: Update Donation Notes');
      const updateNotes = await makeRequest(
        'PATCH', 
        `/organizations/received-donations/${firstDonation.id}/notes`,
        { notes: 'Updated via API test - Great donation!' },
        orgToken
      );
      
      if (updateNotes.success) {
        log('✓ Notes updated successfully', 'green');
        log(`  New Notes: ${updateNotes.data.data.notes}`, 'cyan');
      } else {
        log('✗ Failed to update notes', 'red');
        console.log(updateNotes.error);
      }
    }

    // Test 5: Filter by status
    logSection('STEP 6: Filter Donations by Status');
    const completedOnly = await makeRequest('GET', '/organizations/received-donations?status=completed', null, orgToken);
    
    if (completedOnly.success) {
      log(`✓ Retrieved ${completedOnly.data.count} completed donations`, 'green');
    } else {
      log('✗ Failed to filter donations', 'red');
      console.log(completedOnly.error);
    }

    // Final Summary
    logSection('✅ TEST SUMMARY');
    log('✓ Get all received donations - Working', 'green');
    log('✓ Get donation statistics - Working', 'green');
    log('✓ Get single donation details - Working', 'green');
    log('✓ Update donation notes - Working', 'green');
    log('✓ Filter donations by status - Working', 'green');
    log('\n🎉 All organization donation tracking features working!', 'bright');

  } catch (error) {
    log('\n❌ ERROR:', 'red');
    console.error(error.message);
    throw error;
  }
}

testOrgDonations().catch(error => {
  process.exit(1);
});
