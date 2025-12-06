const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all organizations
router.get('/organizations', async (req, res, next) => {
  try {
    const { location } = req.query;
    
    let query = supabase
      .from('organization_profiles')
      .select('*')
      .eq('verification_status', 'verified')
      .order('created_at', { ascending: false });
    
    // Filter by location if provided
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get organization by ID
router.get('/organizations/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('organization_profiles')
      .select('*')
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
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, name, points, total_donated, badge, avatar_url')
      .order('points', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
