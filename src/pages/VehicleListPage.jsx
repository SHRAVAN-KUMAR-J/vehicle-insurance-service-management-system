import Navbar from '../components/Common/Navbar';
import VehicleList from '../components/Customer/VehicleList';

function VehicleListPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4"> Vehicle Insurances </h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <VehicleList />
        </div>
      </div>
    </div>
  );
}

export default VehicleListPage;