import React, { createContext, useContext, useState, useEffect } from 'react';
import { Coordinates } from '../types';

interface LocationContextType {
  userLocation: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  getLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }
      
      // Get the current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      setUserLocation({ latitude, longitude });
      
      // Store location in localStorage for persistence
      localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
    } catch (err) {
      console.error('Error getting location:', err);
      setError(err instanceof Error ? err.message : 'Could not retrieve your location');
      
      // Use a default location for demo purposes (New York City)
      const defaultLocation = { latitude: 40.7128, longitude: -74.0060 };
      setUserLocation(defaultLocation);
      localStorage.setItem('userLocation', JSON.stringify(defaultLocation));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Try to get the stored location first
    const storedLocation = localStorage.getItem('userLocation');
    
    if (storedLocation) {
      setUserLocation(JSON.parse(storedLocation));
    } else {
      // If no stored location, attempt to get the current location
      getLocation();
    }
  }, []);

  return (
    <LocationContext.Provider value={{ userLocation, isLoading, error, getLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};