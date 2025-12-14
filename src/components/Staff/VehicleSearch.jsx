import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { formatDate } from '../../utils/formatDate';

function VehicleSearch() {
  const [searchParams, setSearchParams] = useState({
    regNo: '',
    chassisNo: '',
    customerId: '',
  });
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const query = new URLSearchParams(searchParams).toString();
      const res = await api.get(`/vehicle/list?${query}`);
      setVehicles(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search vehicles');
    }
  };

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleUpdateExpiry = async (vehicleId, newExpiryDate) => {
    try {
      const res = await api.put(`/vehicle/${vehicleId}`, { expiryDate: newExpiryDate });
      setVehicles((prev) =>
        prev.map((v) => (v._id === vehicleId ? { ...v, expiryDate: res.data.data.expiryDate } : v))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update expiry date');
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="text-lg font-bold mb-2">Vehicle Search</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="regNo"
            placeholder="Registration Number"
            value={searchParams.regNo}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="chassisNo"
            placeholder="Chassis Number"
            value={searchParams.chassisNo}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="customerId"
            placeholder="Customer ID"
            value={searchParams.customerId}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="border p-4 rounded">
              <p><strong>Registration:</strong> {vehicle.registrationNumber}</p>
              <p><strong>Chassis:</strong> {vehicle.chassisNumber}</p>
              <p><strong>Model:</strong> {vehicle.model}</p>
              <p><strong>Owner:</strong> {vehicle.ownerId?.name}</p>
              <p><strong>Expiry Date:</strong> {formatDate(vehicle.expiryDate)}</p>
              <div className="mt-2">
                <input
                  type="date"
                  onChange={(e) => handleUpdateExpiry(vehicle._id, e.target.value)}
                  className="p-2 border rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VehicleSearch;