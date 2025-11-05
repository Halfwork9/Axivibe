// src/components/admin-view/charts/TopProductsChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function TopProductsChart({ data = [] }) {
  const chartData = Array.isArray(data)
    ? data
        .filter((item) => item && item.title && (item.totalQty > 0 || item.revenue > 0))
        .map((item) => ({
          title: (item.title || "Unknown").slice(0, 18),
          totalQty: item.totalQty || 0,
          revenue: item.revenue || 0,
        }))
        .slice(0, 5)
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#fff", borderRadius: 8 }}
          formatter={(value, name) =>
            name === "totalQty" ? [`${value} units`, "Units Sold"] : [`₹${value.toLocaleString()}`, "Revenue"]
          }
        />
        <Legend />
        <Bar yAxisId="left" dataKey="totalQty" name="Units Sold" fill="#3b82f6">
          {chartData.map((_, i) => (
            <Cell key={`qty-${i}`} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
        <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#10b981">
          {chartData.map((_, i) => (
            <Cell key={`rev-${i}`} fill={COLORS[(i + 1) % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
