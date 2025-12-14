import { useEffect, useState } from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi'; // Replaced FiEye with FiFileText for PDF icon
import api from '../../utils/api';

function InsuranceList() {
  const [insurances, setInsurances] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    try {
      const res = await api.get('/insurance/my-insurances');
      setInsurances(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch insurances');
    }
  };

  // Opens PDF in new tab for viewing
  const handleViewPDF = async (pdfUrl) => {
    if (!pdfUrl) {
      setError('No PDF URL available');
      return;
    }
    try {
      const response = await fetch(pdfUrl, { method: 'HEAD' });
      if (response.ok) {
        window.open(pdfUrl, '_blank');
      } else {
        setError('Invalid PDF URL or file not accessible');
      }
    } catch {
      setError('Failed to open PDF');
    }
  };

  // Triggers direct download of backend PDF
  const handleDownload = async (pdfUrl) => {
    if (!pdfUrl) {
      setError('No PDF URL available');
      return;
    }
    try {
      const headResponse = await fetch(pdfUrl, { method: 'HEAD' });
      if (!headResponse.ok) {
        setError('Invalid PDF URL or file not accessible');
        return;
      }

      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('Failed to fetch PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfUrl.split('/').pop() || `insurance_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Failed to download PDF');
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="text-lg font-bold mb-3">My Approved Insurance PDF</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        {insurances.length === 0 ? (
          <p className="text-gray-500">No insurances found.</p>
        ) : (
          insurances.map((insurance) => (
            <div
              key={insurance._id}
              className="border p-4 rounded bg-gray-50 hover:shadow-md transition-all"
            >
              <p><strong>Vehicle:</strong> {insurance.registrationNumber}</p>
              <p><strong>Status:</strong> {insurance.paymentStatus}</p>
              {insurance.paymentStatus === 'approved' && (
                <div className="mt-3 flex items-center gap-3">
                  {/* View PDF Button */}
                  <button
                    onClick={() => handleViewPDF(insurance.pdfUrl)}
                    className="flex items-center gap-2 bg-sky-400 text-white px-3 py-2 rounded hover:bg-sky-500"
                  >
                    <FiFileText size={18} />
                    <span>View PDF</span>
                  </button>
                  {/* Direct File Download Button */}
                  <button
                    onClick={() => handleDownload(insurance.pdfUrl)}
                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  >
                    <FiDownload size={18} />
                    <span>Download PDF</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default InsuranceList;