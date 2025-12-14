import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatDate } from '../../utils/formatDate';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
  Image,
} from '@react-pdf/renderer';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [payingVehicleId, setPayingVehicleId] = useState(null);
  const [viewReceiptVehicle, setViewReceiptVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicle/my-vehicles');
      setVehicles(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handlePayInsurance = async (vehicleId) => {
    setPayingVehicleId(vehicleId);
    setError('');
    try {
      const initiateRes = await api.post(`/vehicle/${vehicleId}/payment/initiate`);
      if (!initiateRes.data.success) {
        throw new Error(initiateRes.data.message || 'Failed to initiate payment');
      }
      const { key, orderId, amount, currency, registrationNumber, insuranceAmount } = initiateRes.data.data;
      if (!window.Razorpay) {
        alert('Payment gateway not loaded. Please refresh the page and try again.');
        setPayingVehicleId(null);
        return;
      }
      const options = {
        key,
        amount,
        currency,
        order_id: orderId,
        name: 'Vehicle Insurance Payment',
        description: `Insurance for ${registrationNumber}`,
        handler: async (response) => {
          try {
            const verifyRes = await api.post(`/vehicle/${vehicleId}/payment/verify`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            if (verifyRes.data.success) {
              const paymentData = verifyRes.data.data;
              alert('Payment Successful! Your insurance payment of ₹' + insuranceAmount + ' has been completed.');
              setVehicles(prev => prev.map(v =>
                v._id === vehicleId
                  ? { ...v, paymentStatus: 'paid', lastPayment: paymentData }
                  : v
              ));
              const updatedVehicle = vehicles.find(v => v._id === vehicleId);
              setViewReceiptVehicle({
                vehicle: { ...updatedVehicle, paymentStatus: 'paid' },
                paymentDetails: paymentData || {
                  orderId,
                  paymentId: response.razorpay_payment_id,
                  amount: insuranceAmount,
                  date: new Date().toISOString(),
                }
              });
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            alert('Payment verification failed: ' + (error.response?.data?.message || error.message));
          } finally {
            setPayingVehicleId(null);
          }
        },
        prefill: { name: '', email: '', contact: '' },
        notes: { vehicle_registration: registrationNumber },
        theme: { color: '#3399cc' },
        modal: { ondismiss: () => setPayingVehicleId(null) }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        alert('Payment failed: ' + response.error.description);
        setPayingVehicleId(null);
      });
      rzp.open();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate payment';
      alert(errorMessage);
      setError(errorMessage);
      setPayingVehicleId(null);
    }
  };

  const styles = StyleSheet.create({
    page: { padding: 40, backgroundColor: '#f8fafc', fontFamily: 'Helvetica' },
    headerSection: { textAlign: 'center', marginBottom: 30 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#475569', marginBottom: 20 },
    successBanner: {
      backgroundColor: '#dcfce7',
      padding: 16,
      borderRadius: 12,
      textAlign: 'center',
      marginBottom: 30
    },
    successText: { fontSize: 20, color: '#166534', fontWeight: 'bold' },
    congrats: { fontSize: 14, color: '#15803d', marginTop: 8 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e40af', marginBottom: 12, borderBottomWidth: 2, borderBottomColor: '#e0e7ff', paddingBottom: 6 },
    table: { width: '100%', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, overflow: 'hidden' },
    tableRow: { flexDirection: 'row', backgroundColor: '#f1f5f9' },
    tableRowAlt: { flexDirection: 'row', backgroundColor: '#ffffff' },
    tableColLabel: { width: '40%', padding: 12, fontSize: 12, fontWeight: 'bold', color: '#374151' },
    tableColValue: { width: '60%', padding: 12, fontSize: 12, color: '#111827' },
    amountHighlight: {
      backgroundColor: '#ecfdf5',
      padding: 16,
      borderRadius: 12,
      textAlign: 'center',
      marginVertical: 20
    },
    amountText: { fontSize: 24, fontWeight: 'bold', color: '#059669' },
    footer: {
      position: 'absolute',
      bottom: 40,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 10,
      color: '#64748b',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      paddingTop: 12
    }
  });

  const InsuranceReceipt = ({ vehicle, payment }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Insurance Payment Receipt</Text>
          <Text style={styles.subtitle}>SecureDrive Insurance Portal</Text>
        </View>
        <View style={styles.successBanner}>
          <Text style={styles.successText}>Payment Successful!</Text>
          <Text style={styles.congrats}>
            Congratulations! Your vehicle insurance is now active and protected.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Registration Number</Text>
              <Text style={styles.tableColValue}>{vehicle.registrationNumber}</Text>
            </View>
            <View style={styles.tableRowAlt}>
              <Text style={styles.tableColLabel}>Model & Make</Text>
              <Text style={styles.tableColValue}>{vehicle.model}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Chassis Number</Text>
              <Text style={styles.tableColValue}>{vehicle.chassisNumber || 'N/A'}</Text>
            </View>
            <View style={styles.tableRowAlt}>
              <Text style={styles.tableColLabel}>Insurance Policy Type</Text>
              <Text style={styles.tableColValue}>{vehicle.insurancePolicy || 'Comprehensive'}</Text>
            </View>
          </View>
        </View>
        {(vehicle.feature1 || vehicle.feature2 || vehicle.feature3) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.table}>
              {vehicle.feature1 && (
                <View style={styles.tableRowAlt}>
                  <Text style={styles.tableColLabel}>Insurance Company</Text>
                  <Text style={styles.tableColValue}>{vehicle.feature1}</Text>
                </View>
              )}
              {vehicle.feature2 && (
                <View style={styles.tableRow}>
                  <Text style={styles.tableColLabel}>Engine Number</Text>
                  <Text style={styles.tableColValue}>{vehicle.feature2}</Text>
                </View>
              )}
              {vehicle.feature3 && (
                <View style={styles.tableRowAlt}>
                  <Text style={styles.tableColLabel}>Maker Name</Text>
                  <Text style={styles.tableColValue}>{vehicle.feature3}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        {vehicle.startDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Policy Validity</Text>
            <View style={styles.table}>
              <View style={styles.tableRowAlt}>
                <Text style={styles.tableColLabel}>Policy Start Date</Text>
                <Text style={styles.tableColValue}>{formatDate(vehicle.startDate)}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableColLabel}>Policy Expiry Date</Text>
                <Text style={styles.tableColValue}>{formatDate(vehicle.expiryDate)}</Text>
              </View>
            </View>
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.amountHighlight}>
            <Text style={styles.amountText}>₹{vehicle.insuranceAmount?.toLocaleString()}</Text>
            <Text style={{ fontSize: 12, color: '#166534', marginTop: 4 }}>Amount Paid</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRowAlt}>
              <Text style={styles.tableColLabel}>Payment ID</Text>
              <Text style={styles.tableColValue}>{payment.paymentId || 'N/A'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Order ID</Text>
              <Text style={styles.tableColValue}>{payment.orderId || 'N/A'}</Text>
            </View>
            <View style={styles.tableRowAlt}>
              <Text style={styles.tableColLabel}>Payment Date & Time</Text>
              <Text style={styles.tableColValue}>{formatDate(payment.date || new Date(), true)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Payment Method</Text>
              <Text style={styles.tableColValue}>Razorpay (UPI / Card / Netbanking)</Text>
            </View>
          </View>
        </View>
        <Text style={styles.footer}>
          This is a system-generated receipt • SecureDrive Insurance • For support: support@securedrive.in • Helpline: +91-98765 43210{'\n'}
          Thank you for trusting us with your vehicle's safety! Drive safe.
        </Text>
      </Page>
    </Document>
  );

  if (loading) return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg min-h-[500px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your vehicles...</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">My Vehicle Insurance</h3>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}
          <div className="space-y-6">
            {vehicles.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-xl font-medium text-gray-500 mb-2">No vehicles found</p>
                <p className="text-gray-400">Add your first vehicle to get started!</p>
              </div>
            ) : (
              vehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-0 md:gap-6 p-0 md:p-6">
                    {vehicle.vehicleImage ? (
                      <div className="w-full md:w-96 h-80 md:h-96 flex-shrink-0 overflow-hidden bg-gray-100">
                        <img
                          src={vehicle.vehicleImage}
                          alt={vehicle.model}
                          className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-full md:w-96 h-80 md:h-96 flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                        <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="p-6 flex-1 space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-xl font-semibold text-gray-800">{vehicle.model}</h4>
                        <p className="text-lg font-bold text-indigo-600">{vehicle.registrationNumber}</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Chassis:</span> {vehicle.chassisNumber || 'Not set by staff'}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Insurance Policy</p>
                          <p className="text-base text-gray-900">{vehicle.insurancePolicy || 'N/A'}</p>
                          {vehicle.paymentStatus === 'paid' && (
                            <button
                              onClick={() => setViewReceiptVehicle({
                                vehicle,
                                paymentDetails: vehicle.lastPayment || {}
                              })}
                              className="w-44 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-2 my-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <span>View Receipt</span>
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Amount (₹)</p>
                          {vehicle.insuranceAmount ? (
                            <div className="space-y-2">
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                                <p className="text-xl font-bold text-green-700">
                                  ₹{vehicle.insuranceAmount.toLocaleString()}
                                </p>
                              </div>
                              {vehicle.paymentStatus === 'paid' ? (
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-3 flex items-center justify-center gap-2">
                                  <span className="text-sm font-semibold text-blue-700">Payment Completed</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handlePayInsurance(vehicle._id)}
                                  disabled={payingVehicleId === vehicle._id}
                                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                  {payingVehicleId === vehicle._id ? (
                                    <>Processing...</>
                                  ) : (
                                    <>Pay Insurance</>
                                  )}
                                </button>
                              )}
                            </div>
                          ) : (
                            <p className="text-base text-gray-500">—</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                        <div className="bg-indigo-50 p-3 rounded-lg text-center">
                          <p className="text-xs font-medium text-indigo-800 uppercase tracking-wide">Insurance Company</p>
                          <p className="text-sm text-gray-700 mt-1">{vehicle.feature1 || 'N/A'}</p>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-lg text-center">
                          <p className="text-xs font-medium text-indigo-800 uppercase tracking-wide">Engine Number</p>
                          <p className="text-sm text-gray-700 mt-1">{vehicle.feature2 || 'N/A'}</p>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-lg text-center">
                          <p className="text-xs font-medium text-indigo-800 uppercase tracking-wide">Maker Name</p>
                          <p className="text-sm text-gray-700 mt-1">{vehicle.feature3 || 'N/A'}</p>
                        </div>
                      </div>
                      {vehicle.startDate ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-green-800 uppercase tracking-wide">Start Date</p>
                            <p className="text-sm text-green-700 font-semibold mt-1">{formatDate(vehicle.startDate)}</p>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-red-800 uppercase tracking-wide">Expiry Date</p>
                            <p className="text-sm text-red-700 font-semibold mt-1">{formatDate(vehicle.expiryDate)}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-center">
                          <p className="text-orange-800 font-semibold mb-1">Insurance dates not set yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {viewReceiptVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Insurance Payment Receipt</h3>
              <div className="flex gap-3">
                <PDFDownloadLink
                  document={<InsuranceReceipt vehicle={viewReceiptVehicle.vehicle} payment={viewReceiptVehicle.paymentDetails} />}
                  fileName={`receipt_${viewReceiptVehicle.vehicle.registrationNumber}.pdf`}
                >
                  {({ loading }) => (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2">
                      {loading ? 'Preparing...' : 'Download Receipt'}
                    </button>
                  )}
                </PDFDownloadLink>
                <button
                  onClick={() => setViewReceiptVehicle(null)}
                  className="text-gray-500 hover:text-gray-700 text-3xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <PDFViewer width="100%" height="100%" className="rounded-b-2xl">
                <InsuranceReceipt vehicle={viewReceiptVehicle.vehicle} payment={viewReceiptVehicle.paymentDetails} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VehicleList;