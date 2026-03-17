import React, { useEffect, useState } from 'react';
import { getFlights, createFlight, updateFlight, deleteFlight } from '../services/api';

export default function AdminFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    flightNumber: '',
    airline: '',
    departure: { airport: '', city: '', country: '', date: '', time: '' },
    arrival: { airport: '', city: '', country: '', date: '', time: '' },
    duration: '',
    aircraft: '',
    seats: { 
      economy: { price: '' }, 
      business: { price: '' }, 
      first: { price: '' } 
    }
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await getFlights();
      setFlights(response.data);
    } catch (err) {
      setError('Unable to load flights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('departure.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        departure: { ...prev.departure, [field]: value }
      }));
    } else if (name.startsWith('arrival.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        arrival: { ...prev.arrival, [field]: value }
      }));
    } else if (name === 'economyPrice') {
      setForm(prev => ({
        ...prev,
        seats: { ...prev.seats, economy: { ...prev.seats.economy, price: value } }
      }));
    } else if (name === 'businessPrice') {
      setForm(prev => ({
        ...prev,
        seats: { ...prev.seats, business: { ...prev.seats.business, price: value } }
      }));
    } else if (name === 'firstPrice') {
      setForm(prev => ({
        ...prev,
        seats: { ...prev.seats, first: { ...prev.seats.first, price: value } }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({
      flightNumber: '',
      airline: '',
      departure: { airport: '', city: '', country: '', date: '', time: '' },
      arrival: { airport: '', city: '', country: '', date: '', time: '' },
      duration: '',
      aircraft: '',
      seats: { 
        economy: { price: '' }, 
        business: { price: '' }, 
        first: { price: '' } 
      }
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        departure: {
          ...form.departure,
          date: form.departure.date ? new Date(form.departure.date) : undefined
        },
        arrival: {
          ...form.arrival,
          date: form.arrival.date ? new Date(form.arrival.date) : undefined
        },
        seats: { 
          economy: { total: 150, available: 150, price: Number(form.seats.economy.price) },
          business: { total: 20, available: 20, price: Number(form.seats.business.price) },
          first: { total: 10, available: 10, price: Number(form.seats.first.price) }
        }
      };

      console.log('Sending payload:', payload);
      if (editingId) {
        await updateFlight(editingId, payload);
      } else {
        await createFlight(payload);
      }

      await fetchFlights();
      resetForm();
    } catch (err) {
      console.error('Failed to save flight:', err);
      setError('Failed to save flight: ' + (err.response?.data?.error || err.message));
    }
  };

  const startEdit = (flight) => {
    setEditingId(flight._id);
    setForm({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      departure: {
        airport: flight.departure.airport,
        city: flight.departure.city,
        country: flight.departure.country,
        date: new Date(flight.departure.date).toISOString().split('T')[0],
        time: flight.departure.time
      },
      arrival: {
        airport: flight.arrival.airport,
        city: flight.arrival.city,
        country: flight.arrival.country,
        date: new Date(flight.arrival.date).toISOString().split('T')[0],
        time: flight.arrival.time
      },
      duration: flight.duration,
      aircraft: flight.aircraft,
      seats: { 
        economy: { price: flight.seats.economy.price }, 
        business: { price: flight.seats.business.price }, 
        first: { price: flight.seats.first.price } 
      }
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flight?')) return;
    try {
      await deleteFlight(id);
      await fetchFlights();
    } catch (err) {
      setError('Failed to delete flight');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center text-2xl">Loading flights...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700">Admin: Manage Flights</h1>
        <p className="text-gray-600">Add, edit, and remove flight schedules.</p>
      </div>

      {error && <div className="mb-6 text-red-600 font-medium">{error}</div>}

      <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-semibold mb-4">{editingId ? 'Edit Flight' : 'Add New Flight'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flight Number</label>
            <input
              name="flightNumber"
              value={form.flightNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Airline</label>
            <input
              name="airline"
              value={form.airline}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Departure</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                name="departure.airport"
                value={form.departure.airport}
                onChange={handleChange}
                placeholder="Airport"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="departure.city"
                value={form.departure.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="departure.country"
                value={form.departure.country}
                onChange={handleChange}
                placeholder="Country"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="departure.date"
                type="date"
                value={form.departure.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="departure.time"
                type="time"
                value={form.departure.time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Arrival</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                name="arrival.airport"
                value={form.arrival.airport}
                onChange={handleChange}
                placeholder="Airport"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="arrival.city"
                value={form.arrival.city}
                onChange={handleChange}
                placeholder="City"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="arrival.country"
                value={form.arrival.country}
                onChange={handleChange}
                placeholder="Country"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="arrival.date"
                type="date"
                value={form.arrival.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="arrival.time"
                type="time"
                value={form.arrival.time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 6h 30m"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft</label>
            <input
              name="aircraft"
              value={form.aircraft}
              onChange={handleChange}
              placeholder="e.g. Boeing 737"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Economy Price</label>
            <input
              name="economyPrice"
              type="number"
              value={form.seats.economy.price}
              onChange={handleChange}
              placeholder="e.g. 250"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Price</label>
            <input
              name="businessPrice"
              type="number"
              value={form.seats.business.price}
              onChange={handleChange}
              placeholder="e.g. 500"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Class Price</label>
            <input
              name="firstPrice"
              type="number"
              value={form.seats.first.price}
              onChange={handleChange}
              placeholder="e.g. 1000"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {editingId ? 'Update Flight' : 'Add Flight'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Existing Flights</h2>
        <div className="space-y-4">
          {flights.map(flight => (
            <div key={flight._id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-lg font-semibold">{flight.airline} - {flight.flightNumber}</h3>
                <p className="text-sm text-gray-600">{flight.departure.city} → {flight.arrival.city} | {flight.duration}</p>
                <p className="text-sm text-gray-500">{new Date(flight.departure.date).toLocaleDateString()} {flight.departure.time}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(flight)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(flight._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
