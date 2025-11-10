import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/store/shop/cart-slice";
import api from "@/api";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const session_id = searchParams.get("session_id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.shopCart.cartItems);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      setVerifying(true);

      try {
        // ✅ Ask backend to verify immediately
        await api.post("/shop/order/verify-payment", {
          orderId,
          session_id,
        });

        // ✅ Fetch the updated order
        const res = await api.get(`/shop/order/details/${orderId}`);
        setOrder(res.data?.data);

        // ✅ Clear cart immediately
        if (cartItems.length > 0) {
          dispatch(clearCart());
        }
      } catch (err) {
        console.error("verify-payment failed → fallback", err);

        const res = await api.get(`/shop/order/details/${orderId}`);
        setOrder(res.data?.data);
      }

      setVerifying(false);
      setLoading(false);
    };

    verifyPayment();
  }, [orderId, dispatch]);

  if (loading) {
    return (
      <Card className="p-10 max-w-md mx-auto mt-10 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Verifying payment…</p>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className="p-10 max-w-md mx-auto mt-10 text-center">
        <CardTitle>Order Not Found</CardTitle>
        <Button className="mt-4" onClick={() => navigate("/shop/home")}>
          Continue Shopping
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-10 max-w-lg mx-auto mt-10">
      <CardHeader className="text-center">
        <CardTitle
          className={`text-3xl flex items-center justify-center gap-2 ${
            order.paymentStatus === "paid"
              ? "text-green-600"
              : "text-yellow-600"
          }`}
        >
          {order.paymentStatus === "paid" ? <CheckCircle /> : <AlertCircle />}
          {order.paymentStatus === "paid"
            ? "🎉 Payment Successful!"
            : "Order Received!"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p>Order ID: {order._id}</p>
        <p>Total: ₹{order.totalAmount?.toLocaleString()}</p>
        <p>Payment Method: {order.paymentMethod}</p>
        <p>Status: {order.orderStatus}</p>

        {verifying && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
            <Loader2 className="animate-spin" />
            <span>Confirming payment…</span>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button onClick={() => navigate("/shop/account")} className="flex-1">
            View Orders
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/shop/home")}
            className="flex-1"
          >
            Continue Shopping
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentSuccessPage;
