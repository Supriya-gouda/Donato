import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { MapPin, Search, Filter, Award } from 'lucide-react';
import Button from '../../components/shared/Button';
import Card, { CardContent } from '../../components/shared/Card';
import OrganizationCard from '../../components/donor/OrganizationCard';
import { Organization } from '../../types';
import { filterOrganizations, getDonationsByDonor } from '../../utils/mockData';
import { Link } from 'react-router-dom';

const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userLocation, getLocation } = useLocation();
  
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDistance, setFilterDistance] = useState<number | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<number | undefined>(undefined);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  
  const [recentDonations, setRecentDonations] = useState<number>(0);
  const [pendingDonations, setPendingDonations] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  
  useEffect(() => {
    // Load organizations
    const orgs = filterOrganizations(filterDistance, filterPriority);
    setOrganizations(orgs);
    
    // Load user stats
    if (user && user.id) {
      const donations = getDonationsByDonor(user.id);
      setRecentDonations(donations.filter(d => d.status === 'completed').length);
      setPendingDonations(donations.filter(d => d.status === 'pending').length);
      setTotalPoints(user.points || 0);
    }
  }, [user, filterDistance, filterPriority]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter organizations by search term
    const orgs = filterOrganizations(filterDistance, filterPriority);
    const filtered = orgs.filter(org => 
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      org.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setOrganizations(filtered);
  };
  
  const clearFilters = () => {
    setFilterDistance(undefined);
    setFilterPriority(undefined);
    setSearchTerm('');
    setOrganizations(filterOrganizations());
    setIsFiltersOpen(false);
  };
  
  const applyFilters = () => {
    setOrganizations(filterOrganizations(filterDistance, filterPriority));
    setIsFiltersOpen(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Find organizations near you and make a difference today.</p>
        </div>
        <Link to="/leaderboard">
          <Button className="mt-4 md:mt-0">
            <Award className="h-5 w-5 mr-2" />
            View Leaderboard
          </Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Your Points</p>
              <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Donations</p>
              <p className="text-2xl font-bold text-gray-900">{recentDonations}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center">
            <div className="bg-amber-100 rounded-full p-3 mr-4">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Donations</p>
              <p className="text-2xl font-bold text-gray-900">{pendingDonations}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Location and Search */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            {userLocation ? (
              <span className="text-gray-600">
                Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
              </span>
            ) : (
              <span className="text-gray-600">Location not available</span>
            )}
            <button 
              onClick={() => getLocation()} 
              className="ml-3 text-sm text-purple-600 hover:text-purple-800 transition-colors"
            >
              Update
            </button>
          </div>
          
          <div className="flex items-center">
            <form onSubmit={handleSearch} className="flex w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="rounded-l-none">
                Search
              </Button>
            </form>
            
            <button 
              className="ml-3 p-2 text-gray-500 hover:text-purple-600 focus:outline-none focus:text-purple-600"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Filters */}
        {isFiltersOpen && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              <div className="mb-4 md:mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Distance (km)
                </label>
                <select
                  value={filterDistance || ''}
                  onChange={(e) => setFilterDistance(e.target.value ? Number(e.target.value) : undefined)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                >
                  <option value="">Any distance</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="20">Within 20 km</option>
                  <option value="50">Within 50 km</option>
                </select>
              </div>
              
              <div className="mb-4 md:mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Priority Level
                </label>
                <select
                  value={filterPriority || ''}
                  onChange={(e) => setFilterPriority(e.target.value ? Number(e.target.value) : undefined)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                >
                  <option value="">Any priority</option>
                  <option value="1">Low and above</option>
                  <option value="2">Medium and above</option>
                  <option value="3">High priority only</option>
                </select>
              </div>
              
              <div className="flex space-x-3 md:self-end">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear
                </Button>
                <Button size="sm" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Organizations Grid */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Organizations Near You</h2>
      
      {organizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-600">No organizations found matching your criteria.</p>
          <Button className="mt-4" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;