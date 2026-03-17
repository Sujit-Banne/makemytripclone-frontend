import React, { useEffect, useState } from 'react';
import { getAdminVisaApplications, updateVisaApplicationStatus } from '../services/api';

export default function AdminVisaApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getAdminVisaApplications();
      setApplications(response.data);
    } catch (err) {
      setError('Unable to load visa applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await updateVisaApplicationStatus(applicationId, { status: newStatus });
      await fetchApplications(); // Refresh the list
    } catch (err) {
      setError('Failed to update application status');
      console.error(err);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center text-2xl">Loading visa applications...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-pink-700">Admin: Visa Applications</h1>
        <p className="text-gray-600">Review and approve visa application requests</p>
      </div>

      {error && (
        <div className="mb-6 text-red-600 font-medium bg-red-50 p-4 rounded-lg">{error}</div>
      )}

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          All ({applications.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Pending ({applications.filter(a => a.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg ${filter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Approved ({applications.filter(a => a.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg ${filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Rejected ({applications.filter(a => a.status === 'rejected').length})
        </button>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visa Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Application #{application._id.slice(-6)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Applied: {new Date(application.applicationDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.user?.email || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Passport: {application.passportNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        Nationality: {application.nationality}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.visa?.visaType || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.visa?.country || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Processing: {application.visa?.processingTime || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {application.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'approved')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'rejected')}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {application.status === 'approved' && (
                      <span className="text-green-600 font-medium">Approved ✓</span>
                    )}
                    {application.status === 'rejected' && (
                      <span className="text-red-600 font-medium">Rejected ✗</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No applications found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}