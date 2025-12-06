const express = require('express');
const router = express.Router();
const { authenticate, isOrganization } = require('../middlewares/auth');
const supabase = require('../config/supabase');

// Organization Signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, phone, password, registrationNumber, location, category } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Sign up organization in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: 'organization',
          name,
          phone,
          registrationNumber,
          location,
          category
        }
      }
    });

    if (authError) {
      return res.status(400).json({ 
        success: false, 
        error: authError.message 
      });
    }

    // Create organization profile
    const { data: profile, error: profileError } = await supabase
      .from('organization_profiles')
      .insert([{
        id: authData.user.id,
        name,
        email,
        phone,
        description: `${category} organization based in ${location}`,
        mission: '',
        category: category || 'other',
        location: location || '',
        address: '',
        registration_number: registrationNumber || '',
        logo_url: null,
        banner_url: null,
        verification_status: 'pending'
      }])
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    res.status(201).json({ 
      success: true, 
      data: {
        organization: profile || { 
          id: authData.user.id, 
          name, 
          email, 
          phone,
          category,
          location,
          verification_status: 'pending'
        },
        token: authData.session?.access_token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Organization Login
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

    // Get organization profile
    const { data: profile, error: profileError } = await supabase
      .from('organization_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    res.json({ 
      success: true, 
      data: {
        organization: profile || { 
          id: authData.user.id, 
          email: authData.user.email,
          name: authData.user.user_metadata?.name || '',
          phone: authData.user.user_metadata?.phone || '',
          verification_status: 'pending'
        },
        token: authData.session.access_token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get organization profile
router.get('/profile', authenticate, isOrganization, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('organization_profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Update organization profile
router.put('/profile', authenticate, isOrganization, async (req, res, next) => {
  try {
    const { name, description, mission, category, location, phone, logo_url, address, registration_number, website_url, images, banner_url } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (mission !== undefined) updateData.mission = mission;
    if (category !== undefined) updateData.category = category;
    if (location !== undefined) updateData.location = location;
    if (phone !== undefined) updateData.phone = phone;
    if (logo_url !== undefined) updateData.logo_url = logo_url;
    if (address !== undefined) updateData.address = address;
    if (registration_number !== undefined) updateData.registration_number = registration_number;
    if (website_url !== undefined) updateData.website_url = website_url;
    if (images !== undefined) updateData.images = images;
    if (banner_url !== undefined) updateData.banner_url = banner_url;

    const { data, error } = await supabase
      .from('organization_profiles')
      .update(updateData)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get organization dashboard statistics
router.get('/dashboard/stats', authenticate, isOrganization, async (req, res, next) => {
  try {
    // Get all donations for this organization with certificate data
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select(`
        id,
        status,
        donor_id,
        donation_type,
        amount,
        description,
        created_at,
        certificates (
          points_awarded
        )
      `)
      .eq('organization_id', req.user.id);

    if (donationsError) throw donationsError;

    // Calculate statistics
    const stats = {
      total_donations: donations.length,
      pending_donations: donations.filter(d => d.status === 'pending').length,
      completed_donations: donations.filter(d => d.status === 'completed').length,
      total_points_given: donations
        .filter(d => d.status === 'completed')
        .reduce((sum, d) => sum + (d.certificates?.[0]?.points_awarded || 0), 0)
    };

    // Get recent donations with donor info
    const { data: recentDonations, error: recentError } = await supabase
      .from('donations')
      .select(`
        id,
        status,
        donor_id,
        donation_type,
        amount,
        description,
        created_at,
        user_profiles:donor_id (
          id,
          name,
          email
        ),
        certificates (
          points_awarded
        )
      `)
      .eq('organization_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) throw recentError;

    res.json({ 
      success: true, 
      data: {
        stats,
        recent_donations: recentDonations
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get organization donations received
router.get('/donations', authenticate, isOrganization, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('organization_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get single donation by ID for organization
router.get('/donations/:id', authenticate, isOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        user_profiles:donor_id (
          id,
          name,
          email,
          phone,
          location
        )
      `)
      .eq('id', id)
      .eq('organization_id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get organization donation needs
router.get('/needs', authenticate, isOrganization, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('donation_needs')
      .select('*')
      .eq('organization_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Create donation need
router.post('/needs', authenticate, isOrganization, async (req, res, next) => {
  try {
    const { title, description, category, target_amount, urgency } = req.body;

    const { data, error } = await supabase
      .from('donation_needs')
      .insert({
        organization_id: req.user.id,
        title,
        description,
        category,
        target_amount,
        current_amount: 0,
        urgency,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Accept donation request
router.put('/donations/:id/accept', authenticate, isOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify donation belongs to this organization
    const { data: donation, error: checkError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', id)
      .eq('organization_id', req.user.id)
      .single();

    if (checkError || !donation) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    // Update donation status to accepted
    const { data, error } = await supabase
      .from('donations')
      .update({ 
        status: 'accepted',
        accepted_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Complete donation and generate certificate with points
router.post('/donations/:id/complete', authenticate, isOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { certificate_url, certificate_number, points_awarded } = req.body;

    // Validate points_awarded
    if (!points_awarded || points_awarded < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'points_awarded is required and must be a positive number' 
      });
    }

    // Verify donation belongs to this organization
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', id)
      .eq('organization_id', req.user.id)
      .single();

    if (donationError || !donation) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    // Update donation status to completed
    const { error: updateError } = await supabase
      .from('donations')
      .update({ 
        status: 'completed',
        completed_at: new Date()
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Generate certificate
    const certNumber = certificate_number || `CERT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const { data: certificate, error: certError } = await supabase
      .from('certificates')
      .insert({
        donor_id: donation.donor_id,
        organization_id: req.user.id,
        donation_id: id,
        certificate_number: certNumber,
        certificate_url: certificate_url || `https://storage.example.com/certificates/${certNumber}.pdf`,
        amount: donation.amount,
        donation_type: donation.donation_type,
        points_awarded: points_awarded
      })
      .select()
      .single();

    if (certError) throw certError;

    // Update user points (trigger will handle total_donated and donation_count)
    const { data: userProfile, error: profileFetchError } = await supabase
      .from('user_profiles')
      .select('points')
      .eq('id', donation.donor_id)
      .single();

    if (!profileFetchError && userProfile) {
      await supabase
        .from('user_profiles')
        .update({
          points: (userProfile.points || 0) + points_awarded
        })
        .eq('id', donation.donor_id);
    }

    // Update organization stats
    const { data: orgProfile, error: orgFetchError } = await supabase
      .from('organization_profiles')
      .select('total_received, donor_count')
      .eq('id', req.user.id)
      .single();

    if (!orgFetchError && orgProfile) {
      // Count total completed donations (including this one)
      const { data: completedDonations, error: countError } = await supabase
        .from('donations')
        .select('id', { count: 'exact' })
        .eq('organization_id', req.user.id)
        .eq('status', 'completed');

      if (!countError) {
        await supabase
          .from('organization_profiles')
          .update({
            total_received: completedDonations.length
          })
          .eq('id', req.user.id);
      }
      
      // Update donor count - count distinct donors with completed donations
      const { data: distinctDonors, error: donorError } = await supabase
        .from('donations')
        .select('donor_id')
        .eq('organization_id', req.user.id)
        .eq('status', 'completed');

      if (!donorError && distinctDonors) {
        const uniqueDonors = new Set(distinctDonors.map(d => d.donor_id));
        await supabase
          .from('organization_profiles')
          .update({
            donor_count: uniqueDonors.size
          })
          .eq('id', req.user.id);
      }
    }

    res.json({ 
      success: true, 
      data: {
        donation: { ...donation, status: 'completed' },
        certificate,
        points_awarded: points_awarded
      },
      message: 'Donation completed and certificate generated'
    });
  } catch (error) {
    next(error);
  }
});

// Reject donation request
router.put('/donations/:id/reject', authenticate, isOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Verify donation belongs to this organization
    const { data: donation, error: checkError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', id)
      .eq('organization_id', req.user.id)
      .single();

    if (checkError || !donation) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    // Update donation status to rejected
    const { data, error } = await supabase
      .from('donations')
      .update({ 
        status: 'rejected',
        rejected_at: new Date(),
        notes: reason
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data, message: 'Donation rejected' });
  } catch (error) {
    next(error);
  }
});

// Get all received donations for organization (from organization_donations table)
router.get('/received-donations', authenticate, isOrganization, async (req, res, next) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('organization_donations')
      .select(`
        *,
        donations:donation_id (
          id,
          donor_id,
          donation_type,
          amount,
          description,
          item_description,
          quantity,
          status,
          created_at,
          completed_at,
          user_profiles:donor_id (
            id,
            name,
            email,
            avatar_url
          )
        )
      `)
      .eq('organization_id', req.user.id)
      .order('received_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw error;

    // Filter by donation status if provided
    let filteredData = data;
    if (status) {
      filteredData = data.filter(od => od.donations?.status === status);
    }

    res.json({ 
      success: true, 
      data: filteredData,
      count: filteredData.length 
    });
  } catch (error) {
    next(error);
  }
});

// Get donation statistics for organization
router.get('/donation-stats', authenticate, isOrganization, async (req, res, next) => {
  try {
    // Get all received donations
    const { data: receivedDonations, error: receivedError } = await supabase
      .from('organization_donations')
      .select(`
        *,
        donations:donation_id (
          donation_type,
          amount,
          quantity
        )
      `)
      .eq('organization_id', req.user.id);

    if (receivedError) throw receivedError;

    // Calculate statistics
    const stats = {
      total_received: receivedDonations.length,
      by_type: {
        items: receivedDonations.filter(d => d.donations?.donation_type === 'items').length,
        money: receivedDonations.filter(d => d.donations?.donation_type === 'money').length,
        food: receivedDonations.filter(d => d.donations?.donation_type === 'food').length,
      },
      total_amount: receivedDonations.reduce((sum, d) => sum + (parseFloat(d.donations?.amount) || 0), 0),
      total_items: receivedDonations.reduce((sum, d) => sum + (parseInt(d.donations?.quantity) || 0), 0),
      recent_donations: receivedDonations.slice(0, 5).map(d => ({
        id: d.id,
        received_at: d.received_at,
        donation_type: d.donations?.donation_type
      }))
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

// Get single received donation details
router.get('/received-donations/:id', authenticate, isOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('organization_donations')
      .select(`
        *,
        donations:donation_id (
          *,
          user_profiles:donor_id (
            id,
            name,
            email,
            phone,
            location,
            avatar_url
          ),
          certificates (
            id,
            certificate_number,
            certificate_url,
            points_awarded,
            issued_at
          )
        )
      `)
      .eq('id', id)
      .eq('organization_id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Update notes for received donation
router.patch('/received-donations/:id/notes', authenticate, isOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    // Verify it belongs to this organization
    const { data: existing, error: checkError } = await supabase
      .from('organization_donations')
      .select('id')
      .eq('id', id)
      .eq('organization_id', req.user.id)
      .single();

    if (checkError || !existing) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    // Update notes
    const { data, error } = await supabase
      .from('organization_donations')
      .update({ notes })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data, message: 'Notes updated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
