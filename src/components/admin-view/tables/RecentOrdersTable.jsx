import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { updatePaymentStatus } from "@/store/admin/order-slice";
import { useNavigate } from "react-router-dom";
import { updatePaymentStatus } from "@/store/admin/order-slice";

export default function RecentOrdersTable({ orders, isLoading }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const handleMarkAsPaid = async (orderId) => {
    const isConfirmed = window.confirm("Are you sure you want to mark this order as paid?");
    if (!isConfirmed) return;

    setUpdatingOrderId(orderId);
    try {
      const result = await dispatch(updatePaymentStatus({ orderId, status: 'paid' }));
      if (result.error) {
        throw new Error(result.payload.message || "Failed to update status");
      }
      toast({
        title: "Success",
        description: "Order marked as paid.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Order Status</th>
            <th className="px-4 py-2 text-left">Payment Status</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={7} className="text-center py-4"><Loader2 className="animate-spin inline-block"/> Loading...</td></tr>
          ) : orders && orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="px-4 py-2 font-mono">{order._id.slice(-6)}</td>
                <td className="px-4 py-2">{order.userId?.userName || "Guest"}</td>
                <td className="px-4 py-2">₹{order.totalAmount?.toLocaleString()}</td>
                <td className="px-4 py-2 capitalize">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : 
                    order.orderStatus === 'shipped' || order.orderStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-2 capitalize">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-2">{format(new Date(order.createdAt || order.orderDate), 'MMM dd, yyyy')}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewOrder(order._id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {order.paymentMethod === 'Cash on Delivery' && 
                   order.orderStatus === 'delivered' && 
                   order.paymentStatus === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsPaid(order._id)}
                      disabled={updatingOrderId === order._id}
                    >
                      {updatingOrderId === order._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <><CheckCircle className="h-4 w-4 mr-1" /> Mark as Paid</>
                      )}
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                No recent orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
