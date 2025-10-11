import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

const sortOptions = [
  { value: "date-desc", label: "Latest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "amount-desc", label: "Amount: High to Low" },
  { value: "amount-asc", label: "Amount: Low to High" },
  { value: "status", label: "Status" },
];

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [sortBy, setSortBy] = useState("date-desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { orderList, orderDetails, pagination } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin({ sortBy, page }));
  }, [dispatch, sortBy, page]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  function handleCloseDialog() {
    setOpenDetailsDialog(false);
    dispatch(resetOrderDetails());
  }

  // Sort orders locally if backend doesn't sort
  let sortedOrderList = (orderList || []).slice();
  if (sortBy === "date-desc") {
    sortedOrderList.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  } else if (sortBy === "date-asc") {
    sortedOrderList.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
  } else if (sortBy === "amount-desc") {
    sortedOrderList.sort((a, b) => b.totalAmount - a.totalAmount);
  } else if (sortBy === "amount-asc") {
    sortedOrderList.sort((a, b) => a.totalAmount - b.totalAmount);
  } else if (sortBy === "status") {
    sortedOrderList.sort((a, b) => a.orderStatus.localeCompare(b.orderStatus));
  }

  // Pagination
  useEffect(() => {
    if (pagination?.totalPages) setTotalPages(pagination.totalPages);
  }, [pagination]);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            {/* Sort */}
            <select
              className="border px-3 py-2 rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {/* Pagination */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Prev
              </Button>
              <span>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>

          {/* TABLE FOR DESKTOP */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Order Price</TableHead>
                  <TableHead>
                    <span className="sr-only">Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrderList.length > 0
                  ? sortedOrderList.map((orderItem) => (
                      <TableRow key={orderItem._id}>
                        <TableCell className="font-medium truncate max-w-[150px]">{orderItem?._id}</TableCell>
                        <TableCell>{orderItem?.orderDate?.split("T")[0]}</TableCell>
                        <TableCell>
                          <Badge
                            className={`py-1 px-3 ${
                              orderItem?.orderStatus === "confirmed"
                                ? "bg-green-500"
                                : orderItem?.orderStatus === "rejected"
                                ? "bg-red-600"
                                : "bg-black"
                            }`}
                          >
                            {orderItem?.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{orderItem?.totalAmount}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : (
                    <TableRow>
                      <TableCell colSpan="5" className="text-center">No orders found.</TableCell>
                    </TableRow>
                  )
                }
              </TableBody>
            </Table>
          </div>

          {/* CARD LIST FOR MOBILE */}
          <div className="sm:hidden space-y-4">
            {sortedOrderList.length > 0 ? (
              sortedOrderList.map((orderItem) => (
                <div key={orderItem._id} className="border rounded-lg p-4 flex flex-col gap-2 bg-gray-50 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">Order: {orderItem._id}</span>
                    <Badge
                      className={`py-1 px-3 ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-black"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">Date: {orderItem?.orderDate?.split("T")[0]}</div>
                  <div className="text-lg font-bold text-primary">₹{orderItem?.totalAmount}</div>
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => handleFetchOrderDetails(orderItem?._id)}
                  >
                    View Details
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">No orders found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDetailsDialog} onOpenChange={handleCloseDialog}>
        <AdminOrderDetailsView orderDetails={orderDetails} />
      </Dialog>
    </>
  );
}

export default AdminOrdersView;
