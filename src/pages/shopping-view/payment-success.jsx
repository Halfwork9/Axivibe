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
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.shopCart.cartItems);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/shop/order/details/${orderId}`);
        const orderData = res.data.data;
        setOrder(orderData);

        // ✅ COD orders → success instantly
        if (orderData.paymentMethod === "cod") {
          dispatch(clearCart());
          setLoading(false);
          return;
        }

        // ✅ Stripe → show confirmed while checking
        setIsVerifying(true);

        const pollForStripe = async () => {
          try {
            const res2 = await api.get(`/shop/order/details/${orderId}`);
            const updatedOrder = res2.data.data;
            setOrder(updatedOrder);

            if (updatedOrder.paymentStatus === "paid") {
              dispatch(clearCart());
              setLoading(false);
              setIsVerifying(false);
              return;
            }

            if (!isCancelled) setTimeout(pollForStripe, 3000);
          } catch {
            setVerificationError("Could not verify payment.");
            setIsVerifying(false);
            setLoading(false);
          }
        };

        pollForStripe();
      } catch {
        setVerificationError("Failed load order.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
    return () => (isCancelled = true);
  }, [orderId, dispatch]);

  if (loading) {
    return (
      <Card className="p-10 max-w-md mx-auto mt-10 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p>Loading your order…</p>
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
            order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {order.paymentStatus === "paid" ? <CheckCircle /> : <AlertCircle />}
          {order.paymentStatus === "paid" ? "🎉 Payment Successful!" : "Order Confirmed!"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p>Order ID: {order._id}</p>
        <p>Total: ₹{order.totalAmount?.toLocaleString()}</p>
        <p>Payment Method: {order.paymentMethod}</p>

        {order.paymentMethod === "stripe" && order.paymentStatus !== "paid" && (
          <p className="text-yellow-600">
            ✅ Order placed — waiting for Stripe payment confirmation…
          </p>
        )}

        {isVerifying && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
            <Loader2 className="animate-spin" />
            <span>Verifying payment…</span>
          </div>
        )}

        {verificationError && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-md">
            {verificationError}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button onClick={() => navigate("/shop/account")} className="flex-1">
            View Orders
          </Button>
          <Button variant="outline" onClick={() => navigate("/shop/home")} className="flex-1">
            Continue Shopping
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentSuccessPage;
