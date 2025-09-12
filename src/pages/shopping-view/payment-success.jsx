import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/shop/cart-slice";
import api from "@/api";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
  async function fetchOrder() {
    if (!orderId) return;
    try {
      const res = await api.post(`/shop/order/details/${orderId}`);
      const data = await res.json();
      if (data?.success) {
        setOrder(data.data);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  }
  fetchOrder();
}, [orderId]);

  if (loading) {
    return (
      <Card className="p-10">
        <CardHeader>
          <CardTitle>Loading your order...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className="p-10">
        <CardHeader>
          <CardTitle>Order not found!</CardTitle>
        </CardHeader>
        <Button className="mt-5" onClick={() => navigate("/shop")}>
          Continue Shopping
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-10">
      <CardHeader>
        <CardTitle className="text-3xl text-green-600">
          🎉 Payment Successful!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Order ID: {order._id}</p>
        <p>Total Paid: ₹{order.totalAmount}</p>
        <p>Status: {order.orderStatus}</p>
        <div className="mt-5">
          <Button onClick={() => navigate("/shop/account")}>View Orders</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentSuccessPage;
