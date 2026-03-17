import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFlights, bookFlight } from '../services/api';

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
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

  // ✅ FIXED HERE
  const queryString = searchParams.toString();

  useEffect(() => {
    const to = searchParams.get('to') || '';
    const from = searchParams.get('from') || '';

    setFilters({ from, to });

    const query = {};
    if (to) query.to = to;
    if (from) query.from = from;

    fetchFlights(query);
  }, [queryString]);

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
      alert('Flight booking submitted successfully!');
      setShowBookingModal(false);
      setSelectedFlight(null);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to book flight.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="text-center text-2xl py-10">Loading flights...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Flights</h1>

      <div className="mb-6">
        <input name="from" value={filters.from} onChange={handleFilterChange} placeholder="From" />
        <input name="to" value={filters.to} onChange={handleFilterChange} placeholder="To" />
        <button onClick={handleSearch}>Search</button>
      </div>

      {flights.map(flight => (
        <div key={flight._id}>
          <h3>{flight.airline}</h3>
          <button onClick={() => handleBookNow(flight)}>Book</button>
        </div>
      ))}
    </div>
  );
}