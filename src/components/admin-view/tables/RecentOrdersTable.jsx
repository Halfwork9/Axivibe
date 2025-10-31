import { format } from "date-fns";

export default function RecentOrdersTable({ orders, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">Loading recent orders...</div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border rounded-md">
        No recent orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* 💻 Table View for md+ screens */}
      <table className="hidden md:table min-w-full border text-sm">
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
          {orders.map((order) => (
            <tr key={order._id} className="border-t hover:bg-gray-50 transition">
              <td className="px-4 py-2 font-mono">{order._id.slice(-6)}</td>
              <td className="px-4 py-2">{order.userId?.userName || "Guest"}</td>
              <td className="px-4 py-2">₹{order.totalAmount?.toLocaleString()}</td>
              <td className="px-4 py-2 capitalize">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    order.orderStatus === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.orderStatus === "shipped"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </td>
              <td className="px-4 py-2">
                {format(
                  new Date(order.createdAt || order.orderDate),
                  "MMM dd, yyyy"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📱 Mobile Card View for smaller screens */}
      <div className="md:hidden flex flex-col gap-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500 font-mono">
                #{order._id.slice(-6)}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full capitalize ${
                  order.orderStatus === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.orderStatus === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <div className="text-sm">
              <p className="font-semibold">
                {order.userId?.userName || "Guest"}
              </p>
              <p className="text-gray-600">
                Amount: ₹{order.totalAmount?.toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {format(
                  new Date(order.createdAt || order.orderDate),
                  "MMM dd, yyyy"
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
