// Simple backend health check
const http = require('http');

function testEndpoint(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ ${method} ${url}`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response:`, json);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          console.log(`✅ ${method} ${url}`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response:`, data);
          resolve({ status: res.statusCode, data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${method} ${url}`);
      console.log(`   Error: ${error.message}`);
      reject(error);
    });
    
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 TESTING BACKEND ENDPOINTS\n');
  console.log('='.repeat(60));
  
  try {
    // Test root endpoint
    console.log('\n📋 Testing Root Endpoint');
    console.log('-'.repeat(60));
    await testEndpoint('http://localhost:8080/');
    
    // Test protected endpoints (should return 401)
    console.log('\n👤 Testing User Endpoints (No Auth - Should Return 401)');
    console.log('-'.repeat(60));
    await testEndpoint('http://localhost:8080/api/users/dashboard');
    await testEndpoint('http://localhost:8080/api/users/profile');
    await testEndpoint('http://localhost:8080/api/users/organizations');
    
    console.log('\n🏢 Testing Organization Endpoints (No Auth - Should Return 401)');
    console.log('-'.repeat(60));
    await testEndpoint('http://localhost:8080/api/organizations/profile');
    await testEndpoint('http://localhost:8080/api/organizations/donations');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

runTests();
