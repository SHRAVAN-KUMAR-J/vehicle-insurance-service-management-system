import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt } from 'react-icons/fa';
import api from '../../utils/api';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalCustomer, setModalCustomer] = useState(null); // State for modal customer data
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/user/all-users?role=customer');
      setCustomers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewVehicles = (customerId) => {
    navigate(`/staff/customer-vehicles/${customerId}`);
  };

  // Open modal with customer data
  const openModal = (customer) => {
    setModalCustomer(customer);
  };

  // Close modal
  const closeModal = () => {
    setModalCustomer(null);
  };

  if (loading) return <div className="p-4">Loading customers...</div>;

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm w-full max-w-full overflow-x-auto">
      <h3 className="text-lg md:text-xl font-bold mb-4">Customer List</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid gap-4 md:gap-6">
        {customers.length === 0 ? (
          <p className="text-gray-500">No customers found.</p>
        ) : (
          customers.map((customer) => (
            <div
              key={customer._id}
              className="flex flex-col md:flex-row items-start md:items-center border p-4 rounded-lg bg-gray-50 hover:shadow-md transition-all"
            >
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4 relative">
                <img
                  src={customer.profileImage?.url || 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png'}
                  alt={`${customer.name}'s profile`}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gray-300"
                  onError={(e) => {
                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png';
                  }}
                />
                <button
                  onClick={() => openModal(customer)}
                  className="absolute bottom-0 right-0 bg-sky-400 text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-blue-700 transition"
                >
                  View
                </button>
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm md:text-base">
                      <strong>Name:</strong> {customer.name}
                    </p>
                    <p className="text-sm md:text-base">
                      <strong>Email:</strong> {customer.email}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1">
                      <p className="text-sm md:text-base">
                        <strong>Mobile:</strong>{' '}
                        <a
                          href={`tel:${customer.mobile}`}
                          className="text-blue-600 hover:underline"
                        >
                          {customer.mobile}
                        </a>
                      </p>
                      <a
                        href={`tel:${customer.mobile}`}
                        className="flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition text-sm md:text-base w-fit"
                      >
                        <FaPhoneAlt size={16} className="text-red-500" />
                        <span className="font-medium">Call Now</span>
                      </a>
                    </div>
                    <p className="mt-2 text-sm md:text-base">
                      <strong>Status:</strong>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs md:text-sm ${
                          customer.accountStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {customer.accountStatus}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewVehicles(customer._id)}
                    className="mt-4 md:mt-0 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition text-sm md:text-base w-full md:w-auto"
                  >
                    View Vehicles
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold">Customer Details</h4>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={modalCustomer.profileImage?.url || 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png'}
                alt={`${modalCustomer.name}'s profile`}
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mb-4"
                onError={(e) => {
                  e.target.src = 'https://cdn-icons-png.flaticon.com/512/8847/8847419.png';
                }}
              />
              <p className="text-gray-700 text-lg"><strong>Name:</strong> {modalCustomer.name}</p>
              <p className="text-gray-700 text-lg"><strong>Email:</strong> {modalCustomer.email}</p>
              <p className="text-gray-700 text-lg"><strong>Mobile:</strong> {modalCustomer.mobile}</p>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerList;