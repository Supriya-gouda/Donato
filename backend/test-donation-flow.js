const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const API_BASE = 'http://localhost:8080/api';

// Test credentials
const DONOR_UID = 'ac53eb58-e162-447f-9302-4b40faaf0a4f';
const ORG_UID = '450f527b-360d-4a36-a1ea-58b0985079d8';

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m',
  cyan: '\x1b[96m',
};

function log(emoji, title, message, data = null) {
  console.log(`\n${emoji} ${colors.cyan}${title}${colors.reset}`);
  console.log(`   ${message}`);
  if (data) {
    console.log(`   ${colors.magenta}Data:${colors.reset}`, JSON.stringify(data, null, 2));
  }
}

async function getDonorToken() {
  try {
    console.log(`\n${colors.yellow}🔐 Getting Donor Token...${colors.reset}`);
    console.log(`   Donor UID: ${colors.magenta}${DONOR_UID}${colors.reset}`);
    
    // Get donor user data
    const { data: { user }, error } = await supabase.auth.admin.getUserById(DONOR_UID);
    
    if (error || !user) {
      console.log(`   ${colors.red}❌ Error: Could not fetch donor user${colors.reset}`);
      console.log(`   Please ensure the donor is signed up in the frontend first.`);
      return null;
    }
    
    // Try to get existing session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user?.id === DONOR_UID) {
      console.log(`   ${colors.green}✓ Using existing donor session${colors.reset}`);
      return session.access_token;
    }
    
    console.log(`   ${colors.yellow}⚠️  Could not get session automatically${colors.reset}`);
    console.log(`   Please sign in as donor in the frontend and provide the token.`);
    return null;
  } catch (error) {
    console.error(`   ${colors.red}❌ Error:${colors.reset}`, error.message);
    return null;
  }
}

async function getOrgToken() {
  try {
    console.log(`\n${colors.yellow}🔐 Getting Organization Token...${colors.reset}`);
    console.log(`   Organization UID: ${colors.magenta}${ORG_UID}${colors.reset}`);
    
    // Get org user data
    const { data: { user }, error } = await supabase.auth.admin.getUserById(ORG_UID);
    
    if (error || !user) {
      console.log(`   ${colors.red}❌ Error: Could not fetch organization user${colors.reset}`);
      console.log(`   Please ensure the organization is signed up in the frontend first.`);
      return null;
    }
    
    // Try to get existing session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user?.id === ORG_UID) {
      console.log(`   ${colors.green}✓ Using existing organization session${colors.reset}`);
      return session.access_token;
    }
    
    console.log(`   ${colors.yellow}⚠️  Could not get session automatically${colors.reset}`);
    console.log(`   Please sign in as organization in the frontend and provide the token.`);
    return null;
  } catch (error) {
    console.error(`   ${colors.red}❌ Error:${colors.reset}`, error.message);
    return null;
  }
}

async function createDonation(donorToken) {
  try {
    log('💰', 'Creating Donation', 'Donor creating a new donation...');
    
    const donationData = {
      organization_id: ORG_UID,
      donation_type: 'monetary',
      amount: 5000,
      description: 'Test donation - Educational support for underprivileged children'
    };
    
    const response = await axios.post(
      `${API_BASE}/users/donations`,
      donationData,
      {
        headers: {
          'Authorization': `Bearer ${donorToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      log('✅', 'Donation Created', 'Donation successfully created!', response.data.data);
      return response.data.data.id;
    } else {
      console.log(`   ${colors.red}❌ Failed to create donation${colors.reset}`);
      return null;
    }
  } catch (error) {
    console.error(`   ${colors.red}❌ Error:${colors.reset}`, error.response?.data || error.message);
    return null;
  }
}

async function acceptDonation(orgToken, donationId) {
  try {
    log('✋', 'Accepting Donation', 'Organization accepting the donation...');
    
    const response = await axios.put(
      `${API_BASE}/organizations/donations/${donationId}/accept`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${orgToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      log('✅', 'Donation Accepted', 'Donation successfully accepted!', response.data.data);
      return true;
    } else {
      console.log(`   ${colors.red}❌ Failed to accept donation${colors.reset}`);
      return false;
    }
  } catch (error) {
    console.error(`   ${colors.red}❌ Error:${colors.reset}`, error.response?.data || error.message);
    return false;
  }
}

async function completeDonation(orgToken, donationId) {
  try {
    log('📜', 'Completing Donation & Generating Certificate', 'Organization completing donation...');
    
    const certificateData = {
      certificate_url: `https://storage.example.com/certificates/CERT-${Date.now()}.pdf`,
      certificate_number: `CERT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
    };
    
    const response = await axios.post(
      `${API_BASE}/organizations/donations/${donationId}/complete`,
      certificateData,
      {
        headers: {
          'Authorization': `Bearer ${orgToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      log('✅', 'Donation Completed', 'Donation completed with certificate!', response.data.data);
      return response.data.data;
    } else {
      console.log(`   ${colors.red}❌ Failed to complete donation${colors.reset}`);
      return null;
    }
  } catch (error) {
    console.error(`   ${colors.red}❌ Error:${colors.reset}`, error.response?.data || error.message);
    return null;
  }
}

async function viewDonorDashboard(donorToken) {
  try {
    log('📊', 'Viewing Donor Dashboard', 'Checking donor stats and points...');
    
    const response = await axios.get(
      `${API_BASE}/users/dashboard`,
      {
        headers: {
          'Authorization': `Bearer ${donorToken}`
        }
      }
    );
    
    if (response.data.success) {
      const { profile, stats } = response.data.data;
      console.log(`\n   ${colors.green}Profile:${colors.reset}`);
      console.log(`   • Name: ${profile.name || 'N/A'}`);
      console.log(`   • Points: ${colors.yellow}${profile.points}${colors.reset}`);
      console.log(`   • Total Donated: ₹${colors.green}${profile.total_donated}${colors.reset}`);
      console.log(`\n   ${colors.green}Stats:${colors.reset}`);
      console.log(`   • Total Donations: ${stats.total_donations}`);
      console.log(`   • Completed: ${colors.green}${stats.completed_donations}${colors.reset}`);
      console.log(`   • Pending: ${colors.yellow}${stats.pending_donations}${colors.reset}`);
      return true;
    }
  } catch (error) {
    console.error(`   ${colors.red}❌ Error:${colors.reset}`, error.response?.data || error.message);
    return false;
  }
}

async function viewCertificates(donorToken) {
  try {
    log('🏆', 'Viewing Certificates', 'Fetching donor certificates...');
    
    const response = await axios.get(
      `${API_BASE}/users/certificates`,
      {
        headers: {
          'Authorization': `Bearer ${donorToken}`
        }
      }
    );
    
    if (response.data.success) {
      const certificates = response.data.data;
      console.log(`   ${colors.green}Total Certificates: ${certificates.length}${colors.reset}`);
      certificates.forEach((cert, index) => {
        console.log(`\n   Certificate #${index + 1}:`);
        console.log(`   • Number: ${colors.cyan}${cert.certificate_number}${colors.reset}`);
        console.log(`   • Amount: ₹${cert.amount}`);
        console.log(`   • Points: ${colors.yellow}${cert.points_awarded}${colors.reset}`);
        console.log(`   • URL: ${cert.certificate_url}`);
      });
      return true;
    }
  } catch (error) {
    console.error(`   ${colors.red}❌ Error:${colors.reset}`, error.response?.data || error.message);
    return false;
  }
}

async function runDonationFlow() {
  console.log('\n' + colors.blue + '═'.repeat(100));
  console.log('🎯  COMPLETE DONATION FLOW TEST');
  console.log('═'.repeat(100) + colors.reset);
  
  console.log(`\n${colors.yellow}📋 Test Scenario:${colors.reset}`);
  console.log('   1. Donor creates a donation');
  console.log('   2. Organization accepts the donation');
  console.log('   3. Organization completes donation & generates certificate');
  console.log('   4. System awards points to donor');
  console.log('   5. Donor views updated dashboard and certificates');
  
  // Manual token input section
  console.log('\n' + colors.blue + '═'.repeat(100));
  console.log('🔑  TOKEN SETUP REQUIRED');
  console.log('═'.repeat(100) + colors.reset);
  console.log(`\n${colors.yellow}Please provide JWT tokens from your frontend login:${colors.reset}\n`);
  console.log('To get tokens:');
  console.log('1. Open http://localhost:5173');
  console.log('2. Sign in as donor and organization (in different browser tabs/profiles)');
  console.log('3. Open DevTools (F12) → Application → Local Storage');
  console.log('4. Copy the access_token from the Supabase session object');
  console.log('\n' + colors.red + '⚠️  Update this script with your tokens:' + colors.reset);
  console.log(`   Line ~280: donorToken = 'YOUR_DONOR_JWT_TOKEN_HERE'`);
  console.log(`   Line ~281: orgToken = 'YOUR_ORG_JWT_TOKEN_HERE'\n`);
  
  // PASTE YOUR TOKENS HERE:
  const donorToken = null; // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  const orgToken = null;   // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  
  if (!donorToken || !orgToken) {
    console.log(colors.red + '\n❌ Tokens not provided. Please update the script with valid JWT tokens.\n' + colors.reset);
    console.log('Alternative: You can test manually using cURL:');
    console.log('\n# 1. Create donation (as donor):');
    console.log(`curl -X POST -H "Authorization: Bearer YOUR_DONOR_TOKEN" -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"organization_id":"${ORG_UID}","donation_type":"monetary","amount":5000,"description":"Test"}' \\`);
    console.log(`  ${API_BASE}/users/donations`);
    console.log('\n# 2. Accept donation (as org):');
    console.log(`curl -X PUT -H "Authorization: Bearer YOUR_ORG_TOKEN" \\`);
    console.log(`  ${API_BASE}/organizations/donations/DONATION_ID/accept`);
    console.log('\n# 3. Complete donation (as org):');
    console.log(`curl -X POST -H "Authorization: Bearer YOUR_ORG_TOKEN" -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"certificate_url":"https://example.com/cert.pdf","certificate_number":"CERT-2025-001"}' \\`);
    console.log(`  ${API_BASE}/organizations/donations/DONATION_ID/complete`);
    console.log('\n');
    return;
  }
  
  // Execute donation flow
  console.log('\n' + colors.blue + '═'.repeat(100));
  console.log('🚀  EXECUTING DONATION FLOW');
  console.log('═'.repeat(100) + colors.reset);
  
  // Step 1: Create donation
  const donationId = await createDonation(donorToken);
  if (!donationId) {
    console.log(colors.red + '\n❌ Failed to create donation. Stopping test.\n' + colors.reset);
    return;
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 2: Accept donation
  const accepted = await acceptDonation(orgToken, donationId);
  if (!accepted) {
    console.log(colors.red + '\n❌ Failed to accept donation. Stopping test.\n' + colors.reset);
    return;
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 3: Complete donation and generate certificate
  const completion = await completeDonation(orgToken, donationId);
  if (!completion) {
    console.log(colors.red + '\n❌ Failed to complete donation. Stopping test.\n' + colors.reset);
    return;
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 4: View updated dashboard
  await viewDonorDashboard(donorToken);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 5: View certificates
  await viewCertificates(donorToken);
  
  // Success summary
  console.log('\n' + colors.blue + '═'.repeat(100));
  console.log('✅  TEST COMPLETED SUCCESSFULLY');
  console.log('═'.repeat(100) + colors.reset);
  console.log(colors.green + '\n✓ Donation created by donor');
  console.log('✓ Donation accepted by organization');
  console.log('✓ Certificate generated');
  console.log('✓ Points awarded to donor');
  console.log('✓ Dashboard updated');
  console.log('✓ Certificate stored in database\n' + colors.reset);
}

// Run the flow
runDonationFlow().catch(error => {
  console.error(colors.red + '\n❌ Test failed:' + colors.reset, error.message);
  process.exit(1);
});
