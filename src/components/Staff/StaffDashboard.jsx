import { useAuth } from '../../hooks/useAuth';
import {
  FaUsers,
  FaFileUpload,
  FaSync,
  FaComments,
  FaShieldAlt,
  FaHandshake,
  FaUserCog,
  FaClipboardCheck,
  FaHistory,
} from 'react-icons/fa';

function StaffDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 mb-8 text-center border border-blue-100">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome Back Our Staff, {user?.name}!
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto px-2">
            As a valued staff member, you are the operational backbone of our Vehicle Insurance System.
            Your dedication ensures seamless customer experiences and efficient insurance processing.
          </p>
        </div>

        {/* Role Explanation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Customer Management */}
          <div className="group bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-blue-100 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="bg-blue-100 p-3 rounded-xl mr-4 shadow-sm">
                <FaUsers className="text-blue-600 text-xl sm:text-2xl" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Customer & Vehicle Management
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              You manage customer vehicle records, verify details, and ensure all vehicle information
              is accurate. When customers add new vehicles or request insurance, you're the first point
              of contact for validation.
            </p>
          </div>

          {/* Payment Processing */}
          <div className="group bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-green-100 hover:border-green-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="bg-green-100 p-3 rounded-xl mr-4 shadow-sm">
                <FaFileUpload className="text-green-600 text-xl sm:text-2xl" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Payment Document Processing
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              You upload payment PDF documents for insurance verification and set policy start/end dates.
              Each payment proof you process moves the insurance application forward for admin approval.
            </p>
          </div>

          {/* Insurance Renewals */}
          <div className="group bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-amber-100 hover:border-amber-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="bg-amber-100 p-3 rounded-xl mr-4 shadow-sm">
                <FaHistory className="text-amber-600 text-xl sm:text-2xl" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Insurance Renewal Management
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              You handle the renewal queue, ensuring policies are updated before expiration. Your attention
              to renewal dates and timely processing prevents lapses in customer coverage.
            </p>
          </div>

          {/* Customer Support */}
          <div className="group bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-purple-100 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="bg-purple-100 p-3 rounded-xl mr-4 shadow-sm">
                <FaComments className="text-purple-600 text-xl sm:text-2xl" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Customer Communication & Support
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Through the chat system, you provide real-time support to customers, answer queries about
              their policies, and update admins on pending tasks.
            </p>
          </div>

          {/* Insurance Operations */}
          <div className="group bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-red-100 hover:border-red-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="bg-red-100 p-3 rounded-xl mr-4 shadow-sm">
                <FaClipboardCheck className="text-red-600 text-xl sm:text-2xl" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Insurance Operations Coordination
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              You work closely with admins who approve/reject payments and manage user accounts.
              Your accurate document uploads enable admins to make informed decisions.
            </p>
          </div>

          {/* System Collaboration */}
          <div className="group bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-cyan-100 hover:border-cyan-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="bg-cyan-100 p-3 rounded-xl mr-4 shadow-sm">
                <FaHandshake className="text-cyan-600 text-xl sm:text-2xl" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                System Collaboration & Updates
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              You receive notifications for new customer requests and admin decisions, keeping you
              informed at every step. Your role ensures the entire insurance process operates efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
