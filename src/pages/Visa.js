import React, { useState, useEffect } from 'react';
import { getVisas, applyForVisa } from '../services/api';

export default function Visa() {
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visaApplication, setVisaApplication] = useState({
    visaId: '',
    applicationData: {
      fullName: '',
      dateOfBirth: '',
      passportNumber: '',
      passportExpiry: '',
      nationality: '',
      address: '',
      phone: '',
      email: '',
      purpose: '',
      travelDate: '',
      returnDate: ''
    },
    documents: []
  });
  const [applicationLoading, setApplicationLoading] = useState(false);

  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchVisas();
  }, []);

  const fetchVisas = async () => {
    try {
      const response = await getVisas();
      setVisas(response.data);
    } catch (err) {
      setError('Failed to load visa information');
      console.error('Error fetching visas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'visaId') {
      setVisaApplication(prev => ({ ...prev, visaId: value }));
    } else {
      setVisaApplication(prev => ({
        ...prev,
        applicationData: { ...prev.applicationData, [name]: value }
      }));
    }
  };

  const handleQuickApply = async (visaId) => {
    // For quick apply, we'll need to collect basic info
    const fullName = prompt('Enter your full name:');
    if (!fullName) return;

    const email = prompt('Enter your email:');
    if (!email) return;

    const phone = prompt('Enter your phone number:');
    if (!phone) return;

    setApplicationLoading(true);
    try {
      const applicationPayload = {
        visaId,
        applicationData: {
          fullName,
          dateOfBirth: '',
          passportNumber: '',
          passportExpiry: '',
          nationality: '',
          address: '',
          phone,
          email,
          purpose: 'tourism',
          travelDate: '',
          returnDate: ''
        },
        documents: []
      };

      await applyForVisa(applicationPayload);
      alert('Visa application submitted successfully! Please complete your application with full details later.');
    } catch (err) {
      console.error('Application error:', err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setApplicationLoading(true);
    try {
      await applyForVisa(visaApplication);
      alert('Visa application submitted successfully!');
      // Reset form
      setVisaApplication({
        visaId: '',
        applicationData: {
          fullName: '',
          dateOfBirth: '',
          passportNumber: '',
          passportExpiry: '',
          nationality: '',
          address: '',
          phone: '',
          email: '',
          purpose: '',
          travelDate: '',
          returnDate: ''
        },
        documents: []
      });
    } catch (err) {
      console.error('Application error:', err);
      if (err.response?.status === 401) {
        alert('Please log in to submit a visa application.');
      } else if (err.response?.status === 400) {
        alert(err.response.data.message || 'Failed to submit application. Please check your information.');
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } finally {
      setApplicationLoading(false);
    }
  };

  const visaTypes = [
    { id: 'tourist', name: 'Tourist Visa', description: 'For leisure and sightseeing' },
    { id: 'business', name: 'Business Visa', description: 'For business meetings and conferences' },
    { id: 'student', name: 'Student Visa', description: 'For educational purposes' },
    { id: 'work', name: 'Work Visa', description: 'For employment opportunities' },
    { id: 'medical', name: 'Medical Visa', description: 'For medical treatment' }
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center text-2xl">Loading visa information...</div>
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

  // Check if user is authenticated
  if (!token || !user) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-600 mb-4">Visa Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get your visa approved hassle-free. Expert guidance, document assistance,
            and fast-track processing for all your international travel needs.
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Authentication Required</h2>
          <p className="text-yellow-700 mb-6">
            You need to be logged in to apply for visas. Please log in to your account to continue.
          </p>
          <div className="space-x-4">
            <a
              href="/login"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold"
            >
              Log In
            </a>
            <a
              href="/register"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-red-600 mb-4">Visa Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get your visa approved hassle-free. Expert guidance, document assistance,
          and fast-track processing for all your international travel needs.
        </p>
      </div>

      {/* Visa Application Form */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Apply for Visa</h2>
        <form onSubmit={handleSubmitApplication}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Visa</label>
              <select
                name="visaId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={visaApplication.visaId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Visa</option>
                {visas.map(visa => (
                  <option key={visa._id} value={visa._id}>{visa.country} - {visa.visaType}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={visaApplication.applicationData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={visaApplication.applicationData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
              <input
                type="text"
                name="passportNumber"
                placeholder="Enter passport number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={visaApplication.applicationData.passportNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passport Expiry</label>
              <input
                type="date"
                name="passportExpiry"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={visaApplication.applicationData.passportExpiry}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
              <input
                type="text"
                name="nationality"
                placeholder="Enter nationality"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={visaApplication.applicationData.nationality}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                placeholder="Enter your full address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="3"
                value={visaApplication.applicationData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={visaApplication.applicationData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={visaApplication.applicationData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Travel</label>
              <select
                name="purpose"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={visaApplication.applicationData.purpose}
                onChange={handleInputChange}
                required
              >
                <option value="">Select purpose</option>
                <option value="tourism">Tourism</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
                <option value="medical">Medical</option>
                <option value="family">Family Visit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
              <input
                type="date"
                name="travelDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={visaApplication.applicationData.travelDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
              <input
                type="date"
                name="returnDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={visaApplication.applicationData.returnDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={applicationLoading}
            className="mt-6 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50"
          >
            {applicationLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>

      {/* Visa Types */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {visaTypes.map(type => (
          <div key={type.id} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
            <p className="text-gray-600 mb-4">{type.description}</p>
          </div>
        ))}
      </div>

      {/* Popular Destinations */}
      <div className="bg-red-50 rounded-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-center mb-6">Popular Visa Destinations</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visas.map(visa => (
            <div key={visa._id} className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold mb-2">{visa.country}</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Processing Time:</span> {visa.processingTime}</p>
                <p><span className="font-medium">Visa Fee:</span> {visa.fee}</p>
                <p><span className="font-medium">Validity:</span> {visa.validity}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {visa.requirements.slice(0, 3).map((req, index) => (
                    <li key={index}>• {req}</li>
                  ))}
                </ul>
              </div>
              <button 
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
                onClick={() => handleQuickApply(visa._id)}
                disabled={applicationLoading}
              >
                Apply for {visa.country}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Visa Requirements */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Visa Requirements</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">📋 Required Documents</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Valid passport (6+ months validity)</li>
              <li>• Recent passport-sized photographs</li>
              <li>• Visa application form</li>
              <li>• Proof of travel purpose</li>
              <li>• Financial statements</li>
              <li>• Hotel booking confirmation</li>
              <li>• Flight itinerary</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">⚡ Our Services</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Document verification</li>
              <li>• Application assistance</li>
              <li>• Embassy appointment booking</li>
              <li>• Status tracking</li>
              <li>• Rejection appeal support</li>
              <li>• Express processing</li>
              <li>• 24/7 customer support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
