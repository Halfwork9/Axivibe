import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, IndianRupee, Eye, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllOrdersByUserId } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";

// ✅ Empty state
const EmptyOrdersState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
    <p className="text-gray-500 mb-6">
      You haven't placed any orders. Start shopping to see them here!
    </p>
    <Button onClick={() => (window.location.href = "/shop/home")}>
      Continue Shopping
    </Button>
  </div>
);

// ✅ Skeleton Loader
const OrdersTableSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    ))}
  </div>
);

function UserOrdersPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { orderList, isLoading } = useSelector((state) => state.shopOrder);

  const [sortedOrderList, setSortedOrderList] = useState([]);

  // ✅ Fetch all orders on load
  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [user?.id, dispatch]);

  // ✅ Sort latest → oldest
  useEffect(() => {
    if (orderList?.length > 0) {
      const sorted = [...orderList].sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
      setSortedOrderList(sorted);
    } else {
      setSortedOrderList([]);
    }
  }, [orderList]);

  function handleFetchOrderDetails(orderId) {
    navigate(`/shop/order/${orderId}`);
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersTableSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>

        <CardContent>
          {sortedOrderList?.length > 0 ? (
            <>
              {/* ✅ Mobile Cards */}
              <div className="md:hidden space-y-4">
                {sortedOrderList.map((order) => (
                  <Card key={order._id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs text-gray-500">Order ID</p>
                        <Badge className={getStatusColor(order.orderStatus)}>
                          {order.orderStatus}
                        </Badge>
                      </div>

                      <p className="font-mono text-sm font-medium truncate">
                        {order._id}
                      </p>

                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4" />
                          <span className="font-semibold text-gray-800">
                            ₹{order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => handleFetchOrderDetails(order._id)}
                      >
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* ✅ Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedOrderList.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium text-sm">
                          {order._id.slice(-8)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.orderStatus)}>
                            {order.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ₹{order.totalAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFetchOrderDetails(order._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <EmptyOrdersState />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UserOrdersPage;
