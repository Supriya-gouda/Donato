import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../../components/shared/Button';
import Card, { CardContent, CardHeader, CardFooter } from '../../components/shared/Card';
import { getOrganizationById } from '../../utils/mockData';
import { DonationType } from '../../types';
import { useAuth } from '../../context/AuthContext';

const DonationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const organization = getOrganizationById(id || '');
  const { user: currentUser } = useAuth(); // Renamed but not used yet, will be needed for API integration
  const navigate = useNavigate();

  const [donationType, setDonationType] = useState<DonationType>('food');
  const [description, setDescription] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [date, setDate] = useState<string>('');
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Donation Request Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your generosity! Your donation request to {organization.name} has been submitted. They will contact you shortly to coordinate the donation.
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation to {organization.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Donation Details</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Donation Type
                      </label>
                      <select
                        value={donationType}
                        onChange={(e) => setDonationType(e.target.value as DonationType)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        required
                      >
                        <option value="food">Food</option>
                        <option value="books">Books</option>
                        <option value="clothes">Clothes</option>
                        <option value="money">Money</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="other">Other</option>
                      </select>
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
                        placeholder="Please describe what you are donating in detail..."
                        required
                      />
                    </div>

                    {donationType !== 'money' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="text"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="e.g., 5 boxes, 10 kg, 20 items, etc."
                          required
                        />
                      </div>
                    )}

                    {donationType === 'money' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Enter amount"
                          min="1"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Donation Date
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

                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={isLoading}
                      >
                        Submit Donation Request
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
                <h3 className="font-semibold text-gray-900">Current Donation Needs</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {organization.donationNeeds.map((need) => (
                    <li key={need.id} className="flex items-start">
                      <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-3 text-xs font-medium ${
                        need.priority === 3 ? 'bg-red-100 text-red-800' :
                        need.priority === 2 ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {need.priority}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">{need.type}</p>
                        <p className="text-xs text-gray-500">{need.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="bg-purple-50 text-sm text-purple-700">
                <p>
                  Higher priority items (3 is highest) are urgently needed by the organization.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;