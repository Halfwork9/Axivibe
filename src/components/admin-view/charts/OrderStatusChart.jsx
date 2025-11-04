// src/components/admin-view/charts/OrderStatusChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

export default function OrderStatusChart({ data }) {
  const chartData = [
    { name: 'Pending', value: data.pendingOrders, color: COLORS[0] },
    { name: 'Confirmed', value: data.confirmedOrders || 0, color: COLORS[1] },
    { name: 'Shipped', value: data.shippedOrders || 0, color: COLORS[2] },
    { name: 'Delivered', value: data.deliveredOrders, color: COLORS[3] },
  ].filter(d => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
