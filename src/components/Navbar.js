import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white rounded-lg p-2">
              <span className="text-orange-500 font-bold text-xl">MMT</span>
            </div>
            <span className="text-white text-xl font-bold hidden sm:block">MakeMyTrip</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-orange-200 transition-colors font-medium">
              Home
            </Link>
            <Link to="/dashboard" className="text-white hover:text-orange-200 transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/my-bookings" className="text-white hover:text-orange-200 transition-colors font-medium">
              My Bookings
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {token ? (
              <div className="flex items-center space-x-4">
                <div className="text-white">
                  <span className="font-medium">👤 {user?.name}</span>
                  {user?.role === 'admin' && (
                    <span className="ml-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-medium">
                      ADMIN
                    </span>
                  )}
                </div>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-semibold mr-2"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-orange-200 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:text-orange-200 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white hover:text-orange-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="text-white hover:text-orange-200 transition-colors py-2">
              Home
            </Link>
            <Link to="/dashboard" className="text-white hover:text-orange-200 transition-colors py-2">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
