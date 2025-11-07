import { Users } from "lucide-react";

const currency = (n) => `₹${Number(n || 0).toLocaleString()}`;

const TopCustomersTable = ({ data }) => {
  const rows = Array.isArray(data) ? data : [];

  if (rows.length === 0) {
    return (
      <div className="h-[280px] flex flex-col items-center justify-center text-gray-400">
        <Users className="h-12 w-12 mb-2" />
        <p>No customer data</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-2 pr-4">Customer</th>
            <th className="py-2 pr-4">Orders</th>
            <th className="py-2">Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.userId || idx} className="border-b last:border-none">
              <td className="py-2 pr-4 font-medium">{r.userName || r.userId || "Unknown"}</td>
              <td className="py-2 pr-4">{r.orders || 0}</td>
              <td className="py-2">{currency(r.totalSpent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopCustomersTable;
