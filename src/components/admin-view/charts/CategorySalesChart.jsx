// In your CategorySalesChart component, make sure it's handling the data correctly:

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CategorySalesChart = ({ data }) => {
  // Format the data for the chart
  const chartData = data.map(item => ({
    name: item.category || 'Unknown Category',
    value: item.revenue || 0,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategorySalesChart;
