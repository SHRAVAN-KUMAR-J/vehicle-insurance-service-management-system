// Customer/VehicleForm.jsx
import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCar, FaFileAlt, FaImage } from 'react-icons/fa';
import api from '../../utils/api';

function VehicleForm({ onVehicleAdded }) {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    model: '',
    vehicleImage: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/vehicle', formData);
      onVehicleAdded(res.data.data);
      setFormData({
        registrationNumber: '',
        model: '',
        vehicleImage: '',
      });
      alert(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">Vehicle Registration</h1>
          <p className="text-gray-600 mt-1">Add your vehicle details for insurance management</p>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* ✅ Left Side - Image (background removed, text black) */}
            <div className="bg-white p-12 flex items-center justify-center relative overflow-hidden">
              <div className="relative z-10 text-center">
                <img
                  src="https://media.istockphoto.com/id/1361706574/vector/car-insurance-document-report-paper-agreement-checklist-or-loan-checkmarks-form-list.jpg?s=612x612&w=0&k=20&c=e7KUgPuZcE24JsQfhLAPPy33DI-rXsh7i7TjO3b1SMI="
                  alt="Insurance Document"
                  className="w-full max-w-md mx-auto drop-shadow-2xl rounded-lg"
                />
                <div className="mt-8 text-black">
                  <h3 className="text-2xl font-bold mb-3">Secure Vehicle Insurance</h3>
                  <p className="text-gray-700 text-lg">Protect your vehicle with comprehensive coverage</p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <FaFileAlt className="text-3xl mb-2 mx-auto text-blue-600" />
                      <p className="text-sm text-gray-800">Easy Registration</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <FaCar className="text-3xl mb-2 mx-auto text-blue-600" />
                      <p className="text-sm text-gray-800">Staff Verification</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Side - Form */}
            <div className="p-12">
              <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Your Vehicle</h2>
                <p className="text-gray-600 mb-8 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  Chassis number and insurance policy will be created by staff. Insurance dates will be set by our staff
                </p>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Registration Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaFileAlt className="inline mr-2 text-blue-600" />
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-800"
                      placeholder="e.g., MH04AB1234"
                      required
                    />
                  </div>
                  {/* Model */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaCar className="inline mr-2 text-blue-600" />
                      Vehicle Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-800"
                      placeholder="e.g., Maruti Swift"
                      required
                    />
                  </div>
                  {/* Vehicle Image */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaImage className="inline mr-2 text-blue-600" />
                      Vehicle Model Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="vehicleImage"
                      value={formData.vehicleImage}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-800"
                      placeholder="Paste Google image URL for your vehicle model"
                    />
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding Vehicle...
                      </span>
                    ) : (
                      'Add Vehicle'
                    )}
                  </button>
                </form>
                {/* Footer Note */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> After submission, our staff will verify your details, create the chassis number and insurance policy, and set the insurance start and expiry dates for your vehicle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleForm;