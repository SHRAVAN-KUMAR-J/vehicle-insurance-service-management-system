import { useEffect, useState } from 'react';
import api from '../../utils/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // State for category filter
  const [modalUser, setModalUser] = useState(null); // State for modal user data

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/user/all-users');
      setUsers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    }
  };

  const handleStatusUpdate = async (userId, status) => {
    try {
      await api.put('/user/update-status', { userId, status });
      setUsers(prev =>
        prev.map(u => (u._id === userId ? { ...u, accountStatus: status } : u))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status');
    }
  };

  // Filter users based on selected category
  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'customers') return user.role === 'customer';
    if (filter === 'staffs') return user.role === 'staff';
    return true;
  });

  // Open modal with user data
  const openModal = (user) => {
    setModalUser(user);
  };

  // Close modal
  const closeModal = () => {
    setModalUser(null);
  };

  return (
    <div className="p-5">
      <h3 className="text-2xl font-bold mb-4">User Management</h3>

      {/* Category Filter Buttons */}
      <div className="mb-6 flex justify-center space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => setFilter('customers')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            filter === 'customers'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Customers
        </button>
        <button
          onClick={() => setFilter('staffs')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            filter === 'staffs'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Staffs
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const imgUrl = user?.profileImage?.url;
          return (
            <div
              key={user._id}
              className="bg-white shadow-lg border rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 text-center"
            >
              {/* Profile Image */}
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-gray-300 mb-3 cursor-pointer"
                  onClick={() => openModal(user)}
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold cursor-pointer"
                  onClick={() => openModal(user)}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
              <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-700"><strong>Role:</strong> {user.role}</p>

              {/* Status Badge */}
              <p className="mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-sm text-white ${
                    user.accountStatus === 'active'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                >
                  {user.accountStatus}
                </span>
              </p>

              {user.role !== 'admin' && (
                <div className="mt-4">
                  {user.accountStatus === 'active' ? (
                    <button
                      onClick={() => handleStatusUpdate(user._id, 'banned')}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Ban User
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusUpdate(user._id, 'active')}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Unban User
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold">User Details</h4>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col items-center">
              {modalUser?.profileImage?.url ? (
                <img
                  src={modalUser.profileImage.url}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-4 text-white text-2xl font-bold">
                  {modalUser.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <p className="text-gray-700 text-lg"><strong>Name:</strong> {modalUser.name}</p>
              <p className="text-gray-700 text-lg"><strong>Email:</strong> {modalUser.email}</p>
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

export default UserManagement;