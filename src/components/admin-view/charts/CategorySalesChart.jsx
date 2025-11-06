// src/components/admin-view/charts/CategorySalesChart.jsx

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Package } from 'lucide-react'; // Add this import

const CategorySalesChart = ({ data }) => {
  // Ensure data is an array and has items with value > 0
  const validData = Array.isArray(data) 
    ? data.filter(item => item.value > 0) 
    : [];
  
  // If no valid data, show a message
  if (validData.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
        <Package className="h-12 w-12 mb-2" /> {/* Changed from BarChart3 to Package */}
        <p>No sales data available</p>
        <p className="text-xs mt-1">Products may not have categories assigned</p>
      </div>
    );
  }
  
  console.log("CategorySalesChart rendering with data:", validData);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

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
          data={validData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {validData.map((entry, index) => (
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
