import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Clock, ArrowLeft, Calendar, Award, Star, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/shared/Button';
import Card, { CardContent, CardHeader } from '../../components/shared/Card';
import { getOrganizationById } from '../../utils/mockData';

const OrganizationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const organization = getOrganizationById(id || '');
  const [selectedGalleryType, setSelectedGalleryType] = useState<'all' | 'donation' | 'event' | 'facility'>('all');

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

  const { name, description, address, image, phone, email, website, donationNeeds, priorityLevel, distance, donationCount, events } = organization;

  const getPriorityBadgeColor = (level: number) => {
    switch (level) {
      case 3: return 'bg-red-100 text-red-800 border-red-200';
      case 2: return 'bg-amber-100 text-amber-800 border-amber-200';
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (level: number) => {
    switch (level) {
      case 3: return 'High Priority';
      case 2: return 'Medium Priority';
      case 1: return 'Low Priority';
      default: return 'Standard';
    }
  };

  const filteredGallery = selectedGalleryType === 'all' 
    ? organization.photoGallery 
    : organization.photoGallery.filter(photo => photo.type === selectedGalleryType);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/donor/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">{name}</h1>
            <div className="flex items-center text-white/90 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{address}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadgeColor(priorityLevel)}`}>
                {getPriorityLabel(priorityLevel)}
              </span>
              <span className="text-white flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {distance.toFixed(1)} km away
              </span>
              <span className="text-white flex items-center">
                <Award className="h-4 w-4 mr-1" />
                {donationCount} donations
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Donation Needs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {donationNeeds.map((need) => (
                    <Card key={need.id} className="border border-gray-200">
                      <CardContent>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900 capitalize">{need.type}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            need.priority === 3 ? 'bg-red-100 text-red-800' :
                            need.priority === 2 ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {need.priority === 3 ? 'Urgent' : need.priority === 2 ? 'Needed' : 'Helpful'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-2">{need.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/donate/${id}`} className="flex-1">
                    <Button variant="primary" fullWidth>
                      Donate Now
                    </Button>
                  </Link>
                  {events && (
                    <Link to={`/event/${id}`} className="flex-1">
                      <Button variant="outline" fullWidth>
                        <Calendar className="mr-2 h-4 w-4" />
                        Plan an Event
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Photo Gallery Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Photo Gallery</h2>
                
                {/* Gallery Filter */}
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setSelectedGalleryType('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedGalleryType === 'all'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All Photos
                  </button>
                  <button
                    onClick={() => setSelectedGalleryType('donation')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedGalleryType === 'donation'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Donations
                  </button>
                  <button
                    onClick={() => setSelectedGalleryType('event')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedGalleryType === 'event'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Events
                  </button>
                  <button
                    onClick={() => setSelectedGalleryType('facility')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedGalleryType === 'facility'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Facilities
                  </button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredGallery.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                        <img
                          src={photo.imageUrl}
                          alt={photo.caption}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-sm font-medium">{photo.caption}</p>
                            <p className="text-xs mt-1">{new Date(photo.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredGallery.length === 0 && (
                  <div className="text-center py-8">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No photos found</h3>
                    <p className="mt-1 text-sm text-gray-500">There are no photos in this category.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Card className="mb-6">
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Contact Information</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a href={`tel:${phone}`} className="text-gray-900 hover:text-purple-600">{phone}</a>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a href={`mailto:${email}`} className="text-gray-900 hover:text-purple-600">{email}</a>
                      </div>
                    </li>
                    {website && (
                      <li className="flex items-start">
                        <Globe className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <a href={website.startsWith('http') ? website : `http://${website}`} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-purple-600">{website}</a>
                        </div>
                      </li>
                    )}
                    <li className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Hours</p>
                        <p className="text-gray-900">Mon-Fri: 9AM-5PM</p>
                        <p className="text-gray-900">Sat-Sun: 10AM-2PM</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Reviews & Ratings</h3>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center">
                    <div className="flex items-center mr-4">
                      <Star className="h-5 w-5 text-amber-400" fill="currentColor" />
                      <Star className="h-5 w-5 text-amber-400" fill="currentColor" />
                      <Star className="h-5 w-5 text-amber-400" fill="currentColor" />
                      <Star className="h-5 w-5 text-amber-400" fill="currentColor" />
                      <Star className="h-5 w-5 text-amber-400" fill="currentColor" />
                    </div>
                    <span className="text-lg font-medium">5.0</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center mb-2">
                        <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Reviewer" className="h-8 w-8 rounded-full mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">Priya Sharma</p>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        The staff is incredibly dedicated and the facilities are well-maintained. My donation was put to excellent use!
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="Reviewer" className="h-8 w-8 rounded-full mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">Rahul Verma</p>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        I celebrated my son's birthday here, and it was a beautiful experience. The children were so happy, and the organization was very accommodating.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;