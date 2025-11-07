import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CreditCard } from "lucide-react";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#0088FE"];

const PaymentMethodDonutChart = ({ data }) => {
  const safe = Array.isArray(data) ? data.filter(d => d && d.method) : [];
  const chart = safe.map((d) => ({ name: d.method || "Unknown", value: d.count || 0 }));

  if (chart.length === 0) {
    return (
      <div className="h-[280px] flex flex-col items-center justify-center text-gray-400">
        <CreditCard className="h-12 w-12 mb-2" />
        <p>No payment data</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chart}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {chart.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(val) => [val, "Orders"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PaymentMethodDonutChart;
