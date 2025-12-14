import Navbar from '../components/Common/Navbar';
import InsuranceList from '../components/Customer/InsuranceList';

function InsuranceListPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">My Insurance PDF</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <InsuranceList />
        </div>
      </div>
    </div>
  );
}

export default InsuranceListPage;