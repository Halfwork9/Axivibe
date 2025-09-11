import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ShoppingOrderDetailsView from "@/components/shopping-view/order-details";
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice";

function UserOrdersPage() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  // FIX: Selecting from the correct slice as defined in your file
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.shopOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    // This hook now correctly fetches orders when the user ID is available
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  function handleFetchOrderDetails(orderId) {
    dispatch(getOrderDetails(orderId));
  }

  function handleCloseDialog() {
    setOpenDetailsDialog(false);
    dispatch(resetOrderDetails());
  }
  
  if (isLoading) {
    return <div className="p-10 text-center">Loading your orders...</div>;
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead><span className="sr-only">Details</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList && orderList.length > 0 ? (
                  orderList.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium truncate max-w-[150px]">{order._id}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={order.orderStatus === 'confirmed' ? 'default' : 'destructive'}>
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleFetchOrderDetails(order._id)}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center">You have not placed any orders yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* FIX: Dialog is now outside the map, controlled cleanly */}
      <Dialog open={openDetailsDialog} onOpenChange={handleCloseDialog}>
        <ShoppingOrderDetailsView orderDetails={orderDetails} />
      </Dialog>
    </>
  );
}

export default UserOrdersPage;

