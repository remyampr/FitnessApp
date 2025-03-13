import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AlertError } from "../../components/shared/AlertError";

// Helper function to get month name
const getMonthName = (monthIndex) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthIndex];
};

export const TrainerRevenuePage = () => {
  const dispatch = useDispatch();
  const { revenue, revenueHistory, paymentHistory, loading, error } =
    useSelector((state) => state.trainer);

  console.log("Inside revnue page : revenue :", revenue);
  console.log("Inside revnue page : revenueHistory :", revenueHistory);
  console.log("Inside revnue page : paymentHistory :", paymentHistory);

  // Format revenue history data for charts
  const formatRevenueData = () => {
    return revenueHistory.map((item) => ({
      month: `${getMonthName(item.month)} ${item.year}`,
      revenue: item.revenue,
      clients: item.clientCount,
    }));
  };

  const chartData = formatRevenueData();

  // Calculate stats
  const calculateStats = () => {
    if (revenueHistory.length === 0) {
      return { average: 0, highest: 0, highestMonth: "", total: 0 };
    }

    const total = revenueHistory.reduce((sum, month) => sum + month.revenue, 0);
    const average = total / revenueHistory.length;

    const highest = Math.max(...revenueHistory.map((month) => month.revenue));
    const highestMonth = find((month) => month.revenue === highest);

    return {
      average: average.toFixed(2),
      highest,
      highestMonth: highestMonth
        ? `${getMonthName(highestMonth.month)} ${highestMonth.year}`
        : "",
      total: revenue.totalRevenue || total,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <AlertError
        error={"Error loading revenue data. Please try again later."}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 bg-base-200 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Revenue Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="stat bg-base-100 shadow rounded-box">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value text-primary">₹{stats.total}</div>
          <div className="stat-desc">All time earnings</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-box">
          <div className="stat-title">Average Monthly</div>
          <div className="stat-value text-secondary">₹{stats.average}</div>
          <div className="stat-desc">Per month average</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-box">
          <div className="stat-title">Your Share</div>
          <div className="stat-value text-info">
            {revenue?.trainerSharePercentage || 30}%
          </div>
          <div className="stat-desc">Of total revenue</div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-base-100 rounded-box shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Revenue Trends</h2>
        <div className="h-72">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No revenue data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-base-100 rounded-box shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount (₹)</th>
                <th>Trainer Share (₹)</th>
                <th>Plan</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory && paymentHistory.length > 0 ? (
                paymentHistory.map((payment, index) => (
                  <tr key={index}>
                    <td className="break-all">{payment.transactionId}</td>
                    <td>₹{payment.amount}</td>
                    <td>₹{payment.trainerShare}</td>
                    <td>{payment.plan}</td>
                    <td>{new Date(payment.startDate).toLocaleDateString()}</td>
                    <td>{new Date(payment.endDate).toLocaleDateString()}</td>
                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No payment history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
