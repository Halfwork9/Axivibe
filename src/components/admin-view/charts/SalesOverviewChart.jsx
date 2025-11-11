"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  CartesianGrid,
} from "recharts";

const SalesOverviewChart = ({ data = [] }) => {
  return (
    <div className="w-full h-[330px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 10, right: 10, bottom: 5 }}>
          {/* Smooth Grid */}
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />

          {/* X Axis (day) */}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#6B7280" }}
            interval="preserveStartEnd"
          />

          {/* Y Axis (₹) */}
          <YAxis
            tick={{ fontSize: 11, fill: "#6B7280" }}
            tickFormatter={(v) => `₹${v}`}
          />

          {/* Tooltip */}
          <Tooltip
            formatter={(value) => `₹${value.toLocaleString()}`}
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />

          {/* Gradient Background */}
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Revenue area */}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366F1"
            fill="url(#revenueGradient)"
            strokeWidth={3}
          />

          {/* Hover-only dots */}
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366F1"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesOverviewChart;
