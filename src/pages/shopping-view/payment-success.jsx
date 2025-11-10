// ✅ pages/shopping-view/payment-success.jsx
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
  const [isVerifying, setIsVerifying] = useState(false);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.shopCart.cartItems);

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    const loadOrder = async () => {
      try {
        const res = await api.get(`/shop/order/details/${orderId}`);
        const data = res.data?.data;

        setOrder(data);

        // ✅ Clear cart immediately for both COD + Stripe
        if (cartItems.length > 0) dispatch(clearCart());

        // ✅ If Stripe & still pending → poll
        if (data?.paymentMethod === "stripe" && data?.paymentStatus !== "paid") {
          setIsVerifying(true);

          const check = async () => {
            if (cancelled) return;

            const res2 = await api.get(`/shop/order/details/${orderId}`);
            const upd = res2.data?.data;
            setOrder(upd);

            if (upd.paymentStatus === "paid") {
              setIsVerifying(false);
              return;
            }

            setTimeout(check, 3000);
          };

          check();
        }
      } catch {}
    };

    loadOrder();
    return () => (cancelled = true);
  }, [orderId, dispatch]);

  if (!order) {
    return (
      <Card className="p-10 max-w-md mx-auto mt-20 text-center">
        <CardTitle>Order Confirmed!</CardTitle>
        <p>Processing payment…</p>
      </Card>
    );
  }

  return (
    <Card className="p-10 max-w-lg mx-auto mt-20">
      <CardHeader className="text-center">
        <CardTitle
          className={`text-3xl flex items-center justify-center gap-2 ${
            order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {order.paymentStatus === "paid" ? <CheckCircle /> : <AlertCircle />}
          {order.paymentStatus === "paid"
            ? "🎉 Payment Confirmed!"
            : "Order Placed!"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p>Order ID: {order._id}</p>
        <p>Total: ₹{order.totalAmount?.toLocaleString()}</p>
        <p>Payment Method: {order.paymentMethod}</p>
        <p>Status: {order.orderStatus}</p>

        {isVerifying && (
          <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
            <Loader2 className="animate-spin" />
            <span>Confirming payment…</span>
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
