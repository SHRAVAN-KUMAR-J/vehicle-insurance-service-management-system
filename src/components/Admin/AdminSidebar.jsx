function AdminSidebar({ activeSection, onSectionChange }) {
  const menuItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: '🏠' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'approvals', label: 'Payment Approvals', icon: '✅' },
    { id: 'services', label: 'Service Management', icon: '⚙️' },
    { id: 'analytics', label: 'Analytics & Charts', icon: '📈' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default AdminSidebar;