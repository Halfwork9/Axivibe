// src/components/shop/PaymentSuccessPage.jsx

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // ✅ Make sure useSelector is imported
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

  useEffect(() => {
    if (!orderId) return;

    let isCancelled = false; // Flag to stop polling when component unmounts

    // ✅ NEW: Polling function
    const pollForPaymentStatus = async () => {
      try {
        const res = await api.get(`/shop/order/details/${orderId}`);
        if (res.data?.success) {
          const orderData = res.data.data;
          setOrder(orderData);

          // If payment is successful, stop polling
          if (orderData.paymentStatus === 'paid') {
            console.log("✅ Payment confirmed via polling.");
            setLoading(false);
            setIsVerifying(false);
            return;
          }

          // If payment is still pending, poll again after 3 seconds
          setTimeout(() => {
            if (!isCancelled) {
              pollForPaymentStatus();
            }
          }, 3000);
        }
      } catch (err) {
        console.error("Error polling for payment status:", err);
        setVerificationError("Could not verify payment status. Please refresh the page.");
        setLoading(false);
        setIsVerifying(false);
      }
    };
    
    // Initial actions
    const initialize = async () => {
      setIsVerifying(true);
      const currentCart = useSelector(state => state.shopCart.cartItems);
      if (currentCart.length > 0) {
        dispatch(clearCart());
      }
      // Start the polling process
      pollForPaymentStatus();
    };

    initialize();

    // Cleanup function to stop polling on component unmount
    return () => {
      isCancelled = true;
    };
  }, [orderId, dispatch]); // Added dispatch back for clarity

  // ... (the rest of the component JSX remains the same)
  
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
        <Button className="mt-5" onClick={() => navigate("/shop/home")}>
          Continue Shopping
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-10 max-w-lg mx-auto mt-10">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl text-green-600 flex items-center justify-center gap-2">
          {order.paymentStatus === 'paid' ? <CheckCircle /> : <AlertCircle />}
          {order.paymentStatus === 'paid' ? '🎉 Payment Successful!' : 'Processing Payment...'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Order ID: <span className="font-mono">{order._id}</span></p>
        <p>Total Paid: <span className="font-semibold">₹{order.totalAmount?.toLocaleString()}</span></p>
        <p>
          Payment Status: 
          <span className={`font-semibold ml-2 capitalize ${
            order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {order.paymentStatus}
          </span>
        </p>
        
        {isVerifying && (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Waiting for payment confirmation...</span>
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
