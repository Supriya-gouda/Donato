import { Organization, DonationNeed, Donation, Certificate, Event, LeaderboardEntry } from '../types';

// Mock data for organizations
export const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'Hope Children\'s Home',
    description: 'An orphanage dedicated to providing a loving home for children in need, with focus on education and holistic development.',
    address: '123 Main St, New Delhi, 110001',
    image: 'https://images.pexels.com/photos/1250452/pexels-photo-1250452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    phone: '+91 98765 43210',
    email: 'contact@hopechildren.org',
    website: 'www.hopechildren.org',
    coordinates: { latitude: 28.6139, longitude: 77.2090 },
    distance: 2.3,
    priorityLevel: 3,
    verified: true,
    donationNeeds: [
      {
        id: 'need1',
        type: 'food',
        description: 'Non-perishable food items like rice, lentils, and cooking oil',
        priority: 3
      },
      {
        id: 'need2',
        type: 'books',
        description: 'Educational books for children aged 5-15 years',
        priority: 2
      },
      {
        id: 'need3',
        type: 'clothes',
        description: 'Winter clothes for children aged 3-16 years',
        priority: 2
      }
    ],
    donationCount: 156,
    events: true,
    photoGallery: [
      {
        id: 'g1',
        imageUrl: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg',
        caption: 'Children enjoying their new books from a recent donation',
        date: '2024-03-15',
        type: 'donation'
      },
      {
        id: 'g2',
        imageUrl: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg',
        caption: 'Birthday celebration event with donors',
        date: '2024-02-20',
        type: 'event'
      },
      {
        id: 'g3',
        imageUrl: 'https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg',
        caption: 'Our newly renovated study room',
        date: '2024-01-10',
        type: 'facility'
      }
    ]
  },
  {
    id: 'org2',
    name: 'Golden Years Foundation',
    description: 'An old age home providing care, comfort and dignity to the elderly who need support and assistance in their golden years.',
    address: '45 Park Avenue, Mumbai, 400001',
    image: 'https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    phone: '+91 99887 76655',
    email: 'info@goldenyears.org',
    website: 'www.goldenyears.org',
    coordinates: { latitude: 19.0760, longitude: 72.8777 },
    distance: 4.8,
    priorityLevel: 2,
    verified: true,
    donationNeeds: [
      {
        id: 'need4',
        type: 'food',
        description: 'Nutritious food items suitable for elderly people',
        priority: 3
      },
      {
        id: 'need5',
        type: 'infrastructure',
        description: 'Wheelchairs, walking aids, and medical equipment',
        priority: 2
      },
      {
        id: 'need6',
        type: 'money',
        description: 'Financial assistance for medical treatments',
        priority: 3
      }
    ],
    donationCount: 98,
    events: true,
    photoGallery: [
      {
        id: 'g4',
        imageUrl: 'https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg',
        caption: 'Elderly residents enjoying the new garden area',
        date: '2024-03-10',
        type: 'facility'
      },
      {
        id: 'g5',
        imageUrl: 'https://images.pexels.com/photos/7551618/pexels-photo-7551618.jpeg',
        caption: 'Music therapy session with volunteers',
        date: '2024-02-15',
        type: 'event'
      }
    ]
  },
  {
    id: 'org3',
    name: 'Better Tomorrow NGO',
    description: 'A community-focused NGO working on education, health, and poverty alleviation in underprivileged areas.',
    address: '78 Civil Lines, Jaipur, 302006',
    image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    phone: '+91 93456 78901',
    email: 'contact@bettertomorrow.org',
    website: 'www.bettertomorrow.org',
    coordinates: { latitude: 26.9124, longitude: 75.7873 },
    distance: 5.1,
    priorityLevel: 1,
    verified: true,
    donationNeeds: [
      {
        id: 'need7',
        type: 'books',
        description: 'Books for community libraries in rural areas',
        priority: 1
      },
      {
        id: 'need8',
        type: 'infrastructure',
        description: 'Computer equipment for digital literacy programs',
        priority: 2
      }
    ],
    donationCount: 211,
    events: false
  },
  {
    id: 'org4',
    name: 'Child Dreams Foundation',
    description: 'Working towards providing education, healthcare, and nutrition to underprivileged children across multiple states.',
    address: '56 Green Park, Bangalore, 560001',
    image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    phone: '+91 97654 32109',
    email: 'support@childdreams.org',
    website: 'www.childdreams.org',
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
    distance: 3.7,
    priorityLevel: 3,
    verified: true,
    donationNeeds: [
      {
        id: 'need9',
        type: 'food',
        description: 'Nutritional supplements and meals for malnourished children',
        priority: 3
      },
      {
        id: 'need10',
        type: 'books',
        description: 'Educational books and school supplies',
        priority: 2
      },
      {
        id: 'need11',
        type: 'clothes',
        description: 'Uniforms and daily wear for children',
        priority: 2
      }
    ],
    donationCount: 187,
    events: true
  },
  {
    id: 'org5',
    name: 'Dignity Elder Care',
    description: 'Providing compassionate care and a homely environment for senior citizens who need assistance and companionship.',
    address: '34 Church Street, Chennai, 600001',
    image: 'https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    phone: '+91 96543 21098',
    email: 'care@dignityelder.org',
    website: 'www.dignityelder.org',
    coordinates: { latitude: 13.0827, longitude: 80.2707 },
    distance: 6.4,
    priorityLevel: 2,
    verified: true,
    donationNeeds: [
      {
        id: 'need12',
        type: 'infrastructure',
        description: 'Medical equipment and mobility aids',
        priority: 3
      },
      {
        id: 'need13',
        type: 'food',
        description: 'Special dietary foods for elderly with health conditions',
        priority: 2
      }
    ],
    donationCount: 134,
    events: true
  },
  {
    id: 'org6',
    name: 'Rural Upliftment Society',
    description: 'Focusing on sustainable development in rural communities through education, skill development, and agricultural support.',
    address: '12 Gandhi Road, Lucknow, 226001',
    image: 'https://images.pexels.com/photos/296234/pexels-photo-296234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    phone: '+91 95432 10987',
    email: 'info@ruralupliftment.org',
    website: 'www.ruralupliftment.org',
    coordinates: { latitude: 26.8467, longitude: 80.9462 },
    distance: 7.9,
    priorityLevel: 1,
    verified: true,
    donationNeeds: [
      {
        id: 'need14',
        type: 'infrastructure',
        description: 'Agricultural tools and equipment for farmers',
        priority: 2
      },
      {
        id: 'need15',
        type: 'books',
        description: 'Educational materials for rural schools',
        priority: 1
      }
    ],
    donationCount: 76,
    events: false
  }
];

// Mock data for donor's donations
export const mockDonations: Donation[] = [
  {
    id: 'don1',
    donorId: 'd1',
    organizationId: 'org1',
    type: 'food',
    description: 'Monthly supply of rice, lentils, and cooking oil',
    date: '2023-11-15',
    status: 'completed',
    certificateId: 'cert1',
    pointsAwarded: 50
  },
  {
    id: 'don2',
    donorId: 'd1',
    organizationId: 'org2',
    type: 'money',
    description: 'Financial contribution for medical expenses',
    date: '2023-12-05',
    status: 'completed',
    certificateId: 'cert2',
    pointsAwarded: 75
  },
  {
    id: 'don3',
    donorId: 'd1',
    organizationId: 'org4',
    type: 'books',
    description: 'Educational books for children aged 6-12',
    date: '2024-01-20',
    status: 'completed',
    certificateId: 'cert3',
    pointsAwarded: 40
  },
  {
    id: 'don4',
    donorId: 'd1',
    organizationId: 'org1',
    type: 'clothes',
    description: 'Winter clothes for children',
    date: '2024-02-10',
    status: 'completed',
    certificateId: 'cert4',
    pointsAwarded: 35
  },
  {
    id: 'don5',
    donorId: 'd1',
    organizationId: 'org5',
    type: 'infrastructure',
    description: 'Two wheelchairs and medical equipment',
    date: '2024-03-05',
    status: 'pending'
  }
];

// Mock data for certificates
export const mockCertificates: Certificate[] = [
  {
    id: 'cert1',
    donationId: 'don1',
    donorId: 'd1',
    organizationId: 'org1',
    date: '2023-11-15',
    verificationCode: 'VER12345',
    downloadUrl: '#'
  },
  {
    id: 'cert2',
    donationId: 'don2',
    donorId: 'd1',
    organizationId: 'org2',
    date: '2023-12-05',
    verificationCode: 'VER23456',
    downloadUrl: '#'
  },
  {
    id: 'cert3',
    donationId: 'don3',
    donorId: 'd1',
    organizationId: 'org4',
    date: '2024-01-20',
    verificationCode: 'VER34567',
    downloadUrl: '#'
  },
  {
    id: 'cert4',
    donationId: 'don4',
    donorId: 'd1',
    organizationId: 'org1',
    date: '2024-02-10',
    verificationCode: 'VER45678',
    downloadUrl: '#'
  }
];

// Mock data for events
export const mockEvents: Event[] = [
  {
    id: 'evt1',
    donorId: 'd1',
    organizationId: 'org1',
    title: 'Birthday Celebration',
    description: 'Celebrating my daughter\'s birthday with the children',
    date: '2024-01-15',
    status: 'completed',
    attendees: 25
  },
  {
    id: 'evt2',
    donorId: 'd1',
    organizationId: 'org2',
    title: 'Music Session',
    description: 'Organizing a musical evening for the elderly residents',
    date: '2024-02-28',
    status: 'approved',
    attendees: 20
  },
  {
    id: 'evt3',
    donorId: 'd1',
    organizationId: 'org4',
    title: 'Educational Workshop',
    description: 'Conducting a science workshop for the children',
    date: '2024-04-10',
    status: 'pending'
  }
];

// Mock data for leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: 'lead1',
    donorId: 'user1',
    donorName: 'Priya Sharma',
    donorImage: 'https://randomuser.me/api/portraits/women/32.jpg',
    points: 785,
    donationCount: 23,
    rank: 1
  },
  {
    id: 'lead2',
    donorId: 'user2',
    donorName: 'Rahul Verma',
    donorImage: 'https://randomuser.me/api/portraits/men/41.jpg',
    points: 650,
    donationCount: 18,
    rank: 2
  },
  {
    id: 'lead3',
    donorId: 'd1',
    donorName: 'John Donor',
    donorImage: 'https://randomuser.me/api/portraits/men/64.jpg',
    points: 250,
    donationCount: 12,
    rank: 3
  },
  {
    id: 'lead4',
    donorId: 'user4',
    donorName: 'Meera Patel',
    donorImage: 'https://randomuser.me/api/portraits/women/45.jpg',
    points: 235,
    donationCount: 10,
    rank: 4
  },
  {
    id: 'lead5',
    donorId: 'user5',
    donorName: 'Arun Singh',
    donorImage: 'https://randomuser.me/api/portraits/men/12.jpg',
    points: 190,
    donationCount: 8,
    rank: 5
  },
  {
    id: 'lead6',
    donorId: 'user6',
    donorName: 'Divya Kumar',
    donorImage: 'https://randomuser.me/api/portraits/women/22.jpg',
    points: 175,
    donationCount: 7,
    rank: 6
  },
  {
    id: 'lead7',
    donorId: 'user7',
    donorName: 'Karan Malhotra',
    donorImage: 'https://randomuser.me/api/portraits/men/33.jpg',
    points: 150,
    donationCount: 6,
    rank: 7
  },
  {
    id: 'lead8',
    donorId: 'user8',
    donorName: 'Ananya Gupta',
    donorImage: 'https://randomuser.me/api/portraits/women/58.jpg',
    points: 120,
    donationCount: 5,
    rank: 8
  }
];

// Utility function to get organization by ID
export const getOrganizationById = (id: string): Organization | undefined => {
  return mockOrganizations.find(org => org.id === id);
};

// Utility function to get donation by ID
export const getDonationById = (id: string): Donation | undefined => {
  return mockDonations.find(donation => donation.id === id);
};

// Utility function to get certificate by ID
export const getCertificateById = (id: string): Certificate | undefined => {
  return mockCertificates.find(cert => cert.id === id);
};

// Utility function to get event by ID
export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};

// Utility function to filter organizations by distance and priority
export const filterOrganizations = (
  maxDistance?: number,
  minPriority?: number
): Organization[] => {
  let filtered = [...mockOrganizations];
  
  if (maxDistance !== undefined) {
    filtered = filtered.filter(org => org.distance <= maxDistance);
  }
  
  if (minPriority !== undefined) {
    filtered = filtered.filter(org => org.priorityLevel >= minPriority);
  }
  
  return filtered.sort((a, b) => {
    // Sort by priority level first (higher priority first)
    if (b.priorityLevel !== a.priorityLevel) {
      return b.priorityLevel - a.priorityLevel;
    }
    
    // Then sort by distance (shorter distance first)
    return a.distance - b.distance;
  });
};

// Utility function to filter donations by donor
export const getDonationsByDonor = (donorId: string): Donation[] => {
  return mockDonations.filter(donation => donation.donorId === donorId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Utility function to filter donations by organization
export const getDonationsByOrganization = (orgId: string): Donation[] => {
  return mockDonations.filter(donation => donation.organizationId === orgId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Utility function to filter events by donor
export const getEventsByDonor = (donorId: string): Event[] => {
  return mockEvents.filter(event => event.donorId === donorId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Utility function to filter events by organization
export const getEventsByOrganization = (orgId: string): Event[] => {
  return mockEvents.filter(event => event.organizationId === orgId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};