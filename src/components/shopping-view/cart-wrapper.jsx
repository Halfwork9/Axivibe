import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import PropTypes from "prop-types";

export default function UserCartWrapper({ cartItems, isOpen, setOpenCartSheet }) {
  const navigate = useNavigate();

  const validItems = Array.isArray(cartItems) ? cartItems : [];

  const totalAmount = validItems.length
    ? validItems.reduce((sum, item) => {
        const price = item.salePrice > 0 ? item.salePrice : item.price;
        return sum + price * item.quantity;
      }, 0)
    : 0;

  return (
    <Sheet open={isOpen} onOpenChange={setOpenCartSheet}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {validItems.length > 0 ? (
            validItems.map((item, idx) => (
              <UserCartItemsContent key={item._id || idx} cartItem={item} />
            ))
          ) : (
            <p className="text-gray-500 text-sm">Your cart is empty</p>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full mt-6"
        >
          Checkout
        </Button>
      </SheetContent>
    </Sheet>
  );
}

UserCartWrapper.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      price: PropTypes.number,
      salePrice: PropTypes.number,
      quantity: PropTypes.number,
    })
  ),
  isOpen: PropTypes.bool.isRequired,
  setOpenCartSheet: PropTypes.func.isRequired,
};
