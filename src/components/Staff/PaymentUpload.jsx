// staff/PaymentUpload.jsx
import { useState, useEffect } from 'react';
import { FaCar, FaUser, FaFilePdf, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import api from '../../utils/api';
import { formatDate } from '../../utils/formatDate';

function PaymentUpload() {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [myUploads, setMyUploads] = useState([]);

  useEffect(() => {
    fetchMyUploads();
  }, []);

  const fetchMyUploads = async () => {
    try {
      const res = await api.get('/insurance/my-uploads');
      setMyUploads(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your uploads');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('registrationNumber', registrationNumber);
    formData.append('pdf', file);

    try {
      const res = await api.post('/insurance/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      setError('');
      setRegistrationNumber('');
      setFile(null);
      fetchMyUploads();
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.message || 'Failed to upload payment PDF');
    }
  };

  const handleViewPDF = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const getCustomerName = (upload) => {
    if (upload.customerName) return upload.customerName;
    if (upload.vehicleId?.ownerId?.name) return upload.vehicleId.ownerId.name;
    return 'Customer Name Not Available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-green-600 inline mr-1" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-600 inline mr-1" />;
      default:
        return <FaClock className="text-yellow-600 inline mr-1" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Upload Payment PDF</h3>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-4 rounded shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <label className="w-full md:w-1/4 text-sm font-medium">Registration Number</label>
          <input
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
            className="w-full md:w-3/4 p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <label className="w-full md:w-1/4 text-sm font-medium">PDF File</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full md:w-3/4 p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-500 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Upload PDF
        </button>
      </form>

      {/* Uploaded Payments Section */}
      <div>
        <h4 className="text-xl font-semibold mb-4 text-gray-800">Your Uploaded Payments</h4>
        {myUploads.length === 0 ? (
          <p className="text-gray-500">No uploads yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {myUploads.map((upload) => (
              <div
                key={upload._id}
                className="flex flex-col p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition"
              >
                <div className="flex items-center mb-2">
                  <FaCar className="text-blue-500 mr-2" />
                  <p className="font-semibold text-gray-700">{upload.registrationNumber}</p>
                </div>

                <div className="flex items-center mb-2">
                  <FaUser className="text-green-500 mr-2" />
                  <p className="text-gray-700">{getCustomerName(upload)}</p>
                </div>

                <div className="flex items-center mb-2">
                  {getStatusIcon(upload.paymentStatus)}
                  <p className={`font-semibold ${getStatusColor(upload.paymentStatus)}`}>
                    {upload.paymentStatus.toUpperCase()}
                  </p>
                  {upload.paymentStatus === 'approved' && upload.approvedBy && (
                    <span className="ml-2 text-gray-500 text-sm">
                      by {upload.approvedBy.name} on {formatDate(upload.approvedAt)}
                    </span>
                  )}
                  {upload.paymentStatus === 'rejected' && upload.rejectedBy && (
                    <span className="ml-2 text-gray-500 text-sm">
                      ({upload.rejectionReason}) by {upload.rejectedBy.name} on {formatDate(upload.rejectedAt)}
                    </span>
                  )}
                </div>

                {upload.pdfUrl && (
                  <button
                    onClick={() => handleViewPDF(upload.pdfUrl)}
                    className="flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 font-medium p-2 rounded mt-2 transition"
                  >
                    <FaFilePdf className="mr-2" /> View PDF
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentUpload;
