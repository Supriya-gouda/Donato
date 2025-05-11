import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Package, Users, Calendar, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import Button from '../../components/shared/Button';
import Card, { CardContent, CardFooter, CardHeader } from '../../components/shared/Card';
import { useAuth } from '../../context/AuthContext';
import { getDonationsByOrganization, getEventsByOrganization } from '../../utils/mockData';
import { Donation, Event } from '../../types';

const RecipientDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const [donationRequests, setDonationRequests] = useState<Donation[]>([]);
  const [eventRequests, setEventRequests] = useState<Event[]>([]);
  const [completedDonations, setCompletedDonations] = useState<Donation[]>([]);
  const [expandedDonation, setExpandedDonation] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real app, these would be API calls
    // For now, we'll use the mock data with a fake organization ID
    const orgId = 'org1'; // Fake ID for demonstration
    
    const donations = getDonationsByOrganization(orgId);
    setDonationRequests(donations.filter(d => d.status === 'pending'));
    setCompletedDonations(donations.filter(d => d.status === 'completed'));
    
    const events = getEventsByOrganization(orgId);
    setEventRequests(events.filter(e => e.status === 'pending'));
  }, [user]);
  
  const handleAcceptDonation = (id: string) => {
    // In a real app, this would be an API call
    setDonationRequests(prev => 
      prev.map(donation => 
        donation.id === id ? { ...donation, status: 'accepted' } : donation
      )
    );
  };
  
  const handleRejectDonation = (id: string) => {
    // In a real app, this would be an API call
    setDonationRequests(prev => 
      prev.map(donation => 
        donation.id === id ? { ...donation, status: 'rejected' } : donation
      )
    );
  };
  
  const handleAcceptEvent = (id: string) => {
    // In a real app, this would be an API call
    setEventRequests(prev => 
      prev.map(event => 
        event.id === id ? { ...event, status: 'approved' } : event
      )
    );
  };
  
  const handleRejectEvent = (id: string) => {
    // In a real app, this would be an API call
    setEventRequests(prev => 
      prev.map(event => 
        event.id === id ? { ...event, status: 'rejected' } : event
      )
    );
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const toggleDonationExpand = (id: string) => {
    if (expandedDonation === id) {
      setExpandedDonation(null);
    } else {
      setExpandedDonation(id);
    }
  };
  
  const toggleEventExpand = (id: string) => {
    if (expandedEvent === id) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Organization Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage donation requests, events, and your organization profile.</p>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-4">
          <Link to="/recipient/profile">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">{completedDonations.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center">
            <div className="bg-teal-100 rounded-full p-3 mr-4">
              <Package className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Donations</p>
              <p className="text-2xl font-bold text-gray-900">{donationRequests.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center">
            <div className="bg-orange-100 rounded-full p-3 mr-4">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Events</p>
              <p className="text-2xl font-bold text-gray-900">{eventRequests.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pending Donation Requests */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Donation Requests</h2>
      {donationRequests.length > 0 ? (
        <div className="space-y-4 mb-8">
          {donationRequests.map((donation) => (
            <Card key={donation.id} className="border border-gray-200">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900 capitalize">{donation.type} Donation</h3>
                  <p className="text-sm text-gray-500">Requested on {formatDate(donation.date)}</p>
                </div>
                <button 
                  onClick={() => toggleDonationExpand(donation.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedDonation === donation.id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </CardHeader>
              
              {expandedDonation === donation.id && (
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Description</h4>
                      <p className="text-gray-600">{donation.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Donor Information</h4>
                      <div className="flex items-center mt-2">
                        <img 
                          src="https://randomuser.me/api/portraits/men/64.jpg" 
                          alt="Donor" 
                          className="h-8 w-8 rounded-full mr-3" 
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">John Donor</p>
                          <p className="text-xs text-gray-500">donor@example.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
              
              <CardFooter className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleRejectDonation(donation.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleAcceptDonation(donation.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Accept
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mb-8">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No pending donation requests at the moment.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Pending Event Requests */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Event Requests</h2>
      {eventRequests.length > 0 ? (
        <div className="space-y-4 mb-8">
          {eventRequests.map((event) => (
            <Card key={event.id} className="border border-gray-200">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-500">Scheduled for {formatDate(event.date)}</p>
                </div>
                <button 
                  onClick={() => toggleEventExpand(event.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedEvent === event.id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </CardHeader>
              
              {expandedEvent === event.id && (
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Description</h4>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Expected Attendees</h4>
                        <p className="text-gray-900">{event.attendees || 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Event Date</h4>
                        <p className="text-gray-900">{formatDate(event.date)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Organizer Information</h4>
                      <div className="flex items-center mt-2">
                        <img 
                          src="https://randomuser.me/api/portraits/men/64.jpg" 
                          alt="Organizer" 
                          className="h-8 w-8 rounded-full mr-3" 
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">John Donor</p>
                          <p className="text-xs text-gray-500">donor@example.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
              
              <CardFooter className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleRejectEvent(event.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleAcceptEvent(event.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Accept
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mb-8">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No pending event requests at the moment.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Recent Donations */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Donations</h2>
      {completedDonations.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completedDonations.map((donation) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(donation.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-full" src="https://randomuser.me/api/portraits/men/64.jpg" alt="" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">John Donor</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 capitalize">
                      {donation.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                    {donation.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.certificateId ? (
                      <span className="text-green-600 font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Issued
                      </span>
                    ) : (
                      <Button size="sm" variant="outline">
                        Issue Certificate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No completed donations yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecipientDashboard;