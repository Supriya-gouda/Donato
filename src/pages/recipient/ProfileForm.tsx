import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, MapPin, Phone, Mail, Globe, AlertCircle } from 'lucide-react';
import Button from '../../components/shared/Button';
import Card, { CardContent, CardHeader } from '../../components/shared/Card';
import { useAuth } from '../../context/AuthContext';
import { DonationType } from '../../types';

const ProfileForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  // Organization details
  const [name, setName] = useState<string>(user?.name || '');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [website, setWebsite] = useState<string>('');
  const [acceptsEvents, setAcceptsEvents] = useState<boolean>(true);
  
  // Donation needs
  const [donationNeeds, setDonationNeeds] = useState<
    Array<{ type: DonationType; description: string; priority: number }>
  >([
    { type: 'food', description: '', priority: 1 }
  ]);
  
  const handleAddDonationNeed = () => {
    setDonationNeeds([...donationNeeds, { type: 'food', description: '', priority: 1 }]);
  };
  
  const handleRemoveDonationNeed = (index: number) => {
    const newNeeds = [...donationNeeds];
    newNeeds.splice(index, 1);
    setDonationNeeds(newNeeds);
  };
  
  const handleDonationNeedChange = (
    index: number,
    field: 'type' | 'description' | 'priority',
    value: string | number
  ) => {
    const newNeeds = [...donationNeeds];
    newNeeds[index] = { ...newNeeds[index], [field]: value };
    setDonationNeeds(newNeeds);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/recipient/dashboard');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/recipient/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Organization Profile</h1>
        
        {isSubmitted ? (
          <Card>
            <CardContent className="py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Profile updated successfully!</h3>
              <p className="mt-2 text-gray-600">
                Your organization profile has been updated. You'll be redirected to the dashboard shortly.
              </p>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card className="mb-8">
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Basic Information</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name*
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description*
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Provide a detailed description of your organization, its mission, and the work you do."
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address*
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number*
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address*
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Full street address with city, state, and PIN code"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="https://www.example.org"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="events"
                        name="events"
                        type="checkbox"
                        checked={acceptsEvents}
                        onChange={(e) => setAcceptsEvents(e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="events" className="font-medium text-gray-700">
                        Accept Special Occasion Events
                      </label>
                      <p className="text-gray-500">
                        Allow donors to celebrate special occasions (birthdays, anniversaries, etc.) at your facility.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Donation Needs</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Specify what types of donations your organization currently needs.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {donationNeeds.map((need, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-900">Donation Need #{index + 1}</h3>
                        
                        {donationNeeds.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDonationNeed(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Donation Type*
                          </label>
                          <select
                            value={need.type}
                            onChange={(e) => handleDonationNeedChange(index, 'type', e.target.value as DonationType)}
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
                            Priority Level*
                          </label>
                          <select
                            value={need.priority}
                            onChange={(e) => handleDonationNeedChange(index, 'priority', parseInt(e.target.value))}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                            required
                          >
                            <option value={1}>Low Priority</option>
                            <option value={2}>Medium Priority</option>
                            <option value={3}>High Priority (Urgent)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description*
                        </label>
                        <textarea
                          value={need.description}
                          onChange={(e) => handleDonationNeedChange(index, 'description', e.target.value)}
                          rows={2}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Describe what specific items are needed and how they will be used."
                          required
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddDonationNeed}
                      className="w-full"
                    >
                      + Add Another Donation Need
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Verification Documents</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Please provide documents to verify your organization's legitimacy.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Certificate*
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="registration-certificate"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="registration-certificate"
                              name="registration-certificate"
                              type="file"
                              className="sr-only"
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Exemption Certificate (if applicable)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="tax-exemption"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="tax-exemption"
                              name="tax-exemption"
                              type="file"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Verification Note</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Your organization will need to be verified before receiving donations. This process typically takes 1-2 business days after submission.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;