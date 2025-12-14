import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';
import StaffLayout from '../components/Staff/StaffLayout';
import StaffDashboard from '../components/Staff/StaffDashboard';
import CustomerList from '../components/Staff/CustomerList';
import PaymentUpload from '../components/Staff/PaymentUpload';
import RenewalQueue from '../components/Staff/RenewalQueue';
import Notifications from './Notifications';

function StaffPortal() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <StaffLayout>
        <Routes>
          <Route path="/" element={<StaffDashboard />} />
          <Route path="/customers" element={
            <div className="container mx-auto p-8">
              <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6">Customer Management</h2>
                <CustomerList />
              </div>
            </div>
          } />
          <Route path="/upload-pdf" element={
            <div className="container mx-auto p-8">
              <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6">Upload Payment PDF</h2>
                <PaymentUpload />
              </div>
            </div>
          } />
          <Route path="/renewal-queue" element={
            <div className="container mx-auto p-8">
              <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6">Renewal Queue</h2>
                <RenewalQueue />
              </div>
            </div>
          } />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </StaffLayout>
    </div>
  );
}

export default StaffPortal;