import React, { useEffect, useState } from 'react';
import { getVisas, createVisa, updateVisa, deleteVisa } from '../services/api';

export default function AdminVisas() {
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    visaType: '',
    country: '',
    processingTime: '',
    requirements: '',
    fee: '',
    category: 'tourist',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchVisas();
  }, []);

  const fetchVisas = async () => {
    try {
      const response = await getVisas();
      setVisas(response.data);
    } catch (err) {
      setError('Unable to load visas');
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
    setForm({ visaType: '', country: '', processingTime: '', requirements: '', fee: '', category: 'tourist', description: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { 
        ...form, 
        fee: Number(form.fee),
        requirements: form.requirements.split('\n').filter(req => req.trim() !== '')
      };
      if (editingId) {
        await updateVisa(editingId, payload);
      } else {
        await createVisa(payload);
      }
      await fetchVisas();
      resetForm();
    } catch (err) {
      setError('Failed to save visa');
      console.error(err);
    }
  };

  const startEdit = (visa) => {
    setEditingId(visa._id);
    setForm({
      visaType: visa.visaType,
      country: visa.country,
      processingTime: visa.processingTime,
      requirements: Array.isArray(visa.requirements) ? visa.requirements.join('\n') : visa.requirements,
      fee: visa.fee,
      category: visa.category,
      description: visa.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this visa?')) return;
    try {
      await deleteVisa(id);
      await fetchVisas();
    } catch (err) {
      setError('Failed to delete visa');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center text-2xl">Loading visas...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-700">Admin: Manage Visas</h1>
        <p className="text-gray-600">Add, edit, and remove visa types.</p>
      </div>

      {error && <div className="mb-6 text-red-600 font-medium">{error}</div>}

      <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-semibold mb-4">{editingId ? 'Edit Visa' : 'Add New Visa'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visa Type</label>
            <input
              name="visaType"
              value={form.visaType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
            <input
              name="processingTime"
              value={form.processingTime}
              onChange={handleChange}
              placeholder="e.g. 30 days"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="tourist">Tourist</option>
              <option value="business">Business</option>
              <option value="student">Student</option>
              <option value="work">Work</option>
              <option value="medical">Medical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fee</label>
            <input
              name="fee"
              type="number"
              value={form.fee}
              onChange={handleChange}
              placeholder="e.g. 50"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (one per line)</label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows={4}
              placeholder="Enter each requirement on a new line"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              {editingId ? 'Update Visa' : 'Add Visa'}
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
        <h2 className="text-2xl font-semibold mb-4">Existing Visas</h2>
        <div className="space-y-4">
          {visas.map(visa => (
            <div key={visa._id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-lg font-semibold">{visa.type} - {visa.country}</h3>
                <p className="text-sm text-gray-600">Duration: {visa.duration}</p>
                <p className="text-sm text-gray-500">Fee: ${visa.fee}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(visa)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(visa._id)}
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
