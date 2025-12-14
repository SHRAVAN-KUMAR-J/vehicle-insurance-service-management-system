import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';

function StaffLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileImageClick = () => {
    setShowProfileModal(true);
  };

  const menuItems = [
    { path: '/staff', label: 'Staff Dashboard', icon: '🏠' },
    { path: '/staff/customers', label: 'Customers List', icon: '👨🏻‍💻' },
    { path: '/staff/upload-pdf', label: 'Upload PDF', icon: '📤' },
    { path: '/staff/renewal-queue', label: 'Renewal Queue', icon: '🔄' },
    { path: '/profile', label: 'Profile', icon: '🪪' },
    { path: '/staff/notifications', label: 'Notifications', icon: '🔔' },
  ];

  const isActive = (path) => {
    if (path === '/staff') {
      return location.pathname === '/staff';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-md shadow-lg hover:bg-blue-700 transition"
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Profile Image Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-lg mx-4">
            {/* Close Button */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-200 text-3xl font-bold z-10"
            >
              ×
            </button>

            {/* Profile Image Container */}
            <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt={user.name || 'Staff'}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-lg">
                  <span className="text-white text-6xl font-bold">
                    {getInitials(user?.name)}
                  </span>
                </div>
              )}

              {/* User Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h3 className="text-xl font-bold">{user?.name || 'Staff User'}</h3>
                <p className="text-gray-200">{user?.role || 'Staff'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-72 sm:w-80 lg:w-64 bg-white shadow-lg flex flex-col transform transition-transform duration-300 z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Profile Section */}
        <div className="p-4 sm:p-6 border-b">
          <div className="flex flex-col items-center">
            <div className="relative mb-3 cursor-pointer" onClick={handleProfileImageClick}>
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-16 lg:h-16 rounded-full object-cover border-4 border-blue-600 shadow-md hover:shadow-lg transition-shadow duration-200"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-16 lg:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-2xl font-bold shadow-md hover:shadow-lg transition-shadow duration-200">
                  {getInitials(user?.name)}
                </div>
              )}
            </div>

            <h3 className="font-semibold text-gray-800 text-center text-base sm:text-lg lg:text-base">
              {user?.name || 'Staff User'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide mt-1">
              {user?.role || 'Staff'}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">
              Vehicle Insurance System
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-lg transition-colors text-sm sm:text-base ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl sm:text-2xl lg:text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button - Fixed Bottom */}
        <div className="p-4 border-t mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-md text-sm sm:text-base"
          >
            <FaSignOutAlt className="text-lg" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4 pt-16 lg:pt-4 lg:p-8">
        {children}
      </div>

      {/* Overlay when sidebar open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}

export default StaffLayout;