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
      console.error("Order ID not found in URL parameters.");
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/shop/order/details/${orderId}`);
        if (!res.data?.success) throw new Error("Failed to fetch order details.");

        const orderData = res.data.data;
        setOrder(orderData);

        // 🧠 If order is COD, no need to poll
        if (orderData.paymentMethod === "Cash on Delivery") {
          console.log("✅ COD order detected — skipping Stripe verification.");
          if (cartItems.length > 0) dispatch(clearCart());
          setLoading(false);
          setIsVerifying(false);
          return;
        }

        // 🧠 For Stripe: poll until paid
        const pollForStripePayment = async () => {
          try {
            const res = await api.get(`/shop/order/details/${orderId}`);
            if (res.data?.success) {
              const updatedOrder = res.data.data;
              setOrder(updatedOrder);
              if (updatedOrder.paymentStatus === "paid") {
                console.log("✅ Stripe payment confirmed.");
                setLoading(false);
                setIsVerifying(false);
                if (cartItems.length > 0) dispatch(clearCart());
                return;
              }
            }
            if (!isCancelled) setTimeout(pollForStripePayment, 3000);
          } catch (err) {
            console.error("Error polling for Stripe payment:", err);
            setVerificationError("Could not verify payment. Please refresh.");
            setLoading(false);
            setIsVerifying(false);
          }
        };

        // Begin polling if Stripe
        if (orderData.paymentMethod === "stripe") {
          setIsVerifying(true);
          pollForStripePayment();
        }

      } catch (err) {
        console.error("Error fetching order:", err);
        setVerificationError("Could not load order details.");
        setLoading(false);
      }
    };

    fetchOrderDetails();

    return () => {
      isCancelled = true;
    };
  }, [orderId, dispatch, cartItems.length]);

  if (loading) {
    return (
      <Card className="p-10 max-w-md mx-auto mt-10">
        <CardHeader className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <CardTitle>Loading your order...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className="p-10 max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Order not found!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-500 mb-4">
            We couldn't find details for this order. Please check your email or contact support.
          </p>
          <Button className="mt-5" onClick={() => navigate("/shop/home")}>
            Continue Shopping
          </Button>
        </CardContent>
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
        <p>
          Order ID: <span className="font-mono text-xs">{order._id}</span>
        </p>
        <p>
          Total Amount: <span className="font-semibold">₹{order.totalAmount?.toLocaleString()}</span>
        </p>
        <p>
          Payment Method:{" "}
          <span className="font-semibold capitalize">{order.paymentMethod}</span>
        </p>
        <p>
          Payment Status:{" "}
          <span
            className={`font-semibold ml-2 capitalize ${
              order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {order.paymentStatus}
          </span>
        </p>

        {isVerifying && (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Waiting for Stripe confirmation...</span>
          </div>
        )}

        {verificationError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{verificationError}</p>
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
