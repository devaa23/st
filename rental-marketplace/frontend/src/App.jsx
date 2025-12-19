import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import MyRentals from './pages/MyRentals';
// Page Imports
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostItem from './pages/PostItem';
import Dashboard from './pages/Dashboard';

/**
 * ProtectedRoute Component
 * Redirects to Login if not authenticated.
 * Redirects to Home if the user doesn't have the required role.
 */
const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans antialiased text-gray-900">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Animation Wrapper */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Routes>
            {/* Public Access */}
            <Route path="/delivery-dashboard" element={<ProtectedRoute roleRequired="delivery"><DeliveryDashboard /></ProtectedRoute>} />
<Route path="/support-dashboard" element={<ProtectedRoute roleRequired="support"><SupportDashboard /></ProtectedRoute>} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/register" element={<Register />} />
            <Route 
  path="/my-rentals" 
  element={
    <ProtectedRoute roleRequired="renter">
      <MyRentals />
    </ProtectedRoute>
  } 
/>
            {/* Owner Only Routes */}
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

            {/* Global Redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
             </div>
             <span className="font-extrabold text-gray-800 tracking-tight">Rental Marketplace</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 SMU Computer Science Senior Project.
          </p>
          <p className="text-gray-400 text-xs mt-2 italic">
            Created for SMU Faculty of Informatics - Addis Ababa
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}