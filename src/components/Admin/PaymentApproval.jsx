// src/components/admin/PaymentApproval.jsx
import { useEffect, useState } from 'react';
import api from '../../utils/api';

function PaymentApproval() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [error, setError] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const res = await api.get('/insurance/pending');
      setPendingPayments(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending payments');
    }
  };

  const getCustomerName = (payment) => {
    if (payment.customerName) {
      return payment.customerName;
    }
    if (payment.vehicleId?.ownerId?.name) {
      return payment.vehicleId.ownerId.name;
    }
    return 'Customer Name Not Available';
  };

  const handleApprove = async (insuranceId) => {
    try {
      await api.put(`/insurance/approve/${insuranceId}`);
      setPendingPayments((prev) => prev.filter((p) => p._id !== insuranceId));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve payment');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    try {
      await api.put(`/insurance/approve/${selectedInsurance._id}`, { rejectionReason });
      setPendingPayments((prev) => prev.filter((p) => p._id !== selectedInsurance._id));
      setShowRejectModal(false);
      setRejectionReason('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject payment');
    }
  };

  const handleViewPDF = async (pdfUrl) => {
    try {
      if (pdfUrl) {
        const response = await fetch(pdfUrl, { method: 'HEAD' });
        if (response.ok) {
          window.open(pdfUrl, '_blank');
        } else {
          setError('Invalid PDF URL or file not accessible');
        }
      } else {
        setError('No PDF URL available');
      }
    } catch (err) {
      setError('Failed to view PDF');
    }
  };

  const openRejectModal = (payment) => {
    setSelectedInsurance(payment);
    setRejectionReason('');
    setShowRejectModal(true);
    setError('');
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedInsurance(null);
    setRejectionReason('');
    setError('');
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Document Approvals</h2>
        {error && <p className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</p>}
        
        {pendingPayments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No pending approvals</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingPayments.map((payment) => (
              <div key={payment._id} className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {payment.registrationNumber}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">{getCustomerName(payment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-yellow-600">{payment.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uploaded By:</span>
                      <span className="font-medium">{payment.paymentMarkedBy?.name || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {payment.pdfUrl && (
                    <button
                      onClick={() => handleViewPDF(payment.pdfUrl)}
                      className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      View PDF
                    </button>
                  )}
                  <button
                    onClick={() => handleApprove(payment._id)}
                    className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openRejectModal(payment)}
                    className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showRejectModal && selectedInsurance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              Reject Payment for {selectedInsurance.registrationNumber}
            </h3>
            <p className="text-gray-600 mb-2">
              Customer: {getCustomerName(selectedInsurance)}
            </p>
            {error && <p className="text-red-500 mb-4 p-2 bg-red-50 rounded">{error}</p>}
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (required)"
              className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={closeRejectModal}
                className="flex-1 bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PaymentApproval;