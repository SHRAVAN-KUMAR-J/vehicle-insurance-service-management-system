import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FaCar, FaUserCircle, FaHeadset } from 'react-icons/fa';
import { MdBuild, MdAssignment, MdPictureAsPdf } from 'react-icons/md';
import { FaWhatsapp, FaComments } from 'react-icons/fa';

function CustomerDashboard() {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Add Vehicle',
      description: 'Register a new vehicle to your account',
      icon: <FaCar className="text-2xl" />,
      path: '/customer/add-vehicle',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'My Insurances',
      description: 'View and manage your insurance policies',
      icon: <MdAssignment className="text-2xl" />,
      path: '/customer/vehicle-insurance-pdfs',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Insurance PDFs',
      description: 'Download your insurance documents',
      icon: <MdPictureAsPdf className="text-2xl" />,
      path: '/customer/insurances',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Services',
      description: 'Book and track vehicle services',
      icon: <MdBuild className="text-2xl" />,
      path: '/customer/services',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome to your insurance portal</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaUserCircle className="text-2xl text-gray-400" />
                <span className="font-medium text-gray-700">{user?.name || 'Customer'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 lg:p-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'Customer'}! 👋
              </h2>
              <p className="text-blue-100 max-w-2xl">
                Manage your vehicle insurance policies, track services, and access important 
                documents—all in one place. Stay protected with timely reminders and expert support.
              </p>
            </div>
            <div className="flex space-x-3">
               <Link to="/about">
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
          About Us
        </button>
      </Link>
      <Link to="/profile">
        <button className="border border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition">
          View Profile
        </button>
      </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className={`${action.color} text-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    {action.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{action.title}</h4>
                    <p className="text-white text-opacity-90 text-sm">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Need Help Section */}
       <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white">
      <h4 className="font-bold text-lg mb-2">Need Help?</h4>
      <p className="text-gray-300 text-sm mb-2">
        Our support team is here to help you with any questions about your policies or services.
      </p>
      <p className="text-gray-300 text-sm mb-4">
        Reach out to us anytime for personalized assistance or to learn more about our offerings.
      </p>
      <div className="flex space-x-3 mt-5">
        {/* Contact Support via WhatsApp */}
        <a
          href="https://wa.me/917034729147"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center bg-white text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-100 transition text-sm"
        >
          <FaWhatsapp className="mr-2 size={24}" />
          Contact Support
        </a>

        {/* Live Chat */}
        <Link
          to="/chat"
          className="flex-1 flex items-center justify-center border border-gray-400 text-white py-3  rounded-lg font-medium hover:bg-gray-700 transition text-sm"
        >
          <FaComments className="mr-2 size={24}" />
          Live Chat to Staffs
        </Link>
      </div>
    </div>

          {/* Chat to Staff Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h4 className="font-bold text-gray-900 text-lg mb-4">Chat with Our Staff</h4>
            <p className="text-gray-600 text-sm mb-4">
              Our dedicated customer support team is available to assist you with any inquiries 
              regarding your vehicle insurance policies, claims, or services. Get instant help 
              through our live chat feature or schedule a callback at your convenience.
            </p>
            <p className="text-gray-600 text-sm">
              We're committed to providing you with the best service experience and ensuring 
              all your insurance needs are met promptly and efficiently.
            </p>
          </div>
        </div>

        {/* Add Vehicle Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Add a New Vehicle?</h3>
              <p className="text-gray-600">
                Register your vehicle to get insurance coverage and access our premium services.
              </p>
            </div>
            {/* <Link
              to="/customer/add-vehicle"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition inline-flex items-center space-x-2"
            >
              <FaCar className="text-lg" />
              <span>Add Vehicle Now</span>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;