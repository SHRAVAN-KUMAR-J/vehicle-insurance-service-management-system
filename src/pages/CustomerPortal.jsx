import Navbar from '../components/Common/Navbar';
import CustomerDashboard from '../components/Customer/CustomerDashboard';
import VehicleForm from '../components/Customer/VehicleForm';

function CustomerPortal() {
  const handleVehicleAdded = (vehicle) => {
    // Optionally handle vehicle added logic
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <CustomerDashboard />
        <VehicleForm onVehicleAdded={handleVehicleAdded} />
      </div>
    </div>
  );
}

export default CustomerPortal;