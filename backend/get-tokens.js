const axios = require('axios');

const SUPABASE_URL = 'https://xtalowxxymzlsyhajway.supabase.co';
const SUPABASE_ANON_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';

// Test UIDs
const DONOR_UID = 'ac53eb58-e162-447f-9302-4b40faaf0a4f';
const ORG_UID = '450f527b-360d-4a36-a1ea-58b0985079d8';

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

async function getTokenForUser(email, password) {
  try {
    const response = await axios.post(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        email,
        password,
        gotrue_meta_security: {}
      },
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

async function main() {
  log('\n=== GET JWT TOKENS FOR TESTING ===\n', 'bright');
  
  if (SUPABASE_ANON_KEY === 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE') {
    log('Please set SUPABASE_ANON_KEY in this script', 'red');
    log('\nTo get your Supabase Anon Key:', 'yellow');
    log('1. Go to Supabase Dashboard > Project Settings > API', 'yellow');
    log('2. Copy the "anon" / "public" key', 'yellow');
    log('3. Paste it in this script at line 4', 'yellow');
    return;
  }
  
  log('Enter credentials for the donor and organization:', 'cyan');
  log('Note: These users must exist in Supabase Auth\n', 'yellow');
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (query) => new Promise((resolve) => readline.question(query, resolve));
  
  // Get donor credentials
  const donorEmail = await question('Donor Email: ');
  const donorPassword = await question('Donor Password: ');
  
  log('\nGetting donor token...', 'cyan');
  const donorToken = await getTokenForUser(donorEmail, donorPassword);
  
  if (donorToken) {
    log('✓ Donor token retrieved successfully', 'green');
    log(`\nDONOR_TOKEN = '${donorToken}'`, 'bright');
  } else {
    log('✗ Failed to get donor token', 'red');
  }
  
  // Get organization credentials
  console.log('\n');
  const orgEmail = await question('Organization Email: ');
  const orgPassword = await question('Organization Password: ');
  
  log('\nGetting organization token...', 'cyan');
  const orgToken = await getTokenForUser(orgEmail, orgPassword);
  
  if (orgToken) {
    log('✓ Organization token retrieved successfully', 'green');
    log(`\nORG_TOKEN = '${orgToken}'`, 'bright');
  } else {
    log('✗ Failed to get organization token', 'red');
  }
  
  log('\n\n=== COPY THESE TOKENS ===\n', 'bright');
  if (donorToken) {
    log(`const DONOR_TOKEN = '${donorToken}';`, 'green');
  }
  if (orgToken) {
    log(`const ORG_TOKEN = '${orgToken}';`, 'green');
  }
  
  log('\nPaste these into test-complete-flow.js (lines 11-12)', 'yellow');
  
  readline.close();
}

main();
