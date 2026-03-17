import React, { useEffect, useState } from 'react';
import { getFlights, bookFlight } from '../services/api';

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ from: '', to: '' });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingData, setBookingData] = useState({
    seatClass: 'economy',
    seats: 1,
    passengers: [{
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      passportNumber: '',
      nationality: ''
    }],
    specialRequests: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async (query = {}) => {
    try {
      const response = await getFlights(query);
      setFlights(response.data);
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError('Failed to load flights');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setLoading(true);
    fetchFlights(filters);
  };

  const handleBookNow = (flight) => {
    setSelectedFlight(flight);
    setBookingData({
      seatClass: 'economy',
      seats: 1,
      passengers: [{
        title: 'Mr',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        passportNumber: '',
        nationality: ''
      }],
      specialRequests: ''
    });
    setShowBookingModal(true);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    if (name === 'seats') {
      const seats = parseInt(value);
      setBookingData(prev => ({
        ...prev,
        [name]: seats,
        passengers: Array(seats).fill().map((_, i) => 
          prev.passengers[i] || {
            title: 'Mr',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            passportNumber: '',
            nationality: ''
          }
        )
      }));
    } else {
      setBookingData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePassengerChange = (index, field, value) => {
    setBookingData(prev => ({
      ...prev,
      passengers: prev.passengers.map((passenger, i) => 
        i === index ? { ...passenger, [field]: value } : passenger
      )
    }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!selectedFlight) return;

    // Validate passengers
    for (let i = 0; i < bookingData.seats; i++) {
      const passenger = bookingData.passengers[i];
      if (!passenger.firstName || !passenger.lastName || !passenger.dateOfBirth || 
          !passenger.passportNumber || !passenger.nationality) {
        alert(`Please fill all details for passenger ${i + 1}`);
        return;
      }
    }

    setBookingLoading(true);
    try {
      const bookingPayload = {
        flightId: selectedFlight._id,
        passengers: bookingData.passengers.slice(0, bookingData.seats),
        seatClass: bookingData.seatClass,
        seats: bookingData.seats,
        specialRequests: bookingData.specialRequests
      };

      await bookFlight(bookingPayload);
      alert('Flight booking submitted successfully! Waiting for admin confirmation.');
      setShowBookingModal(false);
      setSelectedFlight(null);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to book flight. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center text-2xl">Loading flights...</div>
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
        <h1 className="text-5xl font-bold text-blue-600 mb-4">Flights</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Browse flights and schedules. Use filters to search for your next trip.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Filter Flights</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <input
              name="from"
              value={filters.from}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Departure city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              name="to"
              value={filters.to}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Arrival city"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Search Flights
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {flights.map(flight => (
          <div key={flight._id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{flight.airline} - {flight.flightNumber}</h3>
                <p className="text-gray-600 text-sm">{flight.status.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">₹{flight.seats.economy.price}</p>
                <p className="text-xs text-gray-500">from Economy</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Depart</p>
                <p className="font-medium">{flight.departure.city} ({flight.departure.airport})</p>
                <p className="text-sm text-gray-500">{new Date(flight.departure.date).toLocaleDateString()} {flight.departure.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Arrive</p>
                <p className="font-medium">{flight.arrival.city} ({flight.arrival.airport})</p>
                <p className="text-sm text-gray-500">{new Date(flight.arrival.date).toLocaleDateString()} {flight.arrival.time}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Duration: {flight.duration}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">Aircraft: {flight.aircraft}</span>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => handleBookNow(flight)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Book {selectedFlight.airline} - {selectedFlight.flightNumber}</h2>
            <form onSubmit={handleSubmitBooking}>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seat Class</label>
                    <select
                      name="seatClass"
                      value={bookingData.seatClass}
                      onChange={handleBookingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="economy">Economy - ₹{selectedFlight.seats.economy.price}</option>
                      <option value="business">Business - ₹{selectedFlight.seats.business.price}</option>
                      <option value="first">First Class - ₹{selectedFlight.seats.first.price}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Seats</label>
                    <select
                      name="seats"
                      value={bookingData.seats}
                      onChange={handleBookingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Passenger Details</h3>
                  {bookingData.passengers.slice(0, bookingData.seats).map((passenger, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-3">Passenger {index + 1}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <select
                            value={passenger.title}
                            onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Dr">Dr</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            value={passenger.firstName}
                            onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={passenger.lastName}
                            onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <input
                            type="date"
                            value={passenger.dateOfBirth}
                            onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                          <input
                            type="text"
                            value={passenger.passportNumber}
                            onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                          <input
                            type="text"
                            value={passenger.nationality}
                            onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleBookingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
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
