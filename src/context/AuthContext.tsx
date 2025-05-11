import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType } from '../types';

interface AuthContextType {
  user: User | null;
  userType: UserType | null;
  login: (email: string, password: string, type: UserType) => Promise<void>;
  signup: (userData: Partial<User>, password: string, type: UserType) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType') as UserType | null;
    
    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, type: UserType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For demonstration, we'll simulate a login
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock users for demo purposes
      const mockDonors = [
        { id: 'd1', name: 'John Donor', email: 'donor@example.com', points: 250 },
      ];
      
      const mockRecipients = [
        { id: 'r1', name: 'Charity Organization', email: 'org@example.com', verified: true },
      ];
      
      let foundUser = null;
      
      if (type === 'donor') {
        foundUser = mockDonors.find(d => d.email === email);
      } else {
        foundUser = mockRecipients.find(r => r.email === email);
      }
      
      if (foundUser && password === 'password') { // In a real app, you'd verify the password properly
        setUser(foundUser);
        setUserType(type);
        
        // Store in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(foundUser));
        localStorage.setItem('userType', type);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Partial<User>, password: string, type: UserType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For demonstration, we'll simulate a signup
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user with the provided data
      const newUser = {
        id: `${type[0]}${Math.floor(Math.random() * 1000)}`,
        ...userData,
        ...(type === 'donor' ? { points: 0 } : { verified: false }),
      };
      
      setUser(newUser as User);
      setUserType(type);
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('userType', type);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, signup, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};