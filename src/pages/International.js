import React, { useState, useEffect } from 'react';
import { getHotels, getFlights } from '../services/api';
import { Link } from 'react-router-dom';

export default function International() {
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hotelsResponse, flightsResponse] = await Promise.all([
        getHotels({ category: 'international' }),
        getFlights({ category: 'international' })
      ]);
      setHotels(hotelsResponse.data.slice(0, 6)); // Show first 6 hotels
      setFlights(flightsResponse.data.slice(0, 6)); // Show first 6 flights
    } catch (err) {
      setError('Failed to load travel options');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center text-2xl">Loading international travel options...</div>
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
        <h1 className="text-5xl font-bold text-blue-600 mb-4">International Travel</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover amazing destinations around the world. From European adventures to Asian explorations,
          find your perfect international getaway with our curated selection of hotels and flights.
        </p>
      </div>

      {/* Featured International Hotels */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured International Hotels</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🏨</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                <p className="text-gray-600 mb-2">📍 {hotel.location}</p>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500">⭐</span>
                  <span className="ml-1 text-gray-700">{hotel.rating}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">₹{hotel.price}</span>
                  <Link
                    to="/hotels"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured International Flights */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured International Flights</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {flights.map((flight) => (
            <div key={flight._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">✈️</span>
                  <div>
                    <h3 className="text-lg font-semibold">{flight.airline}</h3>
                    <p className="text-gray-600 text-sm">Flight {flight.flightNumber}</p>
                  </div>
                </div>
                <span className="text-gray-500 text-sm">{flight.aircraft}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-lg font-semibold">{flight.departure?.city}</p>
                  <p className="text-sm text-gray-500">{flight.departure?.country}</p>
                  <p className="text-sm text-gray-500">{flight.departure?.time}</p>
                </div>
                <div className="flex-1 mx-4 text-center">
                  <div className="border-t border-dashed border-gray-300 relative">
                    <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-gray-500">
                      {flight.duration}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{flight.arrival?.city}</p>
                  <p className="text-sm text-gray-500">{flight.arrival?.country}</p>
                  <p className="text-sm text-gray-500">{flight.arrival?.time}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Economy from</p>
                  <p className="text-xl font-bold text-green-600">₹{flight.seats?.economy?.price}</p>
                </div>
                <Link
                  to="/flights"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Book Flight
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready for Your International Adventure?</h2>
        <p className="text-xl mb-6 opacity-90">
          Explore thousands of destinations worldwide with MakeMyTrip
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/hotels"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Find Hotels
          </Link>
          <Link
            to="/flights"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Book Flights
          </Link>
          <Link
            to="/visa"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Visa
          </Link>
        </div>
      </div>
    </div>
  );
}
