import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-green-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 uppercase">
                Start<span className="text-green-600">Rent</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-5">
            <Link to="/" className="text-sm font-bold text-gray-600 hover:text-green-600 transition-colors">
              Browse
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4 sm:gap-6">
                
                {/* OWNER LINKS */}
                {user.role === 'owner' && (
                  <>
                    <Link to="/post-item" className="hidden sm:block text-sm font-bold text-gray-600 hover:text-green-600">
                      Post Item
                    </Link>
                    <Link to="/dashboard" className="text-sm font-bold text-gray-600 hover:text-green-600">
                      Dashboard
                    </Link>
                  </>
                )}

                {/* RENTER LINKS */}
                {user.role === 'renter' && (
                  <Link to="/my-rentals" className="text-sm font-bold text-gray-600 hover:text-green-600">
                    My Rentals
                  </Link>
                )}

                {/* MESSAGES ICON (Available to all logged-in users) */}
                <Link 
                  to="/messages" 
                  className="p-2 text-gray-500 hover:bg-green-50 hover:text-green-600 rounded-full transition-all relative"
                  title="Messages"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {/* Small green dot for notification simulation */}
                  <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
                </Link>

                <div className="h-6 w-px bg-gray-200"></div>
                
                {/* USER PROFILE & LOGOUT */}
                <div className="flex items-center gap-3">
                  <div className="hidden lg:block text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none">
                      {user.role}
                    </p>
                    <p className="text-sm font-extrabold text-gray-800">@{user.username}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-xs font-black text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors uppercase tracking-wider"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              /* GUEST LINKS */
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-green-600">
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 text-sm font-black text-white bg-green-600 rounded-full hover:bg-green-700 transition-all shadow-lg active:scale-95 shadow-green-100"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}