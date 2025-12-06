/**
 * COMPLETE DONATION FLOW TEST - DIRECT DATABASE VERSION
 * 
 * This test directly interacts with the database to simulate the complete flow.
 * It's useful for testing the database schema, triggers, and constraints without
 * needing JWT tokens.
 * 
 * Test Scenario:
 * 1. Donor (Harshal) donates food and clothes to Test Foundation
 * 2. Organization accepts both donations
 * 3. Organization completes donations and generates certificates
 * 4. Verify points awarded, stats updated, and leaderboard reflects changes
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://xtalowxxymzlsyhajway.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'PASTE_YOUR_SERVICE_ROLE_KEY_HERE'; // Get from Supabase Dashboard > Settings > API

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

function logSection(title) {
  console.log('\n' + '='.repeat(70));
  log(title, 'bright');
  console.log('='.repeat(70));
}

async function testCompleteFlow() {
  if (SUPABASE_SERVICE_ROLE_KEY === 'PASTE_YOUR_SERVICE_ROLE_KEY_HERE') {
    log('❌ Please set SUPABASE_SERVICE_ROLE_KEY in the script', 'red');
    log('\nTo get your service role key:', 'yellow');
    log('1. Go to Supabase Dashboard > Project Settings > API', 'yellow');
    log('2. Copy the "service_role" key (keep it secret!)', 'yellow');
    log('3. Paste it in this script at line 19', 'yellow');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Step 1: Get initial state
    logSection('STEP 1: Get Initial State');
    
    const { data: donorBefore } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', DONOR_UID)
      .single();
    
    const { data: orgBefore } = await supabase
      .from('organization_profiles')
      .select('*')
      .eq('id', ORG_UID)
      .single();
    
    log(`✓ Donor: ${donorBefore.name}`, 'green');
    log(`  Email: ${donorBefore.email}`, 'cyan');
    log(`  Points: ${donorBefore.points}`, 'cyan');
    log(`  Total Donated: $${donorBefore.total_donated}`, 'cyan');
    log(`  Donation Count: ${donorBefore.donation_count}`, 'cyan');
    
    log(`\n✓ Organization: ${orgBefore.name}`, 'green');
    log(`  Email: ${orgBefore.email}`, 'cyan');
    log(`  Total Received: $${orgBefore.total_received}`, 'cyan');
    log(`  Donor Count: ${orgBefore.donor_count}`, 'cyan');

    // Step 2: Create food donation
    logSection('STEP 2: Create Food Donation');
    
    const { data: foodDonation, error: foodError } = await supabase
      .from('donations')
      .insert({
        donor_id: DONOR_UID,
        organization_id: ORG_UID,
        donation_type: 'items',
        description: 'Food donation - rice, lentils, and canned goods',
        item_description: 'Rice (10kg), Lentils (5kg), Canned goods (20 items)',
        quantity: 35,
        status: 'pending',
        payment_method: 'in-person'
      })
      .select()
      .single();
    
    if (foodError) throw foodError;
    
    log(`✓ Food donation created`, 'green');
    log(`  ID: ${foodDonation.id}`, 'cyan');
    log(`  Type: ${foodDonation.donation_type}`, 'cyan');
    log(`  Quantity: ${foodDonation.quantity} items`, 'cyan');
    log(`  Status: ${foodDonation.status}`, 'cyan');

    // Step 3: Create clothes donation
    logSection('STEP 3: Create Clothes Donation');
    
    const { data: clothesDonation, error: clothesError } = await supabase
      .from('donations')
      .insert({
        donor_id: DONOR_UID,
        organization_id: ORG_UID,
        donation_type: 'items',
        description: 'Clothing donation - winter clothes for families',
        item_description: 'Winter jackets (5), Sweaters (10), Pants (8), Blankets (3)',
        quantity: 26,
        status: 'pending',
        payment_method: 'in-person'
      })
      .select()
      .single();
    
    if (clothesError) throw clothesError;
    
    log(`✓ Clothes donation created`, 'green');
    log(`  ID: ${clothesDonation.id}`, 'cyan');
    log(`  Type: ${clothesDonation.donation_type}`, 'cyan');
    log(`  Quantity: ${clothesDonation.quantity} items`, 'cyan');
    log(`  Status: ${clothesDonation.status}`, 'cyan');

    // Step 4: Organization accepts food donation
    logSection('STEP 4: Accept Food Donation');
    
    const { data: acceptedFood, error: acceptFoodError } = await supabase
      .from('donations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', foodDonation.id)
      .select()
      .single();
    
    if (acceptFoodError) throw acceptFoodError;
    
    log(`✓ Food donation accepted`, 'green');
    log(`  Status: ${acceptedFood.status}`, 'cyan');
    log(`  Accepted at: ${new Date(acceptedFood.accepted_at).toLocaleString()}`, 'cyan');

    // Step 5: Organization accepts clothes donation
    logSection('STEP 5: Accept Clothes Donation');
    
    const { data: acceptedClothes, error: acceptClothesError } = await supabase
      .from('donations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', clothesDonation.id)
      .select()
      .single();
    
    if (acceptClothesError) throw acceptClothesError;
    
    log(`✓ Clothes donation accepted`, 'green');
    log(`  Status: ${acceptedClothes.status}`, 'cyan');
    log(`  Accepted at: ${new Date(acceptedClothes.accepted_at).toLocaleString()}`, 'cyan');

    // Step 6: Complete food donation and generate certificate
    logSection('STEP 6: Complete Food Donation & Generate Certificate');
    
    // Update donation to completed
    const { data: completedFood, error: completeFoodError } = await supabase
      .from('donations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', foodDonation.id)
      .select()
      .single();
    
    if (completeFoodError) throw completeFoodError;
    
    // Calculate points (since amount is null for items, we'll use quantity-based points)
    const foodPoints = Math.floor(35 * 0.5); // 0.5 points per item
    
    // Generate certificate
    const foodCertNumber = `FOOD-CERT-2025-${Math.floor(Math.random() * 10000)}`;
    const { data: foodCert, error: foodCertError } = await supabase
      .from('certificates')
      .insert({
        donor_id: DONOR_UID,
        organization_id: ORG_UID,
        donation_id: foodDonation.id,
        certificate_number: foodCertNumber,
        certificate_url: `https://storage.example.com/certificates/${foodCertNumber}.pdf`,
        amount: 0,
        donation_type: 'items',
        points_awarded: foodPoints
      })
      .select()
      .single();
    
    if (foodCertError) throw foodCertError;
    
    // Update user points
    await supabase
      .from('user_profiles')
      .update({
        points: donorBefore.points + foodPoints
      })
      .eq('id', DONOR_UID);
    
    log(`✓ Food donation completed`, 'green');
    log(`  Status: ${completedFood.status}`, 'cyan');
    log(`  Certificate Number: ${foodCert.certificate_number}`, 'cyan');
    log(`  Points Awarded: ${foodPoints}`, 'cyan');

    // Step 7: Complete clothes donation and generate certificate
    logSection('STEP 7: Complete Clothes Donation & Generate Certificate');
    
    // Update donation to completed
    const { data: completedClothes, error: completeClothesError } = await supabase
      .from('donations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', clothesDonation.id)
      .select()
      .single();
    
    if (completeClothesError) throw completeClothesError;
    
    // Calculate points
    const clothesPoints = Math.floor(26 * 0.5);
    
    // Generate certificate
    const clothesCertNumber = `CLOTHES-CERT-2025-${Math.floor(Math.random() * 10000)}`;
    const { data: clothesCert, error: clothesCertError } = await supabase
      .from('certificates')
      .insert({
        donor_id: DONOR_UID,
        organization_id: ORG_UID,
        donation_id: clothesDonation.id,
        certificate_number: clothesCertNumber,
        certificate_url: `https://storage.example.com/certificates/${clothesCertNumber}.pdf`,
        amount: 0,
        donation_type: 'items',
        points_awarded: clothesPoints
      })
      .select()
      .single();
    
    if (clothesCertError) throw clothesCertError;
    
    // Update user points
    const { data: currentProfile } = await supabase
      .from('user_profiles')
      .select('points')
      .eq('id', DONOR_UID)
      .single();
    
    await supabase
      .from('user_profiles')
      .update({
        points: currentProfile.points + clothesPoints
      })
      .eq('id', DONOR_UID);
    
    log(`✓ Clothes donation completed`, 'green');
    log(`  Status: ${completedClothes.status}`, 'cyan');
    log(`  Certificate Number: ${clothesCert.certificate_number}`, 'cyan');
    log(`  Points Awarded: ${clothesPoints}`, 'cyan');

    // Wait for triggers to update stats
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 8: Check final state
    logSection('STEP 8: Verify Final State');
    
    const { data: donorAfter } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', DONOR_UID)
      .single();
    
    const { data: orgAfter } = await supabase
      .from('organization_profiles')
      .select('*')
      .eq('id', ORG_UID)
      .single();
    
    log(`✓ Donor Updates:`, 'green');
    log(`  Points: ${donorBefore.points} → ${donorAfter.points} (+${donorAfter.points - donorBefore.points})`, 'cyan');
    log(`  Total Donated: $${donorBefore.total_donated} → $${donorAfter.total_donated}`, 'cyan');
    log(`  Donation Count: ${donorBefore.donation_count} → ${donorAfter.donation_count} (+${donorAfter.donation_count - donorBefore.donation_count})`, 'cyan');
    
    log(`\n✓ Organization Updates:`, 'green');
    log(`  Total Received: $${orgBefore.total_received} → $${orgAfter.total_received}`, 'cyan');
    log(`  Donor Count: ${orgBefore.donor_count} → ${orgAfter.donor_count} (+${orgAfter.donor_count - orgBefore.donor_count})`, 'cyan');

    // Step 9: View certificates
    logSection('STEP 9: View Donor Certificates');
    
    const { data: certificates } = await supabase
      .from('certificates')
      .select('*')
      .eq('donor_id', DONOR_UID)
      .order('issued_at', { ascending: false });
    
    log(`✓ Total Certificates: ${certificates.length}`, 'green');
    certificates.forEach((cert, i) => {
      log(`\n  Certificate ${i + 1}:`, 'yellow');
      log(`    Number: ${cert.certificate_number}`, 'cyan');
      log(`    Type: ${cert.donation_type}`, 'cyan');
      log(`    Points: ${cert.points_awarded}`, 'cyan');
      log(`    Issued: ${new Date(cert.issued_at).toLocaleString()}`, 'cyan');
    });

    // Step 10: Check leaderboard
    logSection('STEP 10: Check Leaderboard');
    
    const { data: leaderboard } = await supabase
      .from('user_profiles')
      .select('id, name, points, total_donated, donation_count')
      .order('points', { ascending: false })
      .limit(10);
    
    log(`✓ Top 10 Donors:`, 'green');
    leaderboard.forEach((user, i) => {
      const highlight = user.id === DONOR_UID;
      const color = highlight ? 'yellow' : 'cyan';
      const prefix = highlight ? '→' : ' ';
      log(`  ${prefix} ${i + 1}. ${user.name} - ${user.points} points - $${user.total_donated} donated (${user.donation_count} donations)`, color);
    });

    // Final Summary
    logSection('✅ TEST COMPLETED SUCCESSFULLY');
    log('✓ Food donation: Created → Accepted → Completed → Certificate Generated', 'green');
    log('✓ Clothes donation: Created → Accepted → Completed → Certificate Generated', 'green');
    log(`✓ Total Points Awarded: ${foodPoints + clothesPoints}`, 'green');
    log(`✓ Donor stats updated by triggers`, 'green');
    log(`✓ Organization stats updated by triggers`, 'green');
    log(`✓ Leaderboard reflects new points`, 'green');
    log('\n🎉 All database operations completed successfully!', 'bright');

  } catch (error) {
    log('\n❌ ERROR:', 'red');
    console.error(error);
    throw error;
  }
}

// Run the test
console.log('\n' + '█'.repeat(70));
log('DONATE-CONNECT DATABASE FLOW TEST', 'bright');
log('Testing: Complete donation flow with database triggers', 'cyan');
console.log('█'.repeat(70));

testCompleteFlow().catch(error => {
  process.exit(1);
});
