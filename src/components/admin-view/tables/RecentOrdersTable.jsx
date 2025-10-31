import { useEffect, useState } from "react";
import api from "@/api";

export default function RecentOrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/admin/orders/get?limit=10")
      .then((res) => setOrders(res.data.data || []))
      .catch((err) => console.error("Recent orders error:", err));
  }, []);

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
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="px-4 py-2">{order._id.slice(-6)}</td>
                <td className="px-4 py-2">{order.userId?.userName || "Guest"}</td>
                <td className="px-4 py-2">₹{order.totalAmount}</td>
                <td className="px-4 py-2 capitalize">{order.orderStatus}</td>
                <td className="px-4 py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={5} className="text-center py-4 text-gray-500">No recent orders found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
