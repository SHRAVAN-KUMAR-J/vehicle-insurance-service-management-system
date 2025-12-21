import { useEffect, useState } from 'react';
import { FaCar, FaUser, FaPhone, FaCalendarAlt, FaClock } from 'react-icons/fa';
import api from '../../utils/api';
import { formatDate } from '../../utils/formatDate';

function RenewalQueue() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRenewalQueue();
  }, []);

  const fetchRenewalQueue = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vehicle/renewal-queue');
      setVehicles(res.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch renewal queue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Renewal Queue</h3>
        <p className="text-gray-600">Loading renewal queue...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Renewal Queue</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {vehicles.length === 0 ? (
        <p className="text-gray-600">No vehicles expiring in the next 30 days.</p>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="flex items-center justify-between border border-gray-200 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="flex items-center space-x-4">
                <FaCar className="text-blue-500 text-2xl" />
                <div>
                  <p className="font-semibold text-gray-700">
                    Registration: <span className="text-gray-900">{vehicle.registrationNumber}</span>
                  </p>
                  <p className="text-sm text-gray-600">Model: {vehicle.model}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <FaUser className="text-green-500 text-xl" />
                <p className="text-gray-700">{vehicle.ownerId?.name || 'N/A'}</p>
              </div>

              <div className="flex items-center space-x-2">
                <FaPhone className="text-yellow-500" />
                <a 
                  href={`tel:${vehicle.ownerId?.mobile || ''}`} 
                  className="text-blue-600 font-medium"
                >
                  {vehicle.ownerId?.mobile || 'N/A'}
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-purple-500" />
                <p className="text-gray-700">{formatDate(vehicle.expiryDate)}</p>
              </div>

              <div className="flex items-center space-x-2">
                <FaClock className="text-red-500" />
                <p className="font-semibold text-gray-800">
                  {vehicle.daysUntilExpiry} {vehicle.daysUntilExpiry === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RenewalQueue;
