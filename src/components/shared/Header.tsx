import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, LogOut, Menu, User, X } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, userType } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (userType === 'donor') return '/donor/dashboard';
    if (userType === 'recipient') return '/recipient/dashboard';
    return '/';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <Heart className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wide">
              DONATO
            </span>
            <span className="text-xs text-gray-500 tracking-wider">Making Giving Beautiful</span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors">
            Home
          </Link>
          {user ? (
            <>
              <Link 
                to={getDashboardLink()} 
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Dashboard
              </Link>
              {userType === 'donor' && (
                <Link 
                  to="/leaderboard" 
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Leaderboard
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700 hover:text-purple-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white pt-16">
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-6">
              <Link 
                to="/" 
                className="text-lg font-medium text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {user ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="text-lg font-medium text-gray-700 hover:text-purple-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {userType === 'donor' && (
                    <Link 
                      to="/leaderboard" 
                      className="text-lg font-medium text-gray-700 hover:text-purple-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Leaderboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-lg font-medium text-gray-700 hover:text-purple-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-lg font-medium text-gray-700 hover:text-purple-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;