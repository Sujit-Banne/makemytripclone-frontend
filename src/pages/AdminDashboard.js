import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      // If the user isn't an admin, send them to the main dashboard instead of looping back to login.
      navigate('/dashboard');
      return;
    }
  }, [token, user.role, navigate]);

  const adminFeatures = [
    {
      title: 'Manage Hotels',
      description: 'Add, edit, and manage hotel listings',
      icon: '🏨',
      path: '/admin/hotels',
      color: 'bg-green-500',
      stats: '150+ Hotels'
    },
    {
      title: 'Manage Flights',
      description: 'Add, edit, and manage flight schedules',
      icon: '✈️',
      path: '/admin/flights',
      color: 'bg-blue-500',
      stats: '200+ Flights'
    },
    {
      title: 'Manage Visas',
      description: 'Add, edit, and manage visa information',
      icon: '🛂',
      path: '/admin/visas',
      color: 'bg-pink-500',
      stats: '90+ Visa Types'
    },
    {
      title: 'User Management',
      description: 'View and manage user accounts',
      icon: '👥',
      path: '/admin/users',
      color: 'bg-purple-500',
      stats: '1,250 Users'
    },
    {
      title: 'Hotel Bookings',
      description: 'Review and approve hotel booking requests',
      icon: '🏨',
      path: '/admin/hotel-bookings',
      color: 'bg-green-600',
      stats: 'Pending: 25'
    },
    {
      title: 'Flight Bookings',
      description: 'Review and approve flight booking requests',
      icon: '✈️',
      path: '/admin/flight-bookings',
      color: 'bg-blue-600',
      stats: 'Pending: 18'
    },
    {
      title: 'Visa Applications',
      description: 'Review and approve visa application requests',
      icon: '🛂',
      path: '/admin/visa-applications',
      color: 'bg-pink-600',
      stats: 'Pending: 12'
    },
  ];

  const quickStats = [
    { label: 'Total Bookings', value: '12,450', change: '+12%', icon: '📈' },
    { label: 'Revenue', value: '₹2.4M', change: '+8%', icon: '💰' },
    { label: 'Active Users', value: '8,920', change: '+15%', icon: '👥' },
    { label: 'Satisfaction', value: '4.8/5', change: '+0.2', icon: '⭐' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-orange-100">Manage MakeMyTrip platform operations</p>
            </div>
            <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold text-sm">
              ADMIN PANEL
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-green-600 text-sm font-medium">{stat.change} from last month</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Management Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.path)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 p-6 cursor-pointer"
              >
                <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 mb-3">{feature.description}</p>
                <p className="text-orange-500 font-semibold text-sm">{feature.stats}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <span className="text-green-600">🏨</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">New hotel added: Taj Mahal Palace</p>
                  <p className="text-gray-600 text-sm">2 hours ago</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">Success</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <span className="text-blue-600">✈️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Flight AI-301 schedule updated</p>
                  <p className="text-gray-600 text-sm">4 hours ago</p>
                </div>
              </div>
              <span className="text-blue-600 font-medium">Updated</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <span className="text-purple-600">👤</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">New user registration: John Doe</p>
                  <p className="text-gray-600 text-sm">6 hours ago</p>
                </div>
              </div>
              <span className="text-purple-600 font-medium">New User</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}