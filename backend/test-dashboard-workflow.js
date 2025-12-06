// Test the complete workflow: User ID -> Location -> Organizations

const API_URL = 'http://localhost:8080/api';
const USER_TOKEN = 'YOUR_TOKEN_HERE'; // Replace with actual token after login

async function testWorkflow() {
  console.log('🧪 Testing Dashboard Workflow\n');
  
  try {
    // Step 1: Get user profile
    console.log('Step 1: Fetching user profile...');
    const profileResponse = await fetch(`${API_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${USER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!profileResponse.ok) {
      throw new Error(`Profile fetch failed: ${profileResponse.status}`);
    }
    
    const profileData = await profileResponse.json();
    console.log('✅ User profile:', {
      id: profileData.data.id,
      name: profileData.data.name,
      location: profileData.data.location
    });
    
    const userLocation = profileData.data.location;
    console.log(`\nStep 2: User location = "${userLocation}"\n`);
    
    // Step 3: Get organizations in that location
    console.log('Step 3: Fetching organizations in', userLocation);
    const orgsUrl = userLocation 
      ? `${API_URL}/public/organizations?location=${encodeURIComponent(userLocation)}`
      : `${API_URL}/public/organizations`;
    
    const orgsResponse = await fetch(orgsUrl, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!orgsResponse.ok) {
      throw new Error(`Organizations fetch failed: ${orgsResponse.status}`);
    }
    
    const orgsData = await orgsResponse.json();
    console.log(`✅ Found ${orgsData.data.length} organizations\n`);
    
    if (orgsData.data.length > 0) {
      console.log('Organizations:');
      orgsData.data.forEach((org, index) => {
        console.log(`${index + 1}. ${org.name}`);
        console.log(`   Location: ${org.location}`);
        console.log(`   Status: ${org.verification_status}`);
        console.log(`   Description: ${org.description || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No organizations found in', userLocation);
      console.log('\nTroubleshooting:');
      console.log('- Check if organizations exist with location =', userLocation);
      console.log('- Check if organizations have verification_status = "verified"');
    }
    
    console.log('\n✅ Workflow test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('1. Backend server is running on port 8080');
    console.error('2. You have a valid user token (login first)');
    console.error('3. User has a location set in their profile');
    console.error('4. Organizations exist with matching location and verified status');
  }
}

// Test without auth (just organizations endpoint)
async function testPublicEndpoint() {
  console.log('\n🧪 Testing Public Organizations Endpoint\n');
  
  try {
    const response = await fetch(`${API_URL}/public/organizations`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Success! Found ${data.data.length} verified organizations`);
    
    if (data.data.length > 0) {
      console.log('\nAll verified organizations:');
      data.data.forEach((org, index) => {
        console.log(`${index + 1}. ${org.name} - ${org.location || 'No location'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run tests
console.log('========================================');
console.log('Dashboard Workflow Test');
console.log('========================================\n');

// First test public endpoint (no auth needed)
testPublicEndpoint().then(() => {
  console.log('\n========================================');
  console.log('To test the complete workflow:');
  console.log('1. Login via frontend or API');
  console.log('2. Copy your token from localStorage');
  console.log('3. Replace YOUR_TOKEN_HERE in this file');
  console.log('4. Run: node test-dashboard-workflow.js');
  console.log('========================================');
});
