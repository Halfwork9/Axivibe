// src/components/admin-view/order-details.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { ArrowLeft, CheckCircle } from "lucide-react";
import CommonForm from "../common/form";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { orderDetails, isLoading } = useSelector((state) => state.adminOrder);

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    if (!status) {
      toast({
        title: "Please select a status",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    dispatch(
      updateOrderStatus({ id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(id));
        setFormData(initialFormData);
        toast({
          title: "Order status updated successfully",
        });
      } else {
        toast({
          title: "Failed to update order status",
          variant: "destructive",
        });
      }
    }).finally(() => {
      setIsUpdating(false);
    });
  }

  function handleBackToOrders() {
    navigate("/admin/orders");
  }

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetailsForAdmin(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Button onClick={handleBackToOrders}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "rejected":
        return "bg-red-600";
      case "inProcess":
        return "bg-blue-500";
      case "inShipping":
        return "bg-orange-500";
      case "delivered":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={handleBackToOrders} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">{orderDetails?._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">{orderDetails?.orderDate?.split("T")[0]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Price</p>
                  <p className="font-medium text-lg">₹{orderDetails?.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">{orderDetails?.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <Badge className="bg-green-500">{orderDetails?.paymentStatus}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <Badge className={`${getStatusColor(orderDetails?.orderStatus)}`}>
                    {orderDetails?.orderStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="font-semibold">Order Items</h3>
              <div className="border rounded-lg p-4">
                {orderDetails?.cartItems?.length > 0 ? (
                  <div className="space-y-3">
                    {orderDetails.cartItems.map((item, idx) => (
                      <div key={item.productId || idx} className="flex items-center justify-between p-3 border-b last:border-0">
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No items in this order</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Shipping Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Shipping Information</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{orderDetails?.addressInfo?.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-medium">{orderDetails?.addressInfo?.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pincode</p>
                    <p className="font-medium">{orderDetails?.addressInfo?.pincode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{orderDetails?.addressInfo?.phone}</p>
                  </div>
                  {orderDetails?.addressInfo?.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="font-medium">{orderDetails?.addressInfo?.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Update Status */}
            <div className="space-y-4">
              <h3 className="font-semibold">Update Order Status</h3>
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="inProcess">In Process</option>
                    <option value="inShipping">In Shipping</option>
                    <option value="delivered">Delivered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full sm:w-auto"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Update Status
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminOrderDetailsView;
