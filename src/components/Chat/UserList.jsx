import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chat/users');
      setUsers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="text-lg font-bold mb-4">
        {user.role === 'customer' ? 'Staff Members' : 'Customers'} 
        ({users.length})
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {users.map((userItem) => (
          <div
            key={userItem._id}
            onClick={() => onSelectUser(userItem)}
            className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {userItem.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="ml-3 flex-1">
              <p className="font-medium text-gray-900">{userItem.name}</p>
              <p className="text-sm text-gray-500">{userItem.role} • {userItem.email}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No {user.role === 'customer' ? 'staff members' : 'customers'} found
          </p>
        )}
      </div>
    </div>
  );
}

export default UserList;