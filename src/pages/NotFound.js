import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* 404 Illustration */}
            <div className="mx-auto w-32 h-32 mb-8">
              <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5m.5-4a7.963 7.963 0 015 2.5m-5 4a7.963 7.963 0 015-2.5M12 4.5c-2.34 0-4.29.98-5.5 2.5m.5 4a7.963 7.963 0 015-2.5" />
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>

            {/* Navigation Links */}
            <div className="space-y-4">
              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Go to Homepage
              </Link>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/hotels"
                  className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Browse Hotels
                </Link>
                <Link
                  to="/flights"
                  className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Search Flights
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/visa"
                  className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Visa Services
                </Link>
                <Link
                  to="/dashboard"
                  className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  My Dashboard
                </Link>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-sm text-gray-500">
              <p>Need help? Contact our support team or use the chatbot in the bottom-right corner.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}