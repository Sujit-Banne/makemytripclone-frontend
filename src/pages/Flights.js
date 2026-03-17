/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFlights, bookFlight } from '../services/api';

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ from: '', to: '' });

  // (kept but not used fully → eslint disabled)
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingData, setBookingData] = useState({});
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const to = searchParams.get('to') || '';
    // const from = searchParams.get('from') || '';

    setFilters({ from, to });

    fetchFlights({ from, to });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

  if (loading) {
    return <div className="text-center text-2xl py-10">Loading flights...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Flights</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <input
          name="from"
          value={filters.from}
          onChange={handleFilterChange}
          placeholder="From"
          className="border p-2"
        />
        <input
          name="to"
          value={filters.to}
          onChange={handleFilterChange}
          placeholder="To"
          className="border p-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Search
        </button>
      </div>

      {/* Flights List */}
      {flights.length === 0 ? (
        <p className="text-center">No flights found</p>
      ) : (
        flights.map(flight => (
          <div key={flight._id} className="border p-4 mb-4">
            <h3 className="font-bold">
              {flight.airline} - {flight.flightNumber}
            </h3>
            <p>{flight.departure.city} → {flight.arrival.city}</p>
            <p>₹{flight.seats?.economy?.price}</p>
          </div>
        ))
      )}
    </div>
  );
}