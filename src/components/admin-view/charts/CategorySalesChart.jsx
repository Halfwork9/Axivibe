// src/components/admin-view/charts/CategorySalesChart.jsx

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CategorySalesChart = ({ data }) => {
  // Ensure data is an array and has items
  const chartData = Array.isArray(data) && data.length > 0 ? data : [{ name: "No Data", value: 0 }];
  
  // Log the data for debugging
  console.log("CategorySalesChart received data:", chartData);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

  // Custom label to show category name and percentage
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for very small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} 
        />
        <Legend 
          formatter={(value, entry) => (
            <span style={{ color: entry.color }}>
              {entry.payload.name}: ₹{entry.payload.value.toLocaleString()}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategorySalesChart;
