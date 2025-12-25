import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';

// --- PAGE IMPORTS ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostItem from './pages/PostItem';
import Dashboard from './pages/Dashboard';
import MyRentals from './pages/MyRentals';
import Messages from './pages/Messages';
import DeliveryDashboard from './pages/DeliveryDashboard';
import SupportDashboard from './pages/SupportDashboard';

/**
 * ProtectedRoute Component
 * 1. Checks if a user is logged in.
 * 2. Checks if the user has the required Role (Owner, Renter, etc.)
 */
const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useContext(AuthContext);

  // Show a loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Redirect to Login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect to Home if user role doesn't match the requirement
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
};

/**
 * Main Application Layout
 */
function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans antialiased text-gray-900">
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* OWNER ONLY ROUTES */}
            <Route 
              path="/post-item" 
              element={
                <ProtectedRoute roleRequired="owner">
                  <PostItem />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute roleRequired="owner">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* RENTER ONLY ROUTES */}
            <Route 
              path="/my-rentals" 
              element={
                <ProtectedRoute roleRequired="renter">
                  <MyRentals />
                </ProtectedRoute>
              } 
            />

            {/* DELIVERY AGENT ONLY ROUTES */}
            <Route 
              path="/delivery-dashboard" 
              element={
                <ProtectedRoute roleRequired="delivery">
                  <DeliveryDashboard />
                </ProtectedRoute>
              } 
            />

            {/* SUPPORT STAFF ONLY ROUTES */}
            <Route 
              path="/support-dashboard" 
              element={
                <ProtectedRoute roleRequired="support">
                  <SupportDashboard />
                </ProtectedRoute>
              } 
            />

            {/* SHARED AUTHENTICATED ROUTES (All logged-in users) */}
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />

            {/* Global Catch-all: Redirect unknown URLs to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-3">
             <div className="w-6 h-6 bg-green-600 rounded-full"></div>
             <span className="font-extrabold text-gray-800 tracking-tight">Rental Marketplace</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 SMU Computer Science Senior Project. 
          </p>
          <p className="text-gray-300 text-xs mt-1">
            Developed by: Abemelek, Yezid, Robel, and Dawit.
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Root Component wrapped in Auth and Router
 */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}