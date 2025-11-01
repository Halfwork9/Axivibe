import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
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
    async function fetchAndVerifyOrder() {
      if (!orderId) return;
      
      try {
        // 1. First, fetch the order details
        const res = await api.get(`/shop/order/details/${orderId}`);

        if (res.data?.success) {
          const orderData = res.data.data;
          setOrder(orderData);
          dispatch(clearCart());

          // 2. If it's a Stripe order and payment is still pending, verify it
          if (orderData.paymentMethod === 'stripe' && orderData.paymentStatus === 'pending') {
            setIsVerifying(true);
            setVerificationError(null);
            try {
              const verifyRes = await api.post('/shop/verify-payment', { orderId: orderData._id });
              
              if (verifyRes.data.success) {
                // 3. If verification is successful, re-fetch the order to get the updated status
                const updatedRes = await api.get(`/shop/order/details/${orderId}`);
                if (updatedRes.data?.success) {
                  setOrder(updatedRes.data.data);
                }
              } else {
                // If verification fails, show an error
                setVerificationError(verifyRes.data.message || "Payment verification failed.");
              }
            } catch (err) {
              console.error("Payment verification API call failed:", err);
              setVerificationError("We could not verify your payment automatically. Please contact support if the status is not updated shortly.");
            } finally {
              setIsVerifying(false);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAndVerifyOrder();
  }, [orderId, dispatch]);

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
            <span>Verifying your payment with Stripe...</span>
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
