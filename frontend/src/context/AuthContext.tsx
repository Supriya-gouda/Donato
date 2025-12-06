import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Organization } from "@/types";

interface AuthState {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isOrgAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
  loginOrg: (org: Organization, token: string) => void;
  logoutOrg: () => void;
  updateUser: (user: User) => void;
  updateOrg: (org: Organization) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const savedUser = localStorage.getItem("user");
    const savedOrg = localStorage.getItem("organization");
    const savedToken = localStorage.getItem("token");
    const savedOrgToken = localStorage.getItem("org_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    if (savedOrg && savedOrgToken) {
      try {
        setOrganization(JSON.parse(savedOrg));
      } catch (error) {
        console.error('Error parsing saved organization:', error);
        localStorage.removeItem("organization");
        localStorage.removeItem("org_token");
      }
    }
    
    setLoading(false);
  }, []);

  const loginUser = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const loginOrg = (orgData: Organization, token: string) => {
    setOrganization(orgData);
    localStorage.setItem("organization", JSON.stringify(orgData));
    localStorage.setItem("org_token", token);
  };

  const logoutOrg = () => {
    setOrganization(null);
    localStorage.removeItem("organization");
    localStorage.removeItem("org_token");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateOrg = (updatedOrg: Organization) => {
    setOrganization(updatedOrg);
    localStorage.setItem("organization", JSON.stringify(updatedOrg));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isAuthenticated: !!user,
        isOrgAuthenticated: !!organization,
        loading,
        loginUser,
        logoutUser,
        loginOrg,
        logoutOrg,
        updateUser,
        updateOrg,
      }}
    >
      {loading ? (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          backgroundColor: 'hsl(270, 20%, 98%)'
        }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid hsl(270, 20%, 90%)',
            borderTop: '4px solid hsl(262, 83%, 58%)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
