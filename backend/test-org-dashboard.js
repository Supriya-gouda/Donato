// Test Organization Dashboard Workflow

const API_URL = 'http://localhost:8080/api';

async function testOrgDashboard() {
  console.log('🧪 Testing Organization Dashboard\n');
  console.log('Organization ID: 450f527b-360d-4a36-a1ea-58b0985079d8\n');
  
  try {
    // Step 1: Login as organization
    console.log('Step 1: Logging in as organization...');
    const loginResponse = await fetch(`${API_URL}/organizations/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'harshalsl2005@gmail.com',
        password: '111111'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log(`   Organization: ${loginData.data.organization.name}`);
    console.log(`   Location: ${loginData.data.organization.location}`);
    console.log(`   Status: ${loginData.data.organization.verification_status}\n`);
    
    const token = loginData.data.token;
    
    // Step 2: Get dashboard stats
    console.log('Step 2: Fetching dashboard statistics...');
    const statsResponse = await fetch(`${API_URL}/organizations/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!statsResponse.ok) {
      throw new Error(`Stats fetch failed: ${statsResponse.status}`);
    }
    
    const statsData = await statsResponse.json();
    console.log('✅ Dashboard stats fetched\n');
    
    if (statsData.success) {
      const { stats, recent_donations } = statsData.data;
      
      console.log('📊 Statistics:');
      console.log(`   Total Donations: ${stats.total_donations}`);
      console.log(`   Pending: ${stats.pending_donations}`);
      console.log(`   Completed: ${stats.completed_donations}`);
      console.log(`   Total Points Given: ${stats.total_points_given}\n`);
      
      console.log('📋 Recent Donations:');
      if (recent_donations && recent_donations.length > 0) {
        recent_donations.slice(0, 5).forEach((donation, index) => {
          console.log(`   ${index + 1}. ${donation.donation_type || 'N/A'}`);
          console.log(`      Status: ${donation.status}`);
          console.log(`      Donor: ${donation.user_profiles?.name || 'Unknown'}`);
          console.log(`      Date: ${new Date(donation.created_at).toLocaleDateString()}`);
          if (donation.certificates && donation.certificates.length > 0) {
            console.log(`      Points Awarded: ${donation.certificates[0].points_awarded}`);
          }
          console.log('');
        });
      } else {
        console.log('   No donations found\n');
      }
      
      // Verify the data matches what we expect
      console.log('✅ Verification:');
      console.log(`   Expected org ID: 450f527b-360d-4a36-a1ea-58b0985079d8`);
      console.log(`   Actual org ID: ${loginData.data.organization.id}`);
      console.log(`   Match: ${loginData.data.organization.id === '450f527b-360d-4a36-a1ea-58b0985079d8' ? '✅' : '❌'}\n`);
      
      console.log('🎉 Dashboard test completed successfully!');
      
    } else {
      console.log('❌ Stats fetch returned unsuccessful response');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('1. Backend server is running on port 8080');
    console.error('2. Organization exists with email: harshalsl2005@gmail.com');
    console.error('3. Database has donation data for this organization');
  }
}

// Run the test
console.log('========================================');
console.log('Organization Dashboard Test');
console.log('========================================\n');

testOrgDashboard();
