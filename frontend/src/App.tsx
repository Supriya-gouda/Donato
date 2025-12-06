import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import OrganizationDetails from "./pages/user/OrganizationDetails";
import Donate from "./pages/user/Donate";
import Leaderboard from "./pages/user/Leaderboard";
import OrgLogin from "./pages/org/OrgLogin";
import OrgSignup from "./pages/org/OrgSignup";
import OrgDashboard from "./pages/org/OrgDashboard";
import OrgDonationDetail from "./pages/org/OrgDonationDetail";
import OrgProfile from "./pages/org/OrgProfile";

const queryClient = new QueryClient();

// Protected route wrapper for users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Protected route wrapper for organizations
const OrgProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isOrgAuthenticated } = useAuth();
  if (!isOrgAuthenticated) {
    return <Navigate to="/org/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* User Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/org/:orgId" element={<ProtectedRoute><OrganizationDetails /></ProtectedRoute>} />
      <Route path="/donate/:orgId" element={<ProtectedRoute><Donate /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      
      {/* Organization Routes */}
      <Route path="/org/login" element={<OrgLogin />} />
      <Route path="/org/signup" element={<OrgSignup />} />
      <Route path="/org/dashboard" element={<OrgProtectedRoute><OrgDashboard /></OrgProtectedRoute>} />
      <Route path="/org/donations/:donationId" element={<OrgProtectedRoute><OrgDonationDetail /></OrgProtectedRoute>} />
      <Route path="/org/profile" element={<OrgProtectedRoute><OrgProfile /></OrgProtectedRoute>} />
      
      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
