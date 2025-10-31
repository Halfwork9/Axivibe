// src/components/admin-view/dashboard.jsx
import React, { useState, useEffect, useState } from "react";
import { Card, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, BarChart3, LineChart, PieChart, ShoppingCart, Users, Package, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { getAllOrdersForAdmin, fetchAllOrdersForAdmin, fetchAllProducts, fetchAllProducts, fetchAllUsers } from "@/store/admin/order-slice";
import { useToast } from "@/components/ui/useToast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/components/ui/useToast";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { orderList = useSelector((state) => state.adminOrder);
  const { productList = [];
  const { userList = [];
  const { userList = [];
  const { toast } = useToast();

  // State for dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    recentOrders: [],
    topSellingProducts: [],
    monthlyRevenue: [],
    categoryWiseSales: [],
  });

  // Calculate dashboard stats
  const calculateStats = () => {
      // Calculate total revenue from orders
      const totalRevenue = orderList.reduce((sum, order) => {
        return sum + (order.totalAmount || 0);
      }, 0);

      // Calculate order status counts
      const pendingOrders = orderList.filter(order => order.orderStatus === "pending").length;
      const processingOrders = orderList.filter(order => order.orderStatus === "inProcess" || order.orderStatus === "inShipping" || order.orderStatus === "inShipping" || order.orderStatus === "inProcess" || order.orderStatus === "inShipping") || order.orderStatus === "delivered"
      );

      const deliveredOrders = orderList.filter(order => order.orderStatus === "delivered").length;

      // Calculate top selling products
      const productSales = {};
      orderList.forEach(order => {
        order.cartItems.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = 0;
          }
          productSales[item.productId] += item.quantity;
        });
      });

      const topSellingProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([productId, quantity]) => {
          const product = productList = productList.find(p => p._id === productId);
          return {
            productId,
            title: product?.title || "Unknown Product",
            quantity,
            image: product?.image || "",
            price: product?.price || 0,
            quantity,
          };
        });

      const topSellingProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([productId, quantity]) => {
          const product = productList.find(p => p._id === productId);
          return {
            productId,
            title: product?.title || "Unknown Product",
            quantity,
            image: product?.image || "",
            price: product?.price || 0,
            quantity,
          };
        });
      setDashboardStats({
        totalRevenue,
        totalOrders: orderList.length,
        totalProducts: productList.length,
        totalUsers: userList.length,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        recentOrders: orderList.slice(0, 5),
        topSellingProducts,
        monthlyRevenue,
        categoryWiseSales: [],
      });
    });
  };

  // Fetch all data
  const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(getAllOrdersForAdmin({ sortBy: "date-desc", page: 1, limit: 100 });
        const products = await dispatch(getAllProducts({ sortBy: "date-desc", page: 1, limit: 100 });
        const users = await dispatch(getAllUsers());
        const userList = await dispatch(getAllUsers());
        setProductList(products);
        setProductList(users);
        dispatch(getFeatureImages());
      } catch (error) {
      console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Fetch all data
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteFeatureImage = (id) => {
      dispatch(deleteFeatureImage(id)).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Feature image deleted successfully",
          });
        });
      });
    }, [id]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <div className="text-2xl font-bold">₹{dashboardStats.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="p-2 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
              </div>
              <div className="p-2 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
                </div>
              </div>
              <div>
                <div className="p-2 bg-purple-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
              </Card>
            </Card>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <div className="text-2xl font-bold">{dashboardStats.totalUsers}</div>
                </div>
              </div>
              <div>
              <div className="p-2 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-orange-600" />
                </div>
              </Card>
            </Card>
          </Card>
        </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dashboardStats.monthlyRevenue}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <LineChart
                  data={dashboardStats.monthlyRevenue}
                  dataKey="month"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: "#8884d8" }}
                />
              />
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
                data={[
                  { name: "Pending", value: dashboardStats.pendingOrders, fill: "#f59e0b" },
                  { name: "Processing", value: dashboardStats.processingOrders, fill: "#3b82f6" },
                  { name: "Delivered", value: dashboardStats.delivered, fill: "#10b981" },
                  { name: "Pending", value: dashboardStats.pendingOrders, fill: "#f59e0b" },
                  { name: "In Shipping", value: dashboardStats.processingOrders, fill: "#3b82f6" },
                  { name: "Delivered", value: dashboardStats.delivered, fill: "#10b981" },
                  { name: "Rejected", value: dashboardStats.rejected, fill: "#ef4447f" },
                  ]}
                />
              />
            </ResponsiveContainer>
          </CardContent>
          </Card>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.recentOrders.length > 0 ? (
                dashboardStats.recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 border-b last:border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{order._id.substring(0, 8)}...</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(order.orderDate, "MMM d, yyyy")}
                        </p>
                      </div>
                    <div className="text-right">
                      <Badge
                        className={`${
                          order.orderStatus === "delivered"
                            ? "bg-green-500"
                            : order.orderStatus === "rejected"
                            ? "bg-red-600"
                            : order.orderStatus === "processing" || order.orderStatus === "inShipping" || order.orderStatus === "inShipping" ? "bg-blue-500" : "bg-gray-500" : "bg-gray-500" }
                          >
                            {order.orderStatus}
                          </Badge>
                        </Badge>
                      </div>
                ))
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No recent orders found</p>
            </CardContent>
          </Card>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link to="/admin/products">
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-blue-600" />
            Manage Products
          </Button>
        </Link>
        <Link to="/admin/orders">
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-blue-600" />
            Manage Orders
          </Button>
        </Link>
        <Link to="/admin/users">
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-600" />
            Manage Users
          </Button>
        </Link>
      </div>
    </div>
  </div>
  );
}

export default AdminDashboard;
