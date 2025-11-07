import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Package } from "lucide-react";

const BrandSalesBarChart = ({ data }) => {
  const safe = Array.isArray(data) ? data : [];
  const chart = safe.map((d) => ({
    name: d.brand || "Unknown",
    revenue: d.revenue || 0,
  }));

  if (chart.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
        <Package className="h-12 w-12 mb-2" />
        <p>No brand sales yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chart} margin={{ top: 12, right: 20, left: 12, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={-35}
          textAnchor="end"
          height={80}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Revenue"]} />
        <Bar dataKey="revenue" fill="#8884d8" radius={[8, 8, 0, 0]} maxBarSize={60} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BrandSalesBarChart;
