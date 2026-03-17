import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import { getUserPosts } from '../services/api';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPosts();
  }, [token, navigate]);

  const fetchPosts = async () => {
    try {
      const response = await getUserPosts();
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    { label: 'Total Posts', value: posts.length, icon: '📝', color: 'bg-blue-500' },
    { label: 'Travel Stories', value: posts.filter(p => p.content.includes('travel')).length, icon: '✈️', color: 'bg-green-500' },
    { label: 'Community Likes', value: posts.reduce((sum, p) => sum + (p.likes || 0), 0), icon: '❤️', color: 'bg-red-500' },
    { label: 'Days Active', value: Math.floor((Date.now() - new Date(user.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)), icon: '📅', color: 'bg-purple-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
              <p className="text-orange-100">Manage your travel experiences and bookings</p>
            </div>
            {user.role === 'admin' && (
              <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold text-sm">
                ADMIN ACCESS
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Panel (if admin) */}
        {user.role === 'admin' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Admin Panel</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/admin/hotels')}
                className="bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                🏨 Manage Hotels
              </button>
              <button
                onClick={() => navigate('/admin/flights')}
                className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                ✈️ Manage Flights
              </button>
              <button
                onClick={() => navigate('/admin/stats')}
                className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                📊 View Statistics
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📝 My Posts
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'bookings'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🎫 My Bookings
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                👤 Profile
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'posts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Travel Stories</h2>
                  <button
                    onClick={() => document.querySelector('.post-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    ✏️ Write New Story
                  </button>
                </div>
                <PostForm onPostCreated={fetchPosts} />
                <div className="mt-8">
                  <PostList
                    posts={posts}
                    onPostDeleted={fetchPosts}
                    onPostUpdated={fetchPosts}
                  />
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎫</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">My Bookings</h3>
                <p className="text-gray-600 mb-4">Your flight and hotel bookings will appear here</p>
                <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                  Book Now
                </button>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
