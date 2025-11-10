import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Package, CreditCard, User, MapPin } from "lucide-react";
import { getOrderDetailsForAdmin } from "@/store/admin/order-slice";
import { format } from "date-fns";

function OrderDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetails, isLoading } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetailsForAdmin(id));
    }
  }, [dispatch, id]);

  if (isLoading || !orderDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const { cartItems, addressInfo, userId, paymentMethod, paymentStatus, orderStatus, totalAmount, orderDate, paymentId } = orderDetails;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Order Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Order Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} x ₹{item.price}</p>
                    </div>
                    <p className="font-semibold">₹{(item.quantity * parseFloat(item.price)).toLocaleString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{addressInfo.address}</p>
                <p className="text-gray-700">{addressInfo.city}, {addressInfo.pincode}</p>
                <p className="text-gray-700">Phone: {addressInfo.phone}</p>
                {addressInfo.notes && <p className="text-gray-500 italic mt-2">Notes: {addressInfo.notes}</p>}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{userId?.userName}</p>
                <p className="text-sm text-gray-500">{userId?.email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment & Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
  <div className="flex justify-between">
    <span>Method:</span>
    <span className="font-semibold">{paymentMethod}</span>
  </div>

  <div className="flex justify-between">
    <span>Payment Status:</span>
    <span
      className={`font-semibold capitalize ${
        paymentStatus === "paid" ? "text-green-600" : "text-red-600"
      }`}
    >
      {paymentStatus}
    </span>
  </div>

  <div className="flex justify-between">
    <span>Order Status:</span>
    <span className="font-semibold capitalize">{orderStatus}</span>
  </div>

  {paymentId && (
    <div className="flex flex-col gap-1">
      <span>Payment ID:</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs break-all bg-gray-100 p-1 rounded flex-1">
          {paymentId}
        </span>
      </div>
    </div>
  )}
</CardContent>

            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>₹{totalAmount?.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Placed on {format(new Date(orderDate), 'PPP')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
