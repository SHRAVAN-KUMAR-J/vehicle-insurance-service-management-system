import { useState, useEffect } from 'react';
import UserManagement from './UserManagement';
import ServiceManagement from './ServiceManagement';
import PaymentApproval from './PaymentApproval';
import AnalyticsChart from './AnalyticsChart';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

// Icons for stats cards
const StatsIcons = {
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  vehicles: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  insurances: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  approvals: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // New state for modal
  const { user } = useAuth();
  const [totals, setTotals] = useState(null);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const res = await api.get('/admin/analytics?dateRange=all');
        const data = res.data.data;
        setTotals({
          users: data.userRegistrations.reduce((sum, r) => sum + r.count, 0),
          vehicles: data.vehicleAdditions.reduce((sum, r) => sum + r.count, 0),
          insurances: data.insuranceCreations.reduce((sum, r) => sum + r.count, 0),
          approvals: data.paymentApprovals.reduce((sum, r) => sum + r.count, 0),
        });
      } catch (err) {
        console.error('Failed to fetch totals:', err);
      }
    };
    fetchTotals();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  // Handle profile image click
  const handleProfileImageClick = () => {
    setShowProfileModal(true);
  };

  // Stats cards data
  const statsCards = [
    {
      id: 'users',
      title: 'Total Users',
      value: totals?.users || 0,
      icon: StatsIcons.users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'vehicles',
      title: 'Total Vehicles',
      value: totals?.vehicles || 0,
      icon: StatsIcons.vehicles,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      id: 'insurances',
      title: 'Total Insurances',
      value: totals?.insurances || 0,
      icon: StatsIcons.insurances,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      id: 'approvals',
      title: 'Total Approvals',
      value: totals?.approvals || 0,
      icon: StatsIcons.approvals,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Welcome back, {user?.name || 'Admin'}! 👋
                </h1>
                <p className="text-gray-600 mt-2">Here's what's happening with your platform today.</p>
              </div>
              <button
                onClick={toggleSidebar}
                className="md:hidden bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ☰
              </button>
            </div>

            {/* Modern Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {statsCards.map((card) => (
                <div
                  key={card.id}
                  className={`${card.bgColor} ${card.borderColor} border rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                      <p className={`text-2xl md:text-3xl font-bold ${card.textColor}`}>
                        {card.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${card.bgColor} ${card.textColor}`}>
                      {card.icon}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <span className="text-xs font-medium text-gray-500">Overall count</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Platform Overview</h2>
                  <p className="text-gray-600 mb-6">
                    Manage your platform efficiently with the admin dashboard. Here you can:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Manage users (customers and staff) - ban or unban accounts as needed",
                      "Approve insurance documents uploaded by staff members",
                      "Create and manage services offered on the platform",
                      "View analytics and insights for your company's growth",
                      "Monitor system performance and user activities"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-600 text-sm md:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quick Stats Sidebar */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Use the sidebar to navigate between different management sections and keep your platform running smoothly.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100 text-sm">Last updated: Just now</span>
                    <div className="bg-blue-400 p-1 rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleSectionChange('users')}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-gray-700">User Management</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleSectionChange('approvals')}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                    >
                      <span className="text-gray-700">Payment Approvals</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Approvals Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Payment Approvals</h2>
                <button 
                  onClick={() => handleSectionChange('approvals')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View all
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <PaymentApproval />
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'approvals':
        return <PaymentApproval />;
      case 'services':
        return <ServiceManagement />;
      case 'analytics':
        return <AnalyticsChart />;
      default:
        return (
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold">Welcome to Admin Dashboard</h2>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Profile Image Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-2xl w-full mx-4 p-6">
            {/* Close Button */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-200 text-2xl font-bold z-10"
            >
              ×
            </button>
            
            {/* Profile Image */}
            <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt={user.name || 'Admin'}
                  className="w-full h-96 object-cover cursor-pointer"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
              )}
              
              {/* User Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h3 className="text-xl font-bold">{user?.name || 'Admin'}</h3>
                <p className="text-gray-200">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 w-64 bg-white shadow-lg h-full flex-shrink-0 border-r border-gray-200 flex flex-col
      `}>

        {/* Sidebar Header */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-base md:text-sm font-bold text-gray-800">🛡️ Vehicle Insurance Portal </h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-600 hover:text-gray-800 p-1 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Profile Section - Updated with click handler */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2 cursor-pointer" onClick={handleProfileImageClick}>
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt={user.name || 'Admin'}
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-200"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
              )}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-800 truncate max-w-full px-2">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 md:p-4 flex-1 overflow-y-auto">
          <ul className="space-y-1 md:space-y-2">
            {[
              { id: 'dashboard', label: 'Admin Dashboard', icon: '🏠' },
              { id: 'users', label: 'User Management', icon: '👥' },
              { id: 'approvals', label: 'Payment Approvals', icon: '✅' },
              { id: 'services', label: 'Service Management', icon: '⚙️' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm md:text-base group ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg transition-transform group-hover:scale-110">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {activeSection === item.id && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto min-w-0">
        <div className="container mx-auto">
          {/* Mobile Header */}
          <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              {activeSection === 'dashboard' && 'Dashboard'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'approvals' && 'Payment Approvals'}
              {activeSection === 'services' && 'Service Management'}
              {activeSection === 'analytics' && 'Analytics'}
            </h1>
            <div className="w-10"></div>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;