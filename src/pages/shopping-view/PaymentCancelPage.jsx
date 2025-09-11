import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-10 text-center">
      <CardHeader className="p-0">
        <CardTitle className="text-3xl font-bold text-red-600">
          Payment Cancelled ❌
        </CardTitle>
      </CardHeader>
      <p className="mt-3 text-lg">
        Your payment was cancelled. You can try again anytime.
      </p>
      <Button className="mt-5" onClick={() => navigate("/shop/cart")}>
        Back to Cart
      </Button>
    </Card>
  );
}

export default PaymentCancelPage;
