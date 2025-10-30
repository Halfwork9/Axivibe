// src/components/shopping-view/cart-items-content.js
import React, { useState, useEffect } from "react";
import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import PropTypes from "prop-types";
import { getImageUrl } from "@/utils/imageUtils";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems, loading } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (isUpdating || loading) return; // Prevent multiple simultaneous updates
    
    let getCartItems = Array.isArray(cartItems) ? cartItems : [];

    if (typeOfAction === "plus") {
      const indexOfCurrentCartItem = getCartItems.findIndex(
        (item) => item.productId === getCartItem?.productId
      );
      const getCurrentProductIndex = productList.findIndex(
        (product) => product._id === getCartItem?.productId
      );
      const getTotalStock = productList[getCurrentProductIndex]?.totalStock;

      if (indexOfCurrentCartItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    setIsUpdating(true);
    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((action) => {
      setIsUpdating(false);
      if (action.meta.requestStatus === 'fulfilled') {
        toast({ title: "Cart item updated successfully" });
      } else {
        toast({ 
          title: "Failed to update cart item", 
          variant: "destructive" 
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    if (isUpdating || loading) return; // Prevent multiple simultaneous updates
    
    setIsUpdating(true);
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((action) => {
      setIsUpdating(false);
      if (action.meta.requestStatus === 'fulfilled') {
        toast({ title: "Cart item deleted successfully" });
      } else {
        toast({ 
          title: "Failed to delete cart item", 
          variant: "destructive" 
        });
      }
    });
  }

  const getImageSrc = () => {
    const imageUrl =
      cartItem?.image && cartItem.image.trim() !== ""
        ? getImageUrl(cartItem.image)
        : Array.isArray(cartItem?.images) && cartItem.images.length > 0
        ? getImageUrl(cartItem.images[0])
        : "https://picsum.photos/seed/cartitem/80/80.jpg";
    return imageUrl;
  };

  useEffect(() => {
    setImageError(false);
  }, [cartItem]);

  const src = getImageSrc();

  return (
    <div className="flex items-center space-x-4">
      <img
        src={src}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
        crossOrigin="anonymous"
        onError={() => setImageError(true)}
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1 || isUpdating || loading}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={isUpdating || loading}
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ₹
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1 hover:text-red-500"
          size={20}
        />
      </div>
    </div>
  );
}

UserCartItemsContent.propTypes = {
  cartItem: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    salePrice: PropTypes.number,
  }).isRequired,
};

export default UserCartItemsContent;
