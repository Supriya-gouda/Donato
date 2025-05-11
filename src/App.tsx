import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DonorDashboard from './pages/donor/DonorDashboard';
import RecipientDashboard from './pages/recipient/RecipientDashboard';
import OrganizationDetails from './pages/donor/OrganizationDetails';
import DonationForm from './pages/donor/DonationForm';
import EventRegistration from './pages/donor/EventRegistration';
import Leaderboard from './pages/donor/Leaderboard';
import Certificate from './pages/donor/Certificate';
import ProfileForm from './pages/recipient/ProfileForm';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-gray-50">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route 
                  path="/donor/dashboard" 
                  element={
                    <ProtectedRoute userType="donor">
                      <DonorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/organization/:id" 
                  element={
                    <ProtectedRoute userType="donor">
                      <OrganizationDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/donate/:id" 
                  element={
                    <ProtectedRoute userType="donor">
                      <DonationForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/event/:id" 
                  element={
                    <ProtectedRoute userType="donor">
                      <EventRegistration />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/leaderboard" 
                  element={
                    <ProtectedRoute userType="donor">
                      <Leaderboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/certificate/:id" 
                  element={
                    <ProtectedRoute userType="donor">
                      <Certificate />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/recipient/dashboard" 
                  element={
                    <ProtectedRoute userType="recipient">
                      <RecipientDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/recipient/profile" 
                  element={
                    <ProtectedRoute userType="recipient">
                      <ProfileForm />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;