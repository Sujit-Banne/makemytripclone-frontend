import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserHotelBookings,
  getUserFlightBookings,
  getUserVisaApplications,
  cancelHotelBooking,
  cancelFlightBooking
} from '../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState({
    hotels: [],
    flights: [],
    visas: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllBookings();
  }, [token, navigate]);

  const fetchAllBookings = async () => {
    try {
      const [hotelResponse, flightResponse, visaResponse] = await Promise.all([
        getUserHotelBookings(),
        getUserFlightBookings(),
        getUserVisaApplications()
      ]);

      setBookings({
        hotels: hotelResponse.data,
        flights: flightResponse.data,
        visas: visaResponse.data
      });
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelHotelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this hotel booking?')) return;

    try {
      await cancelHotelBooking(bookingId);
      await fetchAllBookings(); // Refresh data
      alert('Hotel booking cancelled successfully');
    } catch (err) {
      alert('Failed to cancel booking');
      console.error(err);
    }
  };

  const handleCancelFlightBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this flight booking?')) return;

    try {
      await cancelFlightBooking(bookingId);
      await fetchAllBookings(); // Refresh data
      alert('Flight booking cancelled successfully');
    } catch (err) {
      alert('Failed to cancel booking');
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'approved':
        return '✅';
      case 'pending':
        return '⏳';
      case 'cancelled':
      case 'rejected':
        return '❌';
      case 'completed':
        return '🏁';
      default:
        return '📋';
    }
  };

  const allBookings = [
    ...bookings.hotels.map(booking => ({ ...booking, type: 'hotel' })),
    ...bookings.flights.map(booking => ({ ...booking, type: 'flight' })),
    ...bookings.visas.map(booking => ({ ...booking, type: 'visa' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredBookings = activeTab === 'all'
    ? allBookings
    : allBookings.filter(booking => booking.type === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
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
              <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
              <p className="text-orange-100">View and manage all your travel bookings</p>
            </div>
            <div className="bg-white text-orange-500 px-4 py-2 rounded-full font-semibold text-sm">
              {allBookings.length} Total Bookings
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {[
              { key: 'all', label: 'All Bookings', count: allBookings.length },
              { key: 'hotel', label: 'Hotels', count: bookings.hotels.length },
              { key: 'flight', label: 'Flights', count: bookings.flights.length },
              { key: 'visa', label: 'Visas', count: bookings.visas.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'all'
                ? "You haven't made any bookings yet."
                : `You don't have any ${activeTab} bookings yet.`
              }
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/hotels')}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-semibold"
              >
                Book a Hotel
              </button>
              <button
                onClick={() => navigate('/flights')}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold"
              >
                Book a Flight
              </button>
              <button
                onClick={() => navigate('/visa')}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold"
              >
                Apply for Visa
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map(booking => (
              <div key={`${booking.type}-${booking._id}`} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${
                        booking.type === 'hotel' ? 'bg-green-500' :
                        booking.type === 'flight' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}></div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.type === 'hotel' && booking.hotel?.name}
                        {booking.type === 'flight' && `${booking.flight?.airline} ${booking.flight?.flightNumber}`}
                        {booking.type === 'visa' && `${booking.visa?.country} ${booking.visa?.visaType}`}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)} {booking.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      {booking.type === 'hotel' && (
                        <>
                          <div>
                            <span className="font-medium">Check-in:</span> {new Date(booking.checkInDate || booking.checkIn).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Check-out:</span> {new Date(booking.checkOutDate || booking.checkOut).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Guests:</span> {booking.guests ? `${booking.guests.adults || 0} adults${booking.guests.children ? `, ${booking.guests.children} children` : ''}` : 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Room Type:</span> {booking.roomType}
                          </div>
                        </>
                      )}

                      {booking.type === 'flight' && (
                        <>
                          <div>
                            <span className="font-medium">From:</span> {booking.flight?.departure?.city} ({booking.flight?.departure?.airport})
                          </div>
                          <div>
                            <span className="font-medium">To:</span> {booking.flight?.arrival?.city} ({booking.flight?.arrival?.airport})
                          </div>
                          <div>
                            <span className="font-medium">Departure:</span> {new Date(booking.flight?.departure?.date).toLocaleDateString()} at {booking.flight?.departure?.time}
                          </div>
                          <div>
                            <span className="font-medium">Class:</span> {booking.seatClass}
                          </div>
                          <div>
                            <span className="font-medium">Passengers:</span> {booking.seats}
                          </div>
                        </>
                      )}

                      {booking.type === 'visa' && (
                        <>
                          <div>
                            <span className="font-medium">Country:</span> {booking.visa?.country}
                          </div>
                          <div>
                            <span className="font-medium">Visa Type:</span> {booking.visa?.visaType}
                          </div>
                          <div>
                            <span className="font-medium">Processing Time:</span> {booking.visa?.processingTime}
                          </div>
                          <div>
                            <span className="font-medium">Fee:</span> {booking.visa?.fee}
                          </div>
                        </>
                      )}

                      <div>
                        <span className="font-medium">Total Price:</span> ₹{booking.totalPrice || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Booked on:</span> {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => {
                          if (booking.type === 'hotel') {
                            handleCancelHotelBooking(booking._id);
                          } else if (booking.type === 'flight') {
                            handleCancelFlightBooking(booking._id);
                          }
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold text-sm"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}