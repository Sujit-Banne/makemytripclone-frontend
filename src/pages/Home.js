import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const popularDestinations = [
    { name: "Dubai", image: "🏙️", price: "₹45,000" },
    { name: "Singapore", image: "🌆", price: "₹35,000" },
    { name: "Bali", image: "🏝️", price: "₹25,000" },
    { name: "Paris", image: "🗼", price: "₹55,000" },
    { name: "London", image: "🌉", price: "₹65,000" },
    { name: "Tokyo", image: "🏯", price: "₹75,000" }
  ];

  const services = [
    {
      title: "Flights",
      description: "Book domestic & international flights",
      icon: "✈️",
      path: "/international",
      color: "bg-blue-500"
    },
    {
      title: "Hotels",
      description: "Find perfect stays worldwide",
      icon: "🏨",
      path: "/hotels",
      color: "bg-green-500"
    },
    {
      title: "Visa",
      description: "Hassle-free visa processing",
      icon: "🛂",
      path: "/visa",
      color: "bg-purple-500"
    },
    {
      title: "Packages",
      description: "Complete travel packages",
      icon: "🎒",
      path: "/domestic",
      color: "bg-orange-500"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MakeMyTrip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              India's Leading Travel Booking Site
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Book Flights, Hotels, Visa & Holiday Packages at Lowest Prices
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  />
                </div>
                <div>
                  <button className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What would you like to book?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.path}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 p-6 text-center"
            >
              <div className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Popular International Destinations</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-4xl mb-3">{destination.image}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{destination.name}</h3>
                <p className="text-orange-500 font-medium">From {destination.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose MakeMyTrip?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lowest Prices</h3>
              <p className="text-gray-600">Guaranteed lowest prices on flights, hotels & packages</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">100% secure payments & verified travel partners</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📞</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round the clock customer support for all your queries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Posts */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Travel Stories from Our Community</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg mb-4">No travel stories yet</p>
            <Link to="/register" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
              Share Your First Story!
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 6).map((post) => (
              <div key={post._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h3>
                <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>By {post.userId.name}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {posts.length > 6 && (
          <div className="text-center mt-8">
            <Link to="/dashboard" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              View All Stories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
