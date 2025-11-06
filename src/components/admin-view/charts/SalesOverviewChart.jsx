// src/components/admin-view/charts/SalesOverviewChart.jsx

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesOverviewChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-gray-400">
        No sales data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [
            name === 'revenue' ? `₹${value.toLocaleString()}` : value,
            name === 'revenue' ? 'Revenue' : 'Orders'
          ]}
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#8884d8" 
          strokeWidth={2}
          dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesOverviewChart;
