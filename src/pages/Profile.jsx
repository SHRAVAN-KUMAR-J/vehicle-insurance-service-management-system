import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import Navbar from '../components/Common/Navbar';

function Profile() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    profileImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Fetch fresh profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetchingProfile(true);
        const res = await api.get('/user/profile');
        const userData = res.data.user || res.data;
       
        if (setUser) {
          setUser(userData);
        }
       
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          mobile: userData.mobile || '',
          profileImage: null,
        });
        setPreview(userData.profileImage?.url || null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (user) {
          setFormData({
            name: user.name || '',
            email: user.email || '',
            mobile: user.mobile || '',
            profileImage: null,
          });
          setPreview(user.profileImage?.url || null);
        }
      } finally {
        setFetchingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'profileImage') {
      const file = e.target.files[0];
      
      // Validate file exists and is an image
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Clear any previous error
      setError('');
      
      // Revoke old preview URL to prevent memory leaks
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }

      // Set file and create new preview
      setFormData({ ...formData, profileImage: file });
      
      try {
        const newPreview = URL.createObjectURL(file);
        setPreview(newPreview);
      } catch (err) {
        console.error('Error creating preview:', err);
        setError('Failed to preview image');
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const updateData = new FormData();
    updateData.append('name', formData.name);
    updateData.append('mobile', formData.mobile);
    
    if (formData.profileImage) {
      updateData.append('profileImage', formData.profileImage);
    }

    try {
      const res = await api.put('/user/profile', updateData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const updatedUser = res.data.user || res.data;
     
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        mobile: updatedUser.mobile || '',
        profileImage: null,
      });
      
      // Revoke old blob URL before setting new preview
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      
      setPreview(updatedUser.profileImage?.url || null);

      if (setUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setMessage('Profile updated successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Profile update error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (fetchingProfile) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-6 max-w-md bg-white shadow-lg rounded-lg mt-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-md bg-white shadow-lg rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center animate-fade-in">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center animate-fade-in">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {preview && (
            <div className="flex justify-center mb-4">
              <img
                src={preview}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                onError={(e) => {
                  console.error('Image load error');
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Profile Image</label>
            <input
              type="file"
              name="profileImage"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Formats: JPEG, PNG</p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded transition font-medium ${
              loading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;