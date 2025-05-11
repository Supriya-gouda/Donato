import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Calendar, Users, Clock } from 'lucide-react';
import Button from '../../components/shared/Button';
import Card, { CardContent, CardHeader } from '../../components/shared/Card';
import { getOrganizationById } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';

const EventRegistration: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const organization = getOrganizationById(id || '');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [attendees, setAttendees] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  if (!organization) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Organization Not Found</h2>
        <p className="text-gray-600 mb-6">The organization you're looking for doesn't exist or has been removed.</p>
        <Link to="/donor/dashboard">
          <Button variant="primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }
  
  if (!organization.events) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Events Not Available</h2>
        <p className="text-gray-600 mb-6">This organization does not currently accept event celebrations.</p>
        <Link to={`/organization/${id}`}>
          <Button variant="primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Organization
          </Button>
        </Link>
      </div>
    );
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };
  
  const handleGoToDashboard = () => {
    navigate('/donor/dashboard');
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto">
          <CardContent className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Event Request Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for choosing to celebrate with {organization.name}! Your event request has been submitted, and they will contact you shortly to confirm details.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={handleGoToDashboard}>
                Go to Dashboard
              </Button>
              <Link to={`/organization/${id}`}>
                <Button>
                  View Organization
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={`/organization/${id}`} className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Organization
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Register an Event at {organization.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Event Details</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="e.g., Birthday Celebration, Anniversary, etc."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Please describe your event, any specific requirements, and what you plan to bring..."
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Date
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Time
                        </label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of People Attending
                      </label>
                      <input
                        type="number"
                        value={attendees}
                        onChange={(e) => setAttendees(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="How many people will be joining from your side?"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={isLoading}
                      >
                        Submit Event Request
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Organization Details</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <img
                    src={organization.image}
                    alt={organization.name}
                    className="h-12 w-12 object-cover rounded-md mr-3"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{organization.name}</h4>
                    <p className="text-sm text-gray-500">{organization.address}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{organization.description}</p>
                <Link to={`/organization/${id}`} className="text-sm text-purple-600 hover:text-purple-800">
                  View Full Details
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Event Guidelines</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Calendar className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                    <p>Events should be scheduled at least 7 days in advance to allow for proper preparation.</p>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                    <p>Events typically last 2-3 hours and are best scheduled between 10 AM and 4 PM.</p>
                  </li>
                  <li className="flex items-start">
                    <Users className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                    <p>Please ensure that the number of attendees is reasonable for the space and the comfort of the residents.</p>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>The organization reserves the right to approve or suggest modifications to event plans based on their schedule and the needs of their residents.</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;