import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import {  useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { clearCart, fetchCartItems } from "@/store/shop/cart-slice";
import api from "@/api";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  // ✅ Fetch cart on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;
   
  // --- HELPER FUNCTION FOR VALIDATION ---
  function performValidations() {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return false;
    }

    if (!currentSelectedAddress) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }

  async function handleStripeCheckout() {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (!currentSelectedAddress) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsPaymemntStart(true);

    try {
      const orderData = {
        userId: user?.id,
        cartId: cartItems?._id,
        cartItems: cartItems.items.map((singleCartItem) => ({
          productId: singleCartItem?.productId,
          title: singleCartItem?.title,
          image: singleCartItem?.image,
          price:
            singleCartItem?.salePrice > 0
              ? singleCartItem?.salePrice
              : singleCartItem?.price,
          quantity: singleCartItem?.quantity,
        })),
        addressInfo: {
          addressId: currentSelectedAddress?._id,
          address: currentSelectedAddress?.address,
          city: currentSelectedAddress?.city,
          pincode: currentSelectedAddress?.pincode,
          phone: currentSelectedAddress?.phone,
          notes: currentSelectedAddress?.notes,
        },
        totalAmount: totalCartAmount,
        paymentMethod: 'stripe',
      };

      const response = await api.post("/shop/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data?.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        toast({
          title: "Error creating order. Please try again.",
          variant: "destructive",
        });
        setIsPaymemntStart(false);
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast({
        title: "Something went wrong with Stripe.",
        variant: "destructive",
      });
      setIsPaymemntStart(false);
    }
  }

  async function handleCashOnDeliveryCheckout() {
  if (!performValidations()) return;

  setIsProcessing(true);
  try {
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      totalAmount: totalCartAmount,
      paymentMethod: "cod",
    };

    const response = await api.post("/shop/order/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    if (data?.success && data?.data) {
      dispatch(clearCart());
      toast({ title: "Order placed successfully!" });
      navigate(`/shop/payment-success?orderId=${data.data._id}`);
    } else {
      toast({
        title: "Error creating order. Please try again.",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("COD checkout error:", error);
    toast({ title: "Something went wrong.", variant: "destructive" });
  } finally {
    setIsProcessing(false);
  }
}

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item, idx) => (
                <UserCartItemsContent key={idx} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmount}</span>
            </div>
          </div>
          {/* --- MODIFIED: Added a container for two buttons --- */}
          <div className="mt-4 w-full flex flex-col sm:flex-row gap-4">
            <Button
  onClick={handleStripeCheckout}
  className="w-full"
  disabled={isProcessing || isPaymentStart}
>
  {isProcessing || isPaymentStart ? "Processing..." : "Checkout with Card"}
</Button>

            <Button onClick={handleCashOnDeliveryCheckout} className="w-full" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Pay with Cash on Delivery"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
