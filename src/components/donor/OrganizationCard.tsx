import React from 'react';
import { MapPin, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card, { CardContent, CardFooter } from '../shared/Card';
import { Organization } from '../../types';
import Button from '../shared/Button';

interface OrganizationCardProps {
  organization: Organization;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization }) => {
  const { id, name, image, description, distance, priorityLevel, address, donationCount } = organization;

  // Function to determine the priority badge color
  const getPriorityBadgeColor = (level: number) => {
    switch (level) {
      case 3: return 'bg-red-100 text-red-800 border-red-200';
      case 2: return 'bg-amber-100 text-amber-800 border-amber-200';
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to render the priority label
  const getPriorityLabel = (level: number) => {
    switch (level) {
      case 3: return 'High Priority';
      case 2: return 'Medium Priority';
      case 1: return 'Low Priority';
      default: return 'Standard';
    }
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadgeColor(priorityLevel)}`}>
            {getPriorityLabel(priorityLevel)}
          </span>
        </div>
      </div>
      
      <CardContent>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
            <span className="ml-1 text-sm font-medium text-gray-700">{(4 + Math.random()).toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{description}</p>
        
        <div className="flex items-center text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{address}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">{distance.toFixed(1)} km away</span>
          <div className="flex items-center text-purple-600">
            <Award className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{donationCount} donations</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <Link 
          to={`/organization/${id}`}
          className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
        >
          View Details
        </Link>
        <Link to={`/donate/${id}`}>
          <Button variant="primary" size="sm">
            Donate Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default OrganizationCard;