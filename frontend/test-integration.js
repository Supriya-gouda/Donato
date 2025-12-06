// Test frontend-backend connectivity
// Run this in browser console after logging in

const testFrontendBackend = async () => {
  console.log('🧪 Testing Frontend-Backend Integration...\n');
  
  // Test 1: Check if API is reachable
  console.log('1️⃣ Testing API connectivity...');
  try {
    const response = await fetch('http://localhost:8080/api/organizations');
    console.log('✅ Backend API is reachable');
    console.log('   Status:', response.status);
  } catch (error) {
    console.error('❌ Cannot reach backend API:', error.message);
    return;
  }
  
  // Test 2: Check token storage
  console.log('\n2️⃣ Checking authentication token...');
  const token = localStorage.getItem('token');
  if (token) {
    console.log('✅ Token found in localStorage');
    console.log('   Token preview:', token.substring(0, 20) + '...');
  } else {
    console.log('⚠️  No token found - please login first');
    return;
  }
  
  // Test 3: Test authenticated endpoint
  console.log('\n3️⃣ Testing authenticated API call...');
  try {
    const response = await fetch('http://localhost:8080/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Successfully fetched user profile');
      console.log('   User:', data.data?.name || data.data?.email);
      console.log('   Points:', data.data?.points || 0);
    } else {
      console.log('❌ Profile fetch failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Profile request error:', error.message);
  }
  
  // Test 4: Test organization endpoint (if logged in as org)
  console.log('\n4️⃣ Testing organization endpoint...');
  try {
    const response = await fetch('http://localhost:8080/api/organizations/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Successfully fetched organization profile');
      console.log('   Organization:', data.data?.name);
    } else if (response.status === 404) {
      console.log('ℹ️  User is not an organization (expected for regular users)');
    } else {
      console.log('❌ Organization fetch failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Organization request error:', error.message);
  }
  
  console.log('\n✨ Test completed!');
};

// Run the test
testFrontendBackend();
