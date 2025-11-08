import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cancelOrder, returnOrder, getOrderDetails } from "@/store/shop/order-slice";
import { Badge } from "@/components/ui/badge";
import api from "@/api";

const RETURN_DAYS = 7; // ✅ Return window days

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/shop/order/details/${orderId}`);
      setOrder(res.data.data);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const canCancel =
    order &&
    !["cancelled", "returned", "delivered"].includes(order.orderStatus);

  // ✅ Return Available?
  const canReturn = (() => {
    if (!order) return false;
    if (order.orderStatus !== "delivered") return false;

    const orderDate = new Date(order.orderDate);
    const today = new Date();
    const diffDays = (today - orderDate) / (1000 * 60 * 60 * 24);

    return diffDays <= RETURN_DAYS;
  })();

  const handleCancel = async () => {
    setProcessing(true);
    await dispatch(cancelOrder(order._id));
    await fetchOrder();
    setProcessing(false);
  };

  const handleReturn = async () => {
    setProcessing(true);
    await dispatch(returnOrder(order._id));
    await fetchOrder();
    setProcessing(false);
  };

  if (loading) return <div className="p-8">Loading…</div>;

  if (!order)
    return (
      <div className="p-8 text-center">
        Order Not Found
        <Button className="mt-4" onClick={() => navigate("/shop/account")}>
          Back
        </Button>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <p>
            Order ID: <span className="font-mono">{order._id}</span>
          </p>
          <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>

          <p>
            Payment: <b>{order.paymentMethod}</b> ({order.paymentStatus})
          </p>

          <p>
            Status:{" "}
            <Badge>{order.orderStatus}</Badge>
          </p>

          <p>
            Total: <b>₹{order.totalAmount}</b>
          </p>

          {/* ✅ Cancel + Return */}
          <div className="flex gap-4 mt-4">

            {canCancel && (
              <Button
                className="bg-red-600"
                disabled={processing}
                onClick={handleCancel}
              >
                {processing ? "Processing…" : "Cancel Order"}
              </Button>
            )}

            {order.orderStatus === "delivered" && (
              <Button
                className="bg-yellow-600"
                disabled={processing || !canReturn}
                onClick={handleReturn}
              >
                {!canReturn
                  ? "Return Period Expired"
                  : processing
                  ? "Processing…"
                  : "Return Order"}
              </Button>
            )}
          </div>

          <hr />

          <h3 className="text-lg font-semibold mt-2">Items</h3>
          <ul className="space-y-2">
            {order.cartItems?.map((i) => (
              <li key={i._id} className="flex justify-between">
                <span>{i.title}</span>
                <span>Qty: {i.quantity}</span>
                <span>₹{i.price}</span>
              </li>
            ))}
          </ul>

          <hr />

          <h3 className="text-lg font-semibold mt-2">Shipping Address</h3>
          <p>{order.addressInfo.address}</p>
          <p>{order.addressInfo.city}</p>
          <p>{order.addressInfo.pincode}</p>
          <p>{order.addressInfo.phone}</p>
        </CardContent>
      </Card>

      <div className="mt-4 text-right">
        <Button variant="outline" onClick={() => navigate("/shop/account")}>
          Back
        </Button>
      </div>
    </div>
  );
}
