// src/components/admin-view/tables/TopCustomersTable.jsx
import { Users } from "lucide-react";
const currency = (n) => `₹${Number(n || 0).toLocaleString()}`;

const TopCustomersTable = ({ data }) => {
  if (!data?.length) {
    return (
      <div className="h-[200px] flex flex-col justify-center items-center text-gray-400">
        <Users className="h-10 w-10 mb-2" />
        <p>No customer data</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left font-medium w-1/2">Customer</th>
              <th className="p-2 text-center font-medium w-1/4">Orders</th>
              <th className="p-2 text-right font-medium w-1/4">Total Spent</th>
            </tr>
          </thead>

          <tbody>
            {data.map((c) => (
              <tr
                key={c.userId}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-2">{c.name || `User-${c.userId.slice(-4)}`}</td>
                <td className="p-2 text-center">{c.orderCount}</td>
                <td className="p-2 text-right">{currency(c.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopCustomersTable;
