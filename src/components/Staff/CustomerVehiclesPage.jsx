import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { formatDate } from '../../utils/formatDate';
import Navbar from '../../components/Common/Navbar';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image as PDFImage,
} from '@react-pdf/renderer';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

const receiptStyles = StyleSheet.create({
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
  vehicleImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 20 },
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
    <Page size="A4" style={receiptStyles.page}>
      <View style={receiptStyles.headerSection}>
        <Text style={receiptStyles.title}>Insurance Payment Receipt</Text>
        <Text style={receiptStyles.subtitle}>SecureDrive Insurance Portal</Text>
      </View>
      <View style={receiptStyles.successBanner}>
        <Text style={receiptStyles.successText}>Payment Successful!</Text>
        <Text style={receiptStyles.congrats}>
          Congratulations! Insurance for {vehicle.registrationNumber} is now active.
        </Text>
      </View>
      {vehicle.vehicleImage && (
        <PDFImage src={vehicle.vehicleImage} style={receiptStyles.vehicleImage} />
      )}
      <View style={receiptStyles.section}>
        <Text style={receiptStyles.sectionTitle}>Vehicle Details</Text>
        <View style={receiptStyles.table}>
          <View style={receiptStyles.tableRow}>
            <Text style={receiptStyles.tableColLabel}>Registration Number</Text>
            <Text style={receiptStyles.tableColValue}>{vehicle.registrationNumber}</Text>
          </View>
          <View style={receiptStyles.tableRowAlt}>
            <Text style={receiptStyles.tableColLabel}>Model & Make</Text>
            <Text style={receiptStyles.tableColValue}>{vehicle.model}</Text>
          </View>
          <View style={receiptStyles.tableRow}>
            <Text style={receiptStyles.tableColLabel}>Chassis Number</Text>
            <Text style={receiptStyles.tableColValue}>{vehicle.chassisNumber || 'N/A'}</Text>
          </View>
          <View style={receiptStyles.tableRowAlt}>
            <Text style={receiptStyles.tableColLabel}>Insurance Policy Type</Text>
            <Text style={receiptStyles.tableColValue}>{vehicle.insurancePolicy || 'Comprehensive'}</Text>
          </View>
        </View>
      </View>

      {(vehicle.feature1 || vehicle.feature2 || vehicle.feature3) && (
        <View style={receiptStyles.section}>
          <Text style={receiptStyles.sectionTitle}>Additional Information</Text>
          <View style={receiptStyles.table}>
            {vehicle.feature1 && (
              <View style={receiptStyles.tableRowAlt}>
                <Text style={receiptStyles.tableColLabel}>Insurance Company</Text>
                <Text style={receiptStyles.tableColValue}>{vehicle.feature1}</Text>
              </View>
            )}
            {vehicle.feature2 && (
              <View style={receiptStyles.tableRow}>
                <Text style={receiptStyles.tableColLabel}>Engine Number</Text>
                <Text style={receiptStyles.tableColValue}>{vehicle.feature2}</Text>
              </View>
            )}
            {vehicle.feature3 && (
              <View style={receiptStyles.tableRowAlt}>
                <Text style={receiptStyles.tableColLabel}>Maker Name</Text>
                <Text style={receiptStyles.tableColValue}>{vehicle.feature3}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {vehicle.startDate && (
        <View style={receiptStyles.section}>
          <Text style={receiptStyles.sectionTitle}>Policy Validity</Text>
          <View style={receiptStyles.table}>
            <View style={receiptStyles.tableRowAlt}>
              <Text style={receiptStyles.tableColLabel}>Policy Start Date</Text>
              <Text style={receiptStyles.tableColValue}>{formatDate(vehicle.startDate)}</Text>
            </View>
            <View style={receiptStyles.tableRow}>
              <Text style={receiptStyles.tableColLabel}>Policy Expiry Date</Text>
              <Text style={receiptStyles.tableColValue}>{formatDate(vehicle.expiryDate)}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={receiptStyles.section}>
        <Text style={receiptStyles.sectionTitle}>Payment Summary</Text>
        <View style={receiptStyles.amountHighlight}>
          <Text style={receiptStyles.amountText}>₹{vehicle.insuranceAmount?.toLocaleString()}</Text>
          <Text style={{ fontSize: 12, color: '#166534', marginTop: 4 }}>Amount Paid Successfully</Text>
        </View>
        <View style={receiptStyles.table}>
          <View style={receiptStyles.tableRowAlt}>
            <Text style={receiptStyles.tableColLabel}>Payment ID</Text>
            <Text style={receiptStyles.tableColValue}>{payment?.paymentId || 'N/A'}</Text>
          </View>
          <View style={receiptStyles.tableRow}>
            <Text style={receiptStyles.tableColLabel}>Order ID</Text>
            <Text style={receiptStyles.tableColValue}>{payment?.orderId || 'N/A'}</Text>
          </View>
          <View style={receiptStyles.tableRowAlt}>
            <Text style={receiptStyles.tableColLabel}>Payment Date & Time</Text>
            <Text style={receiptStyles.tableColValue}>{formatDate(payment?.date || new Date(), true)}</Text>
          </View>
          <View style={receiptStyles.tableRow}>
            <Text style={receiptStyles.tableColLabel}>Payment Method</Text>
            <Text style={receiptStyles.tableColValue}>Razorpay (UPI / Card / Netbanking)</Text>
          </View>
        </View>
      </View>

      <Text style={receiptStyles.footer}>
        This is a system-generated receipt • SecureDrive Insurance • For support: support@securedrive.in • Helpline: +91-98765 43210{'\n'}
        Thank you for keeping vehicles safe on the road! Drive responsibly.
      </Text>
    </Page>
  </Document>
);

function CustomerVehiclesPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [insuranceDates, setInsuranceDates] = useState({
    startDate: '',
    expiryDate: '',
    insuranceAmount: ''
  });
  const [submittingDates, setSubmittingDates] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicleForEdit, setSelectedVehicleForEdit] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [vehicleFormData, setVehicleFormData] = useState({
    registrationNumber: '',
    chassisNumber: '',
    model: '',
    insurancePolicy: '',
    insuranceAmount: '',
    vehicleImage: '',
    feature1: '',
    feature2: '',
    feature3: '',
  });
  const [submittingVehicle, setSubmittingVehicle] = useState(false);

  useEffect(() => {
    fetchCustomerVehicles();
  }, [customerId]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchCustomerVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/vehicle/customer/${customerId}`);
      setVehicles(res.data.data);
      if (res.data.data.length > 0) {
        setCustomer(res.data.data[0].ownerId);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDates = (vehicle) => {
    setSelectedVehicle(vehicle);
    setInsuranceDates({
      startDate: vehicle.startDate ? new Date(vehicle.startDate).toISOString().split('T')[0] : '',
      expiryDate: vehicle.expiryDate ? new Date(vehicle.expiryDate).toISOString().split('T')[0] : '',
      insuranceAmount: vehicle.insuranceAmount || ''
    });
    setShowModal(true);
  };

  const handleSubmitDates = async (e) => {
    e.preventDefault();
    setSubmittingDates(true);
    try {
      const res = await api.put(`/vehicle/${selectedVehicle._id}/insurance-dates`, insuranceDates);
      setVehicles(vehicles.map(v => v._id === selectedVehicle._id ? res.data.data : v));
      setSuccess('Insurance dates set successfully!');
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set insurance dates');
    } finally {
      setSubmittingDates(false);
    }
  };

  const handleViewReceipt = (vehicle) => {
    setReceiptData({
      vehicle,
      paymentDetails: vehicle.lastPayment || {}
    });
    setShowReceiptModal(true);
  };

  const handleAddVehicle = () => {
    setVehicleFormData({
      registrationNumber: '',
      chassisNumber: '',
      model: '',
      insurancePolicy: '',
      insuranceAmount: '',
      vehicleImage: '',
      feature1: '',
      feature2: '',
      feature3: '',
    });
    setShowAddModal(true);
  };

  const handleEditVehicle = (vehicle) => {
    setVehicleFormData({
      registrationNumber: vehicle.registrationNumber,
      chassisNumber: vehicle.chassisNumber || '',
      model: vehicle.model,
      insurancePolicy: vehicle.insurancePolicy || '',
      insuranceAmount: vehicle.insuranceAmount || '',
      vehicleImage: vehicle.vehicleImage || '',
      feature1: vehicle.feature1 || '',
      feature2: vehicle.feature2 || '',
      feature3: vehicle.feature3 || '',
    });
    setSelectedVehicleForEdit(vehicle);
    setShowEditModal(true);
  };

  const handleSubmitVehicle = async (e) => {
    e.preventDefault();
    setSubmittingVehicle(true);
    try {
      let payload = { ...vehicleFormData };
      if (!showEditModal) {
        payload.customerId = customerId;
      }
      let res;
      if (showEditModal && selectedVehicleForEdit) {
        res = await api.put(`/vehicle/${selectedVehicleForEdit._id}`, payload);
        setVehicles(vehicles.map(v => v._id === selectedVehicleForEdit._id ? res.data.data : v));
        setSuccess('Vehicle updated successfully!');
      } else {
        res = await api.post('/vehicle', payload);
        setVehicles([...vehicles, res.data.data]);
        setSuccess('Vehicle added successfully!');
      }
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setSubmittingVehicle(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) return;
    try {
      await api.delete(`/vehicle/${vehicleId}`);
      setVehicles(vehicles.filter(v => v._id !== vehicleId));
      setSuccess('Vehicle deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  const closeDatesModal = () => {
    setShowModal(false);
    setSelectedVehicle(null);
    setInsuranceDates({ startDate: '', expiryDate: '', insuranceAmount: '' });
  };

  const closeVehicleModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedVehicleForEdit(null);
    setVehicleFormData({
      registrationNumber: '',
      chassisNumber: '',
      model: '',
      insurancePolicy: '',
      insuranceAmount: '',
      vehicleImage: '',
      feature1: '',
      feature2: '',
      feature3: '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-4">
          <p>Loading customer vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/staff')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>
        {customer && (
          <div className="bg-white rounded-2xl shadow-lg mb-8 p-8 border border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Customer: {customer.name}</h2>
                <p className="text-gray-600 mt-1"><strong>Email:</strong> {customer.email}</p>
                <p className="text-gray-600"><strong>Mobile:</strong> <a href={`tel:${customer.mobile}`} className="text-blue-600 hover:text-blue-800 font-medium">{customer.mobile}</a></p>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Customer Vehicles</h3>
            <div className="flex gap-4">
              <button
                onClick={handleAddVehicle}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add New Vehicle</span>
              </button>
              <button
                onClick={fetchCustomerVehicles}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}
          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h4>
              <p className="text-gray-500">Get started by adding a new vehicle for this customer.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden"
                >
                  <div className={`p-6 ${vehicle.vehicleImage ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 items-start' : 'space-y-6'}`}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold text-gray-900">{vehicle.model}</h4>
                        <p className="text-2xl font-semibold text-blue-600">{vehicle.registrationNumber}</p>
                        <p className="text-gray-600"><strong>Chassis:</strong> {vehicle.chassisNumber || 'Not set'}</p>
                        <p className="text-gray-600"><strong>Policy:</strong> {vehicle.insurancePolicy || 'N/A'}</p>
                        <p className="text-gray-600"><strong>Amount:</strong> ₹{vehicle.insuranceAmount ? vehicle.insuranceAmount.toLocaleString() : 'Not set'}</p>
                        <p className="text-sm text-gray-500"><strong>Added By:</strong> {vehicle.createdBy ? `${vehicle.createdBy.name} (${vehicle.createdBy.role})` : 'N/A'}</p>
                      </div>
                      {vehicle.paymentStatus === 'paid' ? (
                        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 shadow-sm">
                          <div className="flex-shrink-0">
                            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-emerald-900">Payment Completed</h3>
                            <p className="text-sm text-emerald-700 mt-0.5">Insurance payment successful</p>
                          </div>
                        </div>
                      ) : vehicle.insuranceAmount ? (
                        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm">
                          <div className="flex-shrink-0">
                            <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-amber-900">Payment Pending</h3>
                            <p className="text-sm text-amber-700 mt-0.5">Awaiting payment confirmation</p>
                          </div>
                        </div>
                      ) : null}
                      {vehicle.startDate && vehicle.expiryDate ? (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                          <h5 className="font-semibold text-blue-800 mb-3">Insurance Coverage</h5>
                          <div className="space-y-2 text-sm">
                            <p className="text-green-600"><strong>Starts:</strong> {formatDate(vehicle.startDate)}</p>
                            <p className="text-red-600"><strong>Expires:</strong> {formatDate(vehicle.expiryDate)}</p>
                            <p className="text-gray-600"><strong>Set By:</strong> {vehicle.insuranceSetBy?.name || 'Staff'}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                          <h5 className="font-semibold text-orange-800 mb-2">Pending Setup</h5>
                          <p className="text-sm text-orange-700">Insurance dates not set. Click below to configure.</p>
                        </div>
                      )}
                    </div>
                    {vehicle.vehicleImage ? (
                      <div className="flex flex-col space-y-4">
                        <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-inner">
                          <img
                            src={vehicle.vehicleImage}
                            alt={vehicle.model}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {(vehicle.feature1 || vehicle.feature2 || vehicle.feature3) && (
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <h5 className="font-semibold text-gray-800 mb-3">Additional Details</h5>
                            <div className="grid grid-cols-1 gap-3 text-sm">
                              {vehicle.feature1 && (
                                <p className="text-gray-700">
                                  <span className="font-semibold text-red-400">Insurance Company :</span>{' '}
                                  • {vehicle.feature1}
                                </p>
                              )}
                              {vehicle.feature2 && (
                                <p className="text-gray-700">
                                  <span className="font-semibold text-gray-600">Engine Number :</span>{' '}
                                  • {vehicle.feature2}
                                </p>
                              )}
                              {vehicle.feature3 && (
                                <p className="text-gray-700">
                                  <span className="font-semibold text-green-500">Maker Name :</span>{' '}
                                  • {vehicle.feature3}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600 text-center">No image uploaded</p>
                        {(vehicle.feature1 || vehicle.feature2 || vehicle.feature3) && (
                          <div className="bg-gray-50 p-4 rounded-xl mt-4">
                            <h5 className="font-semibold text-gray-800 mb-3">Additional Details</h5>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              {vehicle.feature1 && <p className="text-gray-700"><span className="font-semibold">Insurance Company:</span> {vehicle.feature1}</p>}
                              {vehicle.feature2 && <p className="text-gray-700"><span className="font-semibold">Engine Number:</span> {vehicle.feature2}</p>}
                              {vehicle.feature3 && <p className="text-gray-700"><span className="font-semibold">Maker Name:</span> {vehicle.feature3}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="px-6 pb-6 pt-0">
                    <div className="flex flex-wrap gap-3 justify-start">
                      <button
                        onClick={() => handleSetDates(vehicle)}
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{vehicle.startDate ? 'Update Insurance Dates' : 'Set Insurance Dates'}</span>
                      </button>
                      <button
                        onClick={() => handleEditVehicle(vehicle)}
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>Edit Vehicle</span>
                      </button>
                      {vehicle.paymentStatus === 'paid' && (
                        <button
                          onClick={() => handleViewReceipt(vehicle)}
                          className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-2m3 2v-2m-9-4h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                          </svg>
                          <span>View Receipt</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteVehicle(vehicle._id)}
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && selectedVehicle && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeDatesModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Insurance Dates for {selectedVehicle.registrationNumber}</h3>
                  <button onClick={closeDatesModal} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                <form onSubmit={handleSubmitDates} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={insuranceDates.startDate}
                      onChange={(e) => setInsuranceDates({ ...insuranceDates, startDate: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={insuranceDates.expiryDate}
                      onChange={(e) => setInsuranceDates({ ...insuranceDates, expiryDate: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Insurance Amount (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={insuranceDates.insuranceAmount}
                      onChange={(e) => setInsuranceDates({ ...insuranceDates, insuranceAmount: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                      placeholder="e.g., 15000"
                    />
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Setting expiry date will trigger automatic renewal reminders.
                    </p>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={submittingDates}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {submittingDates ? 'Setting...' : 'Set Dates'}
                    </button>
                    <button
                      type="button"
                      onClick={closeDatesModal}
                      disabled={submittingDates}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {(showAddModal || showEditModal) && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeVehicleModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {showEditModal ? 'Edit Vehicle' : 'Add New Vehicle'}
                  </h3>
                  <button onClick={closeVehicleModal} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                <form onSubmit={handleSubmitVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={vehicleFormData.registrationNumber}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, [e.target.name]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Chassis Number</label>
                    <input
                      type="text"
                      name="chassisNumber"
                      value={vehicleFormData.chassisNumber}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, [e.target.name]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Model</label>
                    <input
                      type="text"
                      name="model"
                      value={vehicleFormData.model}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, [e.target.name]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Image URL</label>
                    <input
                      type="url"
                      name="vehicleImage"
                      value={vehicleFormData.vehicleImage}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, [e.target.name]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Insurance Policy</label>
                    <input
                      type="text"
                      name="insurancePolicy"
                      value={vehicleFormData.insurancePolicy}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, [e.target.name]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Insurance Amount (₹)</label>
                    <input
                      type="number"
                      name="insuranceAmount"
                      value={vehicleFormData.insuranceAmount}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, [e.target.name]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Insurance Company</label>
                    <input
                      type="text"
                      name="feature1"
                      value={vehicleFormData.feature1}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, [e.target.name]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Engine Number</label>
                    <input
                      type="text"
                      name="feature2"
                      value={vehicleFormData.feature2}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, [e.target.name]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Maker Name</label>
                    <input
                      type="text"
                      name="feature3"
                      value={vehicleFormData.feature3}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, [e.target.name]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={submittingVehicle}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {submittingVehicle ? 'Saving...' : (showEditModal ? 'Update' : 'Add')}
                    </button>
                    <button
                      type="button"
                      onClick={closeVehicleModal}
                      disabled={submittingVehicle}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Insurance Payment Receipt</h3>
              <div className="flex gap-3">
                <PDFDownloadLink
                  document={<InsuranceReceipt vehicle={receiptData.vehicle} payment={receiptData.paymentDetails} />}
                  fileName={`receipt_${receiptData.vehicle.registrationNumber}.pdf`}
                >
                  {({ loading }) => (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {loading ? 'Preparing...' : 'Download Receipt'}
                    </button>
                  )}
                </PDFDownloadLink>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-3xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <PDFViewer width="100%" height="100%" className="rounded-b-2xl">
                <InsuranceReceipt vehicle={receiptData.vehicle} payment={receiptData.paymentDetails} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerVehiclesPage;