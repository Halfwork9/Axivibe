// src/components/admin-view/order-details.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { ArrowLeft } from "lucide-react";
import CommonForm from "../common/form";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { orderDetails, isLoading } = useSelector((state) => state.adminOrder);

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(id));
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  function handleBackToOrders() {
    navigate("/admin/orders");
  }

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetailsForAdmin(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Button onClick={handleBackToOrders}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={handleBackToOrders} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <div className="flex mt-6 items-center justify-between">
                <p className="font-medium">Order ID</p>
                <Label>{orderDetails?._id}</Label>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p className="font-medium">Order Date</p>
                <Label>{orderDetails?.orderDate?.split("T")[0]}</Label>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p className="font-medium">Order Price</p>
                <Label>₹{orderDetails?.totalAmount}</Label>
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
                        : orderDetails?.orderStatus === "rejected"
                        ? "bg-red-600"
                        : "bg-black"
                    }`}
                  >
                    {orderDetails?.orderStatus}
                  </Badge>
                </Label>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="font-medium">Order Details</div>
                <ul className="grid gap-3">
                  {orderDetails?.cartItems?.length > 0
                    ? orderDetails.cartItems.map((item, idx) => (
                        <li
                          key={item.productId || idx}
                          className="flex items-center justify-between"
                        >
                          <span>Title: {item.title}</span>
                          <span>Quantity: {item.quantity}</span>
                          <span>Price: ₹{item.price}</span>
                        </li>
                      ))
                    : null}
                </ul>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="font-medium">Shipping Info</div>
                <div className="grid gap-0.5 text-muted-foreground">
                  <span>{orderDetails?.addressInfo?.address}</span>
                  <span>{orderDetails?.addressInfo?.city}</span>
                  <span>{orderDetails?.addressInfo?.pincode}</span>
                  <span>{orderDetails?.addressInfo?.phone}</span>
                  <span>{orderDetails?.addressInfo?.notes}</span>
                </div>
              </div>
            </div>

            <div>
              <CommonForm
                formControls={[
                  {
                    label: "Order Status",
                    name: "status",
                    componentType: "select",
                    options: [
                      { id: "pending", label: "Pending" },
                      { id: "inProcess", label: "In Process" },
                      { id: "inShipping", label: "In Shipping" },
                      { id: "delivered", label: "Delivered" },
                      { id: "rejected", label: "Rejected" },
                    ],
                  },
                ]}
                formData={formData}
                setFormData={setFormData}
                buttonText={"Update Order Status"}
                onSubmit={handleUpdateStatus}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminOrderDetailsView;
