// src/components/admin-view/charts/TopProductsChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function TopProductsChart({ data = [] }) {
  // Debug
  console.log("TopProductsChart received:", data);

  // Normalize + validate data
  const chartData = Array.isArray(data)
    ? data
        .filter((item) => item && item.title && typeof item.totalQty === 'number')
        .map((item) => ({
          title: item.title || 'Unknown',
          totalQty: item.totalQty || 0,
        }))
        .slice(0, 5) // Max 5
    : [];

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        <p>No top products data available.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <XAxis
          dataKey="title"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) => [`${value} units`, 'Quantity Sold']}
          contentStyle={{ backgroundColor: '#fff', borderRadius: 8 }}
        />
        <Bar dataKey="totalQty" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
