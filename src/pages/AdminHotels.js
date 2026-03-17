import React, { useEffect, useState } from 'react';
import { getHotels, createHotel, updateHotel, deleteHotel } from '../services/api';

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', location: '', price: '', rating: 4, type: 'hotel', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await getHotels();
      setHotels(response.data);
    } catch (err) {
      setError('Unable to load hotels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ name: '', location: '', price: '', rating: 4, type: 'hotel', description: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateHotel(editingId, { ...form, price: Number(form.price), rating: Number(form.rating) });
      } else {
        await createHotel({ ...form, price: Number(form.price), rating: Number(form.rating) });
      }
      await fetchHotels();
      resetForm();
    } catch (err) {
      setError('Failed to save hotel');
      console.error(err);
    }
  };

  const startEdit = (hotel) => {
    setEditingId(hotel._id);
    setForm({
      name: hotel.name,
      location: hotel.location,
      price: hotel.price,
      rating: hotel.rating,
      type: hotel.type,
      description: hotel.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    try {
      await deleteHotel(id);
      await fetchHotels();
    } catch (err) {
      setError('Failed to delete hotel');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center text-2xl">Loading hotels...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">Admin: Manage Hotels</h1>
        <p className="text-gray-600">Create, edit, or delete hotel listings.</p>
      </div>

      {error && (
        <div className="mb-6 text-red-600 font-medium">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-semibold mb-4">{editingId ? 'Edit Hotel' : 'Add New Hotel'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <input
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              {editingId ? 'Update Hotel' : 'Add Hotel'}
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
        <h2 className="text-2xl font-semibold mb-4">Existing Hotels</h2>
        <div className="space-y-4">
          {hotels.map(hotel => (
            <div key={hotel._id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-lg font-semibold">{hotel.name}</h3>
                <p className="text-sm text-gray-600">{hotel.location} • ₹{hotel.price} per night</p>
                <p className="text-sm text-gray-500">{hotel.description}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(hotel)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hotel._id)}
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
