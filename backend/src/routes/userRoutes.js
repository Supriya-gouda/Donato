const express = require('express');
const router = express.Router();
const { authenticate, isDonor } = require('../middlewares/auth');
const supabase = require('../config/supabase');

// User Signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: 'donor',
          name,
          phone
        }
      }
    });

    if (authError) {
      return res.status(400).json({ 
        success: false, 
        error: authError.message 
      });
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        name,
        email,
        phone,
        points: 0,
        badge: 'bronze',
        location: '',
        avatar_url: null
      }])
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    res.status(201).json({ 
      success: true, 
      data: {
        user: profile || { id: authData.user.id, name, email, phone, points: 0, badge: 'bronze' },
        token: authData.session?.access_token
      }
    });
  } catch (error) {
    next(error);
  }
});

// User Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    res.json({ 
      success: true, 
      data: {
        user: profile || { 
          id: authData.user.id, 
          email: authData.user.email,
          name: authData.user.user_metadata?.name || '',
          phone: authData.user.user_metadata?.phone || '',
          points: 0,
          badge: 'bronze'
        },
        token: authData.session.access_token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user profile
router.get('/profile', authenticate, isDonor, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticate, isDonor, async (req, res, next) => {
  try {
    const { name, phone, location, avatar_url } = req.body;

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ name, phone, location, avatar_url, updated_at: new Date() })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get user dashboard with stats
router.get('/dashboard', authenticate, isDonor, async (req, res, next) => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (profileError) throw profileError;

    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('status, amount')
      .eq('donor_id', req.user.id);

    if (donationsError) throw donationsError;

    const stats = {
      total_donations: donations.length,
      pending_donations: donations.filter(d => d.status === 'pending').length,
      completed_donations: donations.filter(d => d.status === 'completed').length,
      total_amount: donations.reduce((sum, d) => sum + (d.amount || 0), 0)
    };

    const { data: recentDonations, error: recentError } = await supabase
      .from('donations')
      .select(`
        *,
        organization_profiles!donations_organization_id_fkey (
          id,
          name,
          logo_url
        )
      `)
      .eq('donor_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) throw recentError;

    res.json({ 
      success: true, 
      data: {
        profile,
        stats,
        recent_donations: recentDonations
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get organizations filtered by location
router.get('/organizations', authenticate, isDonor, async (req, res, next) => {
  try {
    const { location } = req.query;

    let query = supabase
      .from('organization_profiles')
      .select('*')
      .eq('verification_status', 'verified');

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get single organization details with donation needs
router.get('/organizations/:id', authenticate, isDonor, async (req, res, next) => {
  try {
    const { data: org, error: orgError } = await supabase
      .from('organization_profiles')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (orgError) throw orgError;

    const { data: needs, error: needsError } = await supabase
      .from('donation_needs')
      .select('*')
      .eq('organization_id', req.params.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (needsError) throw needsError;

    res.json({ 
      success: true, 
      data: {
        ...org,
        donation_needs: needs
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create donation request
router.post('/donations', authenticate, isDonor, async (req, res, next) => {
  try {
    const { 
      organization_id, 
      donation_need_id, 
      amount, 
      donation_type,
      description,
      item_description,
      quantity,
      payment_method 
    } = req.body;

    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert({
        donor_id: req.user.id,
        organization_id,
        donation_need_id,
        amount: amount || null,
        donation_type,
        description,
        item_description,
        quantity,
        payment_method,
        status: 'pending'
      })
      .select()
      .single();

    if (donationError) throw donationError;

    res.status(201).json({ success: true, data: donation, message: 'Donation created successfully' });
  } catch (error) {
    next(error);
  }
});

// Get user donations history
router.get('/donations', authenticate, isDonor, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        organization_profiles!donations_organization_id_fkey (
          id,
          name,
          logo_url
        ),
        certificates (
          points_awarded,
          certificate_number,
          certificate_url
        )
      `)
      .eq('donor_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get user certificates
router.get('/certificates', authenticate, isDonor, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        donations!certificates_donation_id_fkey (
          amount,
          donation_type,
          created_at
        ),
        organization_profiles!certificates_organization_id_fkey (
          name,
          logo_url
        )
      `)
      .eq('donor_id', req.user.id)
      .order('issued_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get leaderboard by location
router.get('/leaderboard', authenticate, isDonor, async (req, res, next) => {
  try {
    const { location } = req.query;

    let query = supabase
      .from('user_profiles')
      .select('id, name, location, points, total_donated, badge, avatar_url')
      .order('points', { ascending: false })
      .limit(50);

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

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
