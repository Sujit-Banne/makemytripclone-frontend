import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAdminRecentActivities } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchDashboardData();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, [token, user.role, navigate]);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activitiesResponse] = await Promise.all([
        getAdminStats(),
        getAdminRecentActivities()
      ]);
      setStats(statsResponse.data);
      setActivities(activitiesResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminFeatures = [
    {
      title: 'Manage Hotels',
      description: 'Add, edit, and manage hotel listings',
      icon: '🏨',
      path: '/admin/hotels',
      color: 'bg-green-500',
      stats: `${stats?.hotels || 0} Hotels`
    },
    {
      title: 'Manage Flights',
      description: 'Add, edit, and manage flight schedules',
      icon: '✈️',
      path: '/admin/flights',
      color: 'bg-blue-500',
      stats: `${stats?.flights || 0} Flights`
    },
    {
      title: 'Manage Visas',
      description: 'Add, edit, and manage visa information',
      icon: '🛂',
      path: '/admin/visas',
      color: 'bg-pink-500',
      stats: `${stats?.visas || 0} Visa Types`
    },
    {
      title: 'User Management',
      description: 'View and manage user accounts',
      icon: '👥',
      path: '/admin/users',
      color: 'bg-purple-500',
      stats: `${stats?.users || 0} Users`
    },
    {
      title: 'Hotel Bookings',
      description: 'Review and approve hotel booking requests',
      icon: '🏨',
      path: '/admin/hotel-bookings',
      color: 'bg-green-600',
      stats: `Pending: ${stats?.pendingHotelBookings || 0}`
    },
    {
      title: 'Flight Bookings',
      description: 'Review and approve flight booking requests',
      icon: '✈️',
      path: '/admin/flight-bookings',
      color: 'bg-blue-600',
      stats: `Pending: ${stats?.pendingFlightBookings || 0}`
    },
    {
      title: 'Visa Applications',
      description: 'Review and approve visa application requests',
      icon: '🛂',
      path: '/admin/visa-applications',
      color: 'bg-pink-600',
      stats: `Pending: ${stats?.pendingVisaApplications || 0}`
    },
  ];

  const quickStats = [
    { label: 'Total Bookings', value: stats?.totalBookings || 0, change: '+12%', icon: '📈' },
    { label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, change: '+8%', icon: '💰' },
    { label: 'Active Users', value: stats?.users || 0, change: '+15%', icon: '👥' },
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
            <button
              onClick={fetchDashboardData}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading activities...</p>
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const timeAgo = new Date(activity.timestamp).toLocaleString();
                let icon, color, statusText;
                switch (activity.type) {
                  case 'hotel_booking':
                    icon = '🏨';
                    color = 'green';
                    statusText = activity.status;
                    break;
                  case 'flight_booking':
                    icon = '✈️';
                    color = 'blue';
                    statusText = activity.status;
                    break;
                  case 'visa_application':
                    icon = '🛂';
                    color = 'pink';
                    statusText = activity.status;
                    break;
                  case 'user_registration':
                    icon = '👤';
                    color = 'purple';
                    statusText = 'New User';
                    break;
                  default:
                    icon = '📝';
                    color = 'gray';
                    statusText = 'Activity';
                }
                return (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className={`bg-${color}-100 p-2 rounded-lg mr-4`}>
                        <span className={`text-${color}-600`}>{icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{activity.message}</p>
                        <p className="text-gray-600 text-sm">{timeAgo}</p>
                      </div>
                    </div>
                    <span className={`text-${color}-600 font-medium`}>{statusText}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  );
}