import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { clearCart, fetchCartItems } from "@/store/shop/cart-slice";
import api from "@/api";
import { getImageUrl } from '@/utils/imageUtils';

function ShoppingCheckout() {
  const cartItems = useSelector((state) => state.shopCart.cartItems);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch cart on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  // Defensive array fallback
  const cartItemsArray = Array.isArray(cartItems) ? cartItems : [];

  const totalCartAmount =
    cartItemsArray.length > 0
      ? cartItemsArray.reduce(
          (sum, currentItem) =>
            sum +
            ((currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              (currentItem?.quantity || 1)),
          0
        )
      : 0;

  // --- HELPER FUNCTION FOR VALIDATION ---
  function performValidations() {
    if (!cartItemsArray || cartItemsArray.length === 0) {
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

  // Helper function to get the correct image URL
  const getImageSrc = (item) => {
    // Check if item has images array
    if (Array.isArray(item?.images) && item.images.length > 0) {
      return getImageUrl(item.images[0]);
    }
    
    // Check if item has direct image property
    if (item?.image) {
      return getImageUrl(item.image);
    }
    
    return "https://picsum.photos/seed/checkout/80/80.jpg"; // Use a working placeholder service
  };

  async function handleStripeCheckout() {
    if (!performValidations()) return;

    setIsPaymentStart(true);

    try {
      const orderData = {
        userId: user?.id,
        cartId: cartItemsArray[0]?._id,
        cartItems: cartItemsArray.map((singleCartItem) => ({
          productId: singleCartItem?.productId,
          title: singleCartItem?.title,
          image: getImageSrc(singleCartItem),
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
        paymentMethod: "stripe",
      };

      const { data } = await api.post("/shop/order/create", orderData);

      if (data?.success && data.url) {
        // Clear cart before redirecting
        dispatch(clearCart(user.id));
        window.location.href = data.url;
      } else {
        toast({
          title: "Error creating order. Please try again.",
          variant: "destructive",
        });
        setIsPaymentStart(false);
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast({
        title: "Something went wrong with Stripe.",
        variant: "destructive",
      });
      setIsPaymentStart(false);
    }
  }

  async function handleCashOnDeliveryCheckout() {
    if (!performValidations()) return;

    setIsProcessing(true);
    try {
      const orderData = {
        userId: user?.id,
        cartId: cartItemsArray[0]?._id,
        cartItems: cartItemsArray.map((singleCartItem) => ({
          productId: singleCartItem?.productId,
          title: singleCartItem?.title,
          image: getImageSrc(singleCartItem),
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

      const { data } = await api.post("/shop/order/create", orderData);

      if (data?.success && data?.data) {
        // Clear cart after successful order
        dispatch(clearCart(user.id));
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
          {cartItemsArray.length > 0
            ? cartItemsArray.map((item, idx) => (
                <UserCartItemsContent key={idx} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmount}</span>
            </div>
          </div>
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
