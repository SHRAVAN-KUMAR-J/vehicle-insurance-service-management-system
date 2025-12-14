import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import api from '../../utils/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

function AnalyticsChart() {
  const [systemAnalytics, setSystemAnalytics] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, activityRes] = await Promise.all([
        api.get(`/admin/analytics?dateRange=${dateRange}`),
        api.get(`/admin/user-activity?period=${dateRange}`)
      ]);

      setSystemAnalytics(analyticsRes.data);
      setUserActivity(activityRes.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const preparePaymentStatusData = () => {
    if (!systemAnalytics?.data?.approvalRejectionRates) return [];
    
    const rates = systemAnalytics.data.approvalRejectionRates;
    return [
      { name: 'Approved', value: rates.approved },
      { name: 'Rejected', value: rates.rejected },
      { name: 'Pending', value: rates.pending },
      { name: 'None', value: rates.none },
    ].filter(item => item.value > 0);
  };

  const prepareUserActivityData = () => {
    if (!userActivity?.data) return [];
    
    return userActivity.data.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      count: item.count,
      vehicleCount: item.vehicleActivity?.vehicleCount || 0
    }));
  };

  const prepareTimeSeriesData = () => {
    if (!systemAnalytics?.data) return [];
    
    const { userRegistrations, vehicleAdditions, insuranceCreations, serviceCompletions, paymentApprovals } = systemAnalytics.data;
    
    // Get all unique dates
    const allDates = new Set();
    [userRegistrations, vehicleAdditions, insuranceCreations, serviceCompletions, paymentApprovals].forEach(data => {
      data.forEach(item => allDates.add(item._id));
    });

    // Create combined data
    return Array.from(allDates).sort().map(date => ({
      date,
      users: userRegistrations.find(item => item._id === date)?.count || 0,
      vehicles: vehicleAdditions.find(item => item._id === date)?.count || 0,
      insurances: insuranceCreations.find(item => item._id === date)?.count || 0,
      services: serviceCompletions.find(item => item._id === date)?.count || 0,
      payments: paymentApprovals.find(item => item._id === date)?.count || 0,
    }));
  };

  const prepareTotalCountsData = () => {
    if (!systemAnalytics?.data) return [];
    const { userRegistrations, vehicleAdditions, insuranceCreations, paymentApprovals } = systemAnalytics.data;
    return [
      { name: 'Users', count: userRegistrations.reduce((sum, r) => sum + r.count, 0) },
      { name: 'Vehicles', count: vehicleAdditions.reduce((sum, r) => sum + r.count, 0) },
      { name: 'Insurances', count: insuranceCreations.reduce((sum, r) => sum + r.count, 0) },
      { name: 'Approvals', count: paymentApprovals.reduce((sum, r) => sum + r.count, 0) },
    ];
  };

  // Custom colors for Total Activities Summary
  const getBarColor = (name) => {
    switch (name) {
      case 'Users': return '#188bb9ff'; // Sky blue
      case 'Vehicles': return '#3eda26ff'; // Green
      case 'Insurances': return '#ffea00ff'; // Yellow
      case 'Approvals': return '#FF8042'; // Orange
      default: return '#8884d8';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchAllData}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">System Analytics</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Total Activities Summary Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Total Activities Summary</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareTotalCountsData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Total Count">
                  {prepareTotalCountsData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={preparePaymentStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {preparePaymentStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">User Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareUserActivityData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0088FE" name="User Count" />
                <Bar dataKey="vehicleCount" fill="#00C49F" name="Vehicle Activities" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Series Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Activity Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prepareTimeSeriesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#0088FE" fill="#0088FE" name="Users" />
                <Area type="monotone" dataKey="vehicles" stackId="1" stroke="#00C49F" fill="#00C49F" name="Vehicles" />
                <Area type="monotone" dataKey="insurances" stackId="1" stroke="#FFBB28" fill="#FFBB28" name="Insurances" />
                <Area type="monotone" dataKey="services" stackId="1" stroke="#FF8042" fill="#FF8042" name="Services" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Detailed Activity Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareTimeSeriesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#0088FE" strokeWidth={2} name="Users" />
                <Line type="monotone" dataKey="vehicles" stroke="#00C49F" strokeWidth={2} name="Vehicles" />
                <Line type="monotone" dataKey="insurances" stroke="#FFBB28" strokeWidth={2} name="Insurances" />
                <Line type="monotone" dataKey="services" stroke="#FF8042" strokeWidth={2} name="Services" />
                <Line type="monotone" dataKey="payments" stroke="#8884D8" strokeWidth={2} name="Payments" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Raw Data Tables for Debugging */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Raw Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">System Analytics</h4>
            <pre className="bg-gray-50 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(systemAnalytics, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold mb-2">User Activity</h4>
            <pre className="bg-gray-50 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(userActivity, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsChart;