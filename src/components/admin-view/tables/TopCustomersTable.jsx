import { Users } from "lucide-react";

const currency = (n) => `₹${Number(n || 0).toLocaleString()}`;

const TopCustomersTable = ({ data }) => {
  if (!data?.length) {
    return <p className="text-gray-400">No customer data</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700">
            <th className="p-2 font-medium">Customer</th>
            <th className="p-2 font-medium text-center">Orders</th>
            <th className="p-2 font-medium text-right">Total Spent</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c) => (
            <tr
              key={c.userId}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-2">{c.name || "User-" + c.userId.slice(-4)}</td>
              <td className="p-2 text-center">{c.orderCount}</td>
              <td className="p-2 text-right">{currency(c.totalSpent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopCustomersTable;
