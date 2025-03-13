import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export const RevenueChart = ({ data }) => {
  // Format currency for tooltip
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-8 p-0">
      <div className="card-body">
        <h2 className="card-title">Monthly Revenue Breakdown</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip 
              formatter={(value, name) => [formatCurrency(value), name]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="totalRevenue" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
              name="Total Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="adminRevenue" 
              stroke="#82ca9d" 
              name="Admin Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="trainerRevenue" 
              stroke="#ffc658" 
              name="Trainer Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};