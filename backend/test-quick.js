/**
 * QUICK API TEST - No Authentication Required
 * 
 * This test checks if the backend server is responding and basic routes work.
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(method, endpoint, expectedStatus, description) {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      validateStatus: () => true // Don't throw on any status
    });
    
    const success = response.status === expectedStatus;
    if (success) {
      log(`✓ ${description} - Status: ${response.status}`, 'green');
    } else {
      log(`✗ ${description} - Expected ${expectedStatus}, got ${response.status}`, 'red');
    }
    return success;
  } catch (error) {
    log(`✗ ${description} - Error: ${error.message}`, 'red');
    return false;
  }
}

async function quickTest() {
  log('\n=== QUICK BACKEND TEST ===\n', 'cyan');
  log('Testing backend connectivity and basic responses...\n', 'yellow');
  
  const tests = [
    // These should return 401 (unauthorized) because no token
    { method: 'GET', endpoint: '/users/profile', expectedStatus: 401, description: 'GET /users/profile (should require auth)' },
    { method: 'GET', endpoint: '/users/leaderboard', expectedStatus: 401, description: 'GET /users/leaderboard (should require auth)' },
    { method: 'GET', endpoint: '/organizations/profile', expectedStatus: 401, description: 'GET /organizations/profile (should require auth)' },
  ];
  
  let passed = 0;
  for (const test of tests) {
    const success = await testEndpoint(test.method, test.endpoint, test.expectedStatus, test.description);
    if (success) passed++;
  }
  
  log(`\n=== RESULTS: ${passed}/${tests.length} tests passed ===\n`, passed === tests.length ? 'green' : 'yellow');
  
  if (passed === tests.length) {
    log('✓ Backend is running and responding correctly!', 'green');
    log('\nNext steps:', 'cyan');
    log('1. Get JWT tokens using get-tokens.js or Supabase Dashboard', 'yellow');
    log('2. Update test-complete-flow.js with the tokens', 'yellow');
    log('3. Run: node test-complete-flow.js', 'yellow');
  } else {
    log('✗ Some tests failed. Check if backend is running:', 'red');
    log('   cd e:\\donate-connect\\backend', 'yellow');
    log('   node src/server.js', 'yellow');
  }
}

quickTest().catch(error => {
  log(`\n✗ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
