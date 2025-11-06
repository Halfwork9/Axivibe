// src/components/admin-view/charts/TopProductsChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package } from 'lucide-react';

const TopProductsChart = ({ data = [] }) => {
  const chartData = Array.isArray(data) ? data.filter(d => d.revenue > 0) : [];

  console.log("TopProductsChart data:", chartData); // DEBUG

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
        <Package className="h-12 w-12 mb-2" />
        <p>No product data</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
        <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopProductsChart;
