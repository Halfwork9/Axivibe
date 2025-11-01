import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, Eye, ChevronLeft, ChevronRight, Calendar, User, CreditCard, Package } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { updatePaymentStatus } from "@/store/admin/order-slice";
import { fetchOrdersForAdmin } from "@/store/admin/order-slice";
import { useNavigate } from "react-router-dom";

export default function RecentOrdersTable({ initialOrders, initialLoading }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // ✅ NEW: State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Get orders and pagination from Redux
  const { orderList, pagination, isLoading } = useSelector((state) => state.adminOrder);

  // ✅ NEW: Function to handle page changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    dispatch(fetchOrdersForAdmin({ page: newPage, limit: ordersPerPage }));
  };

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
  
  // Helper for status colors
  const getStatusColor = (status, type) => {
    const lowerStatus = status?.toLowerCase();
    if (type === 'order') {
      switch (lowerStatus) {
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'shipped':
        case 'confirmed': return 'bg-blue-100 text-blue-800';
        case 'pending':
        case 'processing': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
    if (type === 'payment') {
      return lowerStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  // Show initial loading state
  if (initialLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: Card Layout */}
      <div className="md:hidden space-y-4">
        {orderList && orderList.length > 0 ? (
          orderList.map((order) => (
            <Card key={order._id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-mono text-sm font-semibold">{order._id.slice(-6)}</p>
                  </div>
                  <Badge className={getStatusColor(order.orderStatus, 'order')}>
                    {order.orderStatus}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment:</span>
                    <Badge className={getStatusColor(order.paymentStatus, 'payment')}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(order.createdAt || order.orderDate), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {order.userId?.userName || "Guest"}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t">
                  <Button size="sm" variant="outline" onClick={() => handleViewOrder(order._id)} className="flex-1">
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  {order.paymentMethod === 'Cash on Delivery' && 
                   order.orderStatus.toLowerCase() === 'delivered' && 
                   order.paymentStatus.toLowerCase() === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsPaid(order._id)}
                      disabled={updatingOrderId === order._id}
                      className="flex-1"
                    >
                      {updatingOrderId === order._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <><CheckCircle className="h-4 w-4 mr-1" /> Paid</>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No recent orders found.</div>
        )}
      </div>

      {/* Desktop View: Table Layout */}
      <div className="hidden md:block overflow-x-auto">
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
            {orderList && orderList.length > 0 ? (
              orderList.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="px-4 py-2 font-mono">{order._id.slice(-6)}</td>
                  <td className="px-4 py-2">{order.userId?.userName || "Guest"}</td>
                  <td className="px-4 py-2">₹{order.totalAmount?.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <Badge className={getStatusColor(order.orderStatus, 'order')}>
                      {order.orderStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-2">
                    <Badge className={getStatusColor(order.paymentStatus, 'payment')}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-2">{format(new Date(order.createdAt || order.orderDate), 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewOrder(order._id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {order.paymentMethod === 'Cash on Delivery' && 
                     order.orderStatus.toLowerCase() === 'delivered' && 
                     order.paymentStatus.toLowerCase() === 'pending' && (
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
                <td colSpan={7} className="text-center py-4 text-gray-500">No recent orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ NEW: Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2 mt-4">
          <p className="text-sm text-gray-700">
            Showing {((currentPage - 1) * ordersPerPage) + 1} to{" "}
            {Math.min(currentPage * ordersPerPage, pagination.totalOrders)} of{" "}
            {pagination.totalOrders} orders
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
