// src/components/admin-view/charts/TopProductsChart.jsx

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package } from 'lucide-react';

const TopProductsChart = ({ data }) => {
  // Ensure data is an array
  const chartData = Array.isArray(data) ? data : [];
  
  // If no data, show a message
  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
        <Package className="h-12 w-12 mb-2" />
        <p>No product data available</p>
      </div>
    );
  }
  
  // Format the data for the chart
  const formattedData = chartData.map(item => ({
    name: item.title || 'Unknown Product',
    quantity: item.totalQty || 0,
    revenue: item.revenue || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0} // Show all labels
        />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [
            name === 'quantity' ? `${value} units` : `₹${value.toLocaleString()}`,
            name === 'quantity' ? 'Quantity' : 'Revenue'
          ]}
        />
        <Bar 
          dataKey="revenue" 
          fill="#8884d8" 
          radius={[8, 8, 0, 0]} // Add rounded corners
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopProductsChart;
