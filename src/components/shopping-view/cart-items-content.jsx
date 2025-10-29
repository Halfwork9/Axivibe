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
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      let getCartItems = cartItems.items || [];
      if (getCartItems.length) {
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
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Cart item updated successfully" });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Cart item deleted successfully" });
      }
    });
  }

  // --- FIXED IMAGE HANDLER ---
  const getImageSrc = () => {
    if (imageError) return "https://picsum.photos/seed/cartitem/80/80.jpg";

    // ✅ Prefer images array if exists
    if (Array.isArray(cartItem?.images) && cartItem.images.length > 0) {
      return getImageUrl(cartItem.images[0]);
    }

    // ✅ Fallback to single image string
    if (typeof cartItem?.image === "string" && cartItem.image.trim() !== "") {
      return getImageUrl(cartItem.image);
    }

    // ✅ If productId is an object (populated version)
    if (cartItem?.productId?.image) {
      return getImageUrl(cartItem.productId.image);
    }

    // ✅ Last fallback
    return "https://picsum.photos/seed/cartitem/80/80.jpg";
  };

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
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
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
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

UserCartItemsContent.propTypes = {
  cartItem: PropTypes.shape({
    productId: PropTypes.any.isRequired,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    salePrice: PropTypes.number,
  }).isRequired,
};

export default UserCartItemsContent;
