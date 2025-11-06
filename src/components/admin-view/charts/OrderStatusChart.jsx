// src/components/admin-view/charts/OrderStatusChart.jsx

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const OrderStatusChart = ({ data }) => {
  // Format the data for the chart
  const chartData = [
    { name: 'Pending', value: data.pendingOrders || 0 },
    { name: 'Confirmed', value: data.confirmedOrders || 0 },
    { name: 'Shipped', value: data.shippedOrders || 0 },
    { name: 'Delivered', value: data.deliveredOrders || 0 },
  ].filter(item => item.value > 0); // Only show items with values > 0
  
  // If no data, show a message
  if (chartData.length === 0) {
    return (
      <div className="h-[280px] flex flex-col items-center justify-center text-gray-400">
        <Package className="h-12 w-12 mb-2" />
        <p>No order status data</p>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, 'Orders']} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default OrderStatusChart;
