import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { useChatNotifications } from '../../hooks/useChatNotifications';
import { useEffect, useState } from 'react';
import {
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaComments,
  FaCar,
  FaBars,
  FaTimes,
  FaChevronDown,
} from 'react-icons/fa';

function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount, fetchUnreadCount } = useNotifications();
  const { unreadChatCount, fetchUnreadChatCount } = useChatNotifications();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchUnreadChatCount();
      const interval = setInterval(() => {
        fetchUnreadCount();
        fetchUnreadChatCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchUnreadCount, fetchUnreadChatCount]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setProfileDropdown(false);
  };

  const navLinkStyle =
    'flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium group relative';
  const primaryLinkStyle = `${navLinkStyle} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl`;
  const secondaryLinkStyle = `${navLinkStyle} text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100`;
  const mobileLinkStyle =
    'flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 border-l-4 border-transparent hover:border-blue-500 transition-all duration-200';

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg text-white shadow-lg">
              <FaCar className="text-lg" />
            </div>
            <span className="hidden sm:block">Vehicle Insurance</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              <>
                {/* Notifications */}
                {(user?.role === 'customer' || user?.role === 'admin') && (
                  <Link to="/notifications" className={`${secondaryLinkStyle} relative`}>
                    {/* <FaBell className="text-lg" /> */}
                    <span>🔔 Notifications</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Chat */}
                <Link to="/chat" className={`${secondaryLinkStyle} relative`}>
                  <FaComments className="text-xl text-sky-500" />
                  <span>Chat</span>
                  {unreadChatCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm animate-pulse">
                      {unreadChatCount > 99 ? '99+' : unreadChatCount}
                    </span>
                  )}
                </Link>

                {/* Role-based portals */}
                {user?.role === 'customer' && (
                  <Link to="/customer" className={primaryLinkStyle}>
                    <span>Customer Portal</span>
                  </Link>
                )}
                {user?.role === 'staff' && (
                  <Link to="/staff" className={primaryLinkStyle}>
                    <span>Staff Portal</span>
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className={primaryLinkStyle}>
                    <span>Admin Portal</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <FaUserCircle className="text-blue-600 text-xl" />
                    <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                      {user.name || user.email}
                    </span>
                    <FaChevronDown
                      className={`text-gray-400 text-xs transition-transform duration-200 ${
                        profileDropdown ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {profileDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                        onClick={() => setProfileDropdown(false)}
                      >
                        <FaUserCircle className="text-blue-600" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={secondaryLinkStyle}>
                  <span>Login</span>
                </Link>
                <Link to="/register" className={primaryLinkStyle}>
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 transition-all duration-300 ease-in-out transform z-50 ${
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-3 border-b border-gray-100 mb-2 flex items-center space-x-3">
                  <FaUserCircle className="text-blue-600 text-2xl" />
                  <div>
                    <p className="font-semibold text-gray-900">{user.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <Link to="/profile" className={mobileLinkStyle} onClick={() => setMenuOpen(false)}>
                  <FaUserCircle className="text-blue-600 text-lg" />
                  <span>My Profile</span>
                </Link>

                {(user?.role === 'customer' || user?.role === 'admin') && (
                  <Link
                    to="/notifications"
                    className={mobileLinkStyle}
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaBell className="text-blue-600 text-lg" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                <Link to="/chat" className={mobileLinkStyle} onClick={() => setMenuOpen(false)}>
                  <FaComments className="text-blue-600 text-lg" />
                  <span>Chat</span>
                  {unreadChatCount > 0 && (
                    <span className="ml-auto bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {unreadChatCount > 9 ? '9+' : unreadChatCount}
                    </span>
                  )}
                </Link>

                {user?.role === 'customer' && (
                  <Link to="/customer" className={mobileLinkStyle} onClick={() => setMenuOpen(false)}>
                    <span className="font-semibold text-blue-600">Customer Portal</span>
                  </Link>
                )}
                {user?.role === 'staff' && (
                  <Link to="/staff" className={mobileLinkStyle} onClick={() => setMenuOpen(false)}>
                    <span className="font-semibold text-blue-600">Staff Portal</span>
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className={mobileLinkStyle} onClick={() => setMenuOpen(false)}>
                    <span className="font-semibold text-blue-600">Admin Portal</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left border-l-4 border-transparent hover:border-red-500 transition-all duration-200"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className={mobileLinkStyle}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg mx-4 mt-4 justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay (click to close menu) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;
