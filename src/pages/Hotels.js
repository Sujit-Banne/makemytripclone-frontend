import React, { useState, useEffect } from 'react';
import { getHotels, bookHotel } from '../services/api';

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: { adults: 1, children: 0 },
    roomType: 'single',
    specialRequests: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async (filters = {}) => {
    try {
      const response = await getHotels(filters);
      setHotels(response.data);
    } catch (err) {
      setError('Failed to load hotels');
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    fetchHotels(searchFilters);
  };

  const handleBookNow = (hotel) => {
    setSelectedHotel(hotel);
    setBookingData({
      checkInDate: searchFilters.checkIn || '',
      checkOutDate: searchFilters.checkOut || '',
      guests: { adults: searchFilters.guests, children: 0 },
      roomType: 'single',
      specialRequests: ''
    });
    setShowBookingModal(true);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    if (name === 'adults' || name === 'children') {
      setBookingData(prev => ({
        ...prev,
        guests: { ...prev.guests, [name]: parseInt(value) }
      }));
    } else {
      setBookingData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!selectedHotel) return;

    setBookingLoading(true);
    try {
      const bookingPayload = {
        hotelId: selectedHotel._id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        guests: bookingData.guests,
        roomType: bookingData.roomType,
        specialRequests: bookingData.specialRequests
      };

      await bookHotel(bookingPayload);
      alert('Hotel booking submitted successfully! Waiting for admin confirmation.');
      setShowBookingModal(false);
      setSelectedHotel(null);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to book hotel. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center text-2xl">Loading hotels...</div>
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
        <h1 className="text-5xl font-bold text-purple-600 mb-4">Hotels & Accommodations</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find the perfect place to stay. From luxury resorts to budget hotels,
          discover accommodations that match your style and budget.
        </p>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Find Your Perfect Stay</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Enter city or hotel name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchFilters.location}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
            <input
              type="date"
              name="checkIn"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchFilters.checkIn}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
            <input
              type="date"
              name="checkOut"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchFilters.checkOut}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
            <select
              name="guests"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchFilters.guests}
              onChange={handleFilterChange}
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 font-semibold"
        >
          Search Hotels
        </button>
      </div>

      {/* Hotel Listings */}
      <div className="grid md:grid-cols-2 gap-8">
        {hotels.map(hotel => (
          <div key={hotel._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
              <span className="text-6xl">🏨</span>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{hotel.name}</h3>
                <div className="flex items-center">
                  <span className="text-yellow-500">⭐</span>
                  <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-3">{hotel.location}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {hotel.amenities.map((amenity, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-purple-600">₹{hotel.price}</span>
                  <span className="text-gray-500 text-sm">/night</span>
                </div>
                <button 
                  className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
                  onClick={() => handleBookNow(hotel)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hotel Types */}
      <div className="mt-12 bg-purple-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Types of Accommodations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Luxury Hotels</h3>
            <p className="text-gray-600">5-star properties with world-class amenities and service</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏘️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Resorts</h3>
            <p className="text-gray-600">Beach resorts and hill stations with recreational facilities</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏠</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Homestays</h3>
            <p className="text-gray-600">Local homes offering authentic cultural experiences</p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Book {selectedHotel.name}</h2>
            <form onSubmit={handleSubmitBooking}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={bookingData.checkInDate}
                    onChange={handleBookingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={bookingData.checkOutDate}
                    onChange={handleBookingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                    <select
                      name="adults"
                      value={bookingData.guests.adults}
                      onChange={handleBookingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                    <select
                      name="children"
                      value={bookingData.guests.children}
                      onChange={handleBookingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                  <select
                    name="roomType"
                    value={bookingData.roomType}
                    onChange={handleBookingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                    <option value="deluxe">Deluxe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleBookingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    placeholder="Any special requests..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
