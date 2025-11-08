import { useSelector, useDispatch } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { cancelOrder, returnOrder, getOrderDetails } from "@/store/shop/order-slice";
import { useState } from "react";

function ShoppingOrderDetailsView({ orderDetails }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [actionLoading, setActionLoading] = useState(false);

  if (!orderDetails) return null;

  const handleCancel = async () => {
    setActionLoading(true);
    await dispatch(cancelOrder(orderDetails._id));
    await dispatch(getOrderDetails(orderDetails._id));
    setActionLoading(false);
  };

  const handleReturn = async () => {
    setActionLoading(true);
    await dispatch(returnOrder(orderDetails._id));
    await dispatch(getOrderDetails(orderDetails._id));
    setActionLoading(false);
  };

  const canCancel =
    !["cancelled", "returned", "delivered"].includes(orderDetails.orderStatus);

  const canReturn = orderDetails.orderStatus === "delivered";

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{new Date(orderDetails?.orderDate).toLocaleDateString()}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>₹{orderDetails?.totalAmount.toFixed(2)}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>

        {/* ✅ Action buttons */}
        <div className="flex gap-3">
          {canCancel && (
            <Button
              className="bg-red-600 text-white"
              disabled={actionLoading}
              onClick={handleCancel}
            >
              {actionLoading ? "Processing..." : "Cancel Order"}
            </Button>
          )}

          {canReturn && (
            <Button
              className="bg-yellow-600 text-white"
              disabled={actionLoading}
              onClick={handleReturn}
            >
              {actionLoading ? "Processing..." : "Return Order"}
            </Button>
          )}
        </div>

        <Separator />

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Items</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems?.map((item) => (
                <li key={item._id} className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Price: ₹{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

ShoppingOrderDetailsView.propTypes = {
  orderDetails: PropTypes.object,
};

export default ShoppingOrderDetailsView;
