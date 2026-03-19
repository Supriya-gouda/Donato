const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');

// Get all organizations
router.get('/organizations', async (req, res, next) => {
  try {
    const { location } = req.query;
    
    // Use admin client to bypass RLS for this public endpoint
    // This allows unauthenticated users to view verified organizations
    const client = supabaseAdmin || supabase;
    
    // Start with base query - remove any default limits
    // Select organization data with donation count using subquery
    let query = client
      .from('organization_profiles')
      .select(`
        *,
        donations:donations(count)
      `, { count: 'exact' })
      .eq('verification_status', 'verified')
      .order('created_at', { ascending: false });
    
    // Filter by location if provided
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Fetch all results by setting a very high range
    // Supabase has a max-rows configuration, so we set a large range to get all results
    const { data, error, count } = await query.range(0, 9999);

    if (error) throw error;

    // Transform data to include actual donation count
    const transformedData = data?.map(org => ({
      ...org,
      total_donations: org.donations?.[0]?.count || 0,
      donations: undefined // Remove the nested donations object
    })) || [];

    console.log(`Fetched ${transformedData?.length || 0} organizations (total: ${count || 0})`);
    res.json({ success: true, data: transformedData, total: count });
  } catch (error) {
    next(error);
  }
});

// Get organization by ID
router.get('/organizations/:id', async (req, res, next) => {
  try {
    // Use admin client to bypass RLS for this public endpoint
    const client = supabaseAdmin || supabase;
    
    const { data, error } = await client
      .from('organization_profiles')
      .select('*, total_received, donor_count')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { location } = req.query;
    
    // Use admin client to bypass RLS for this public endpoint
    const client = supabaseAdmin || supabase;
    
    let query = client
      .from('user_profiles')
      .select('id, name, location, points, total_donated, badge, avatar_url')
      .order('points', { ascending: false })
      .limit(50);

    if (location && location !== 'all') {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Add rank based on position (highest points = rank 1)
    const rankedData = data.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.json({ success: true, data: rankedData });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
