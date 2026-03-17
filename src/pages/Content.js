import React, { useState, useEffect } from 'react';
import { getContent } from '../services/api';

export default function Content() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await getContent();
      setContent(response.data);
    } catch (err) {
      setError('Failed to load content');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const contentCategories = [
    {
      title: "Travel Guides",
      description: "Comprehensive guides for destinations worldwide",
      icon: "📖",
      items: ["City Guides", "Country Information", "Cultural Insights", "Local Tips"]
    },
    {
      title: "Travel Tips",
      description: "Expert advice for better travel experiences",
      icon: "💡",
      items: ["Packing Lists", "Safety Guidelines", "Budget Tips", "Seasonal Advice"]
    },
    {
      title: "Destination Reviews",
      description: "Real traveler experiences and reviews",
      icon: "⭐",
      items: ["Hotel Reviews", "Restaurant Reviews", "Attraction Reviews", "Experience Sharing"]
    },
    {
      title: "Travel Stories",
      description: "Inspiring stories from fellow travelers",
      icon: "📝",
      items: ["Adventure Stories", "Cultural Experiences", "Solo Travel Tales", "Family Journeys"]
    }
  ];

  const featuredContent = content.filter(item => item.featured).slice(0, 4);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center text-2xl">Loading travel content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-indigo-600 mb-4">Travel Content Hub</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover amazing travel content, guides, tips, and stories from our community.
          Get inspired for your next adventure!
        </p>
      </div>

      {/* Content Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {contentCategories.map((category, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <ul className="space-y-1">
              {category.items.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-500 flex items-center">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Featured Content */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Content</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {featuredContent.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-4xl">{item.category === 'guide' ? '📖' : item.category === 'story' ? '📝' : item.category === 'review' ? '⭐' : '💡'}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-3">By {item.author}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                  <span>📖 {item.reads || 0} reads</span>
                  <span>❤️ {item.likes || 0} likes</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">
                    {item.category}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {item.tags?.[0] || 'Travel'}
                  </span>
                </div>
                <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Creation */}
      <div className="bg-indigo-50 rounded-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-center mb-6">Share Your Travel Stories</h2>
        <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
          Have an amazing travel experience? Share it with our community!
          Write articles, post reviews, or create travel guides.
        </p>
        <div className="text-center">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold mr-4">
            Write an Article
          </button>
          <button className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 font-semibold">
            Share a Review
          </button>
        </div>
      </div>

      {/* Content Stats */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Community Stats</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">{content.length}+</div>
            <div className="text-gray-600">Travel Articles</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">{content.filter(item => item.category === 'review').length}+</div>
            <div className="text-gray-600">Destination Reviews</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">5,200+</div>
            <div className="text-gray-600">Community Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">{content.reduce((sum, item) => sum + (item.reads || 0), 0)}+ </div>
            <div className="text-gray-600">Total Reads</div>
          </div>
        </div>
      </div>
    </div>
  );
}
