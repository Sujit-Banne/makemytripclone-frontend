import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../services/api';

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getAdminStats();
        setStats(response.data);
      } catch (err) {
        setError('Unable to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center text-2xl">Loading analytics...</div>
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-700">Admin Analytics</h1>
        <p className="text-gray-600">Summary of key platform metrics.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Hotels</h2>
          <p className="text-4xl font-bold text-green-600">{stats.hotels}</p>
          <p className="text-gray-600">Total hotel listings</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Flights</h2>
          <p className="text-4xl font-bold text-blue-600">{stats.flights}</p>
          <p className="text-gray-600">Total flight routes</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Visas</h2>
          <p className="text-4xl font-bold text-pink-600">{stats.visas}</p>
          <p className="text-gray-600">Total visa options</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-4xl font-bold text-purple-600">{stats.users}</p>
          <p className="text-gray-600">Regular users</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Admins</h2>
          <p className="text-4xl font-bold text-orange-600">{stats.admins}</p>
          <p className="text-gray-600">Admin accounts</p>
        </div>
      </div>

      <div className="mt-10 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Notes</h2>
        <p className="text-gray-600">
          Data is sourced from the current in-memory dataset. It will reset when the backend server restarts.
        </p>
      </div>
    </div>
  );
}
