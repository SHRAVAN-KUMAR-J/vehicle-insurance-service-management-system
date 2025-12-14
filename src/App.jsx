import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ChatNotificationProvider } from './contexts/ChatNotificationContext';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';
import CustomerPortal from './pages/CustomerPortal';
import StaffPortal from './pages/StaffPortal';
import AdminPortal from './pages/AdminPortal';
import CustomerVehiclesPage from './components/Staff/CustomerVehiclesPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/Common/ProtoctedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OTPVerify from './components/Auth/OTPVerify';
import VehicleFormPage from './pages/VehicleFormPage';
import ServiceListPage from './pages/ServiceListPage';
import InsuranceListPage from './pages/InsuranceListPage';
import VehicleListPage from './pages/VehicleListPage';
import About from './pages/About';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <ChatNotificationProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<OTPVerify />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/customer" element={<ProtectedRoute roles={['customer']}><CustomerPortal /></ProtectedRoute>} />
                <Route path="/customer/add-vehicle" element={<ProtectedRoute roles={['customer']}><VehicleFormPage /></ProtectedRoute>} />
                <Route path="/customer/services" element={<ProtectedRoute roles={['customer']}><ServiceListPage /></ProtectedRoute>} />
                <Route path="/customer/insurances" element={<ProtectedRoute roles={['customer']}><InsuranceListPage /></ProtectedRoute>} />
                <Route path="/customer/vehicle-insurance-pdfs" element={<ProtectedRoute roles={['customer']}><VehicleListPage /></ProtectedRoute>} />
                
                {/* Staff routes with nested routing */}
                <Route path="/staff/*" element={<ProtectedRoute roles={['staff']}><StaffPortal /></ProtectedRoute>} />
                <Route path="/staff/customer-vehicles/:customerId" element={<ProtectedRoute roles={['staff', 'admin']}><CustomerVehiclesPage /></ProtectedRoute>} />
                
                <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPortal /></ProtectedRoute>} />
                <Route path='/about' element={<About/>}></Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </ChatNotificationProvider>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;