// src/components/admin-view/tables/RecentOrdersTable.jsx
import { format } from "date-fns"; // It's better to format dates here

export default function RecentOrdersTable({ orders, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">Loading recent orders...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="px-4 py-2 font-mono">{order._id.slice(-6)}</td>
                <td className="px-4 py-2">{order.userId?.userName || "Guest"}</td>
                <td className="px-4 py-2">₹{order.totalAmount?.toLocaleString()}</td>
                <td className="px-4 py-2 capitalize">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : 
                    order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-2">{format(new Date(order.createdAt || order.orderDate), 'MMM dd, yyyy')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No recent orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
