import Navbar from '../components/Common/Navbar';
import ServiceList from '../components/Customer/ServiceList';

function ServiceListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <ServiceList />
        </div>
      </div>
    </div>
  );
}

export default ServiceListPage;


