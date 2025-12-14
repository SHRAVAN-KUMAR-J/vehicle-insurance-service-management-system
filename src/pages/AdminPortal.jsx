import Navbar from '../components/Common/Navbar';
import AdminDashboard from '../components/Admin/AdminDashboard';

function AdminPortal() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <AdminDashboard />
      </div>
    </div>
  );
}

export default AdminPortal;