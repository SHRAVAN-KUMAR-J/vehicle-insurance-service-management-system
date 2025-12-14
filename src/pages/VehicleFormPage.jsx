// VehicleFormPage.jsx
import VehicleForm from '../components/Customer/VehicleForm';
import { useNavigate } from 'react-router-dom';

function VehicleFormPage() {
  const navigate = useNavigate();
  const handleVehicleAdded = () => {
    navigate('/customer', { state: { message: 'Vehicle added successfully!' } });
  };
  return (
    <VehicleForm onVehicleAdded={handleVehicleAdded} />
  );
}

export default VehicleFormPage;