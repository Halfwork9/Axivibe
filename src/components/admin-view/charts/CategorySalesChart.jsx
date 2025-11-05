import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

export default function CategorySalesChart({ data = [] }) {
  const chartData = Array.isArray(data)
    ? data.map((cat) => ({
        name: cat.categoryName || "Uncategorized",
        value: cat.totalRevenue || 0,
      }))
    : [];

  if (chartData.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-gray-400">
        No category sales data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
