// src/components/admin-view/dashboard.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, BarChart3, LineChart, PieChart, ShoppingCart, Users, Package, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { getAllProducts } from "@/store/admin/product-slice";
import { getAllUsers } from "@/store/admin/user-slice";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowUp, ArrowDown, Eye, MoreHorizontal } from "lucide-react";
import { Loader2 } from "lucide-react";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { orderList } = useSelector((state) => state.adminOrder);
  const { productList } = useSelector((state) => state.adminProducts);
  const { userList } = useSelector((state) => state.adminUsers);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
    const processingOrders = orderList.filter(order => order.orderStatus === "inProcess" || order.orderStatus === "inShipping").length;
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
        const product = productList.find(p => p._id === productId);
        return {
          productId,
          title: product?.title || "Unknown Product",
          quantity,
          image: product?.image || "",
          price: product?.price || 0
        };
      });

    // Calculate monthly revenue (last 6 months)
    const monthlyRevenue = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthRevenue = orderList
        .filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate.getMonth() === monthDate.getMonth() && 
                 orderDate.getFullYear() === monthDate.getFullYear() &&
                 order.orderStatus === "delivered"
        })
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      monthlyRevenue.push({
        month: monthDate.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue
      });
    }

    setDashboardStats({
      totalRevenue,
      totalOrders: orderList.length,
      totalProducts: productList.length,
      totalUsers: userList.length,
      pendingOrders,
      loading: false,
      processingOrders,
      deliveredOrders,
      recentOrders: orderList.slice(0, 5),
      topSellingProducts,
      monthlyRevenue
    });
  };

  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      await dispatch(getAllOrdersForAdmin({ sortBy: "date-desc", page: 1, limit: 100 }));
      await dispatch(getAllProducts({ sortBy: "date-desc", page: 1, limit: 100 }));
      await dispatch(getAllUsers());
      dispatch(getFeatureImages());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Failed to load dashboard data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteFeatureImage = (id) => {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Feature image deleted successfully",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
            <p className="mt-2">Loading dashboard...</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{dashboardStats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{dashboardStats.totalOrders}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{dashboardStats.totalProducts}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{dashboardStats.totalUsers}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dashboardStats.monthlyRevenue}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <LineChart
                      dataKey="month"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: "#8884d8" }}
                    />
                  />
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart
                      data={[
                        { name: "Pending", value: dashboardStats.pendingOrders, fill: "#f59e0b" },
                        { name: "Processing", value: dashboardStats.processingOrders, fill: "#3b82f6" },
                        { name: "Delivered", value: dashboardStats.deliveredOrders, fill: "#10b981" },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                    <PieChart
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      labelLine={false}
                      label={({ cx, cy, midAngle, innerRadius, percent, index }) => {
                        return (
                          <text
                            x={cx}
                            y={cy - 10}
                            fill="white"
                            textAnchor="middle"
                            textAnchorOffset="middle"
                            className="fill-current text-xs"
                          >
                            {`${percent.toFixed(0)}%`}
                          </text>
                        );
                      }}
                    />
                  </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Orders */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.recentOrders.length > 0 ? (
                dashboardStats.recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{order._id.substring(0, 8)}...</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.orderDate), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`${
                          order.orderStatus === "delivered"
                              ? "bg-green-500"
                              : order.orderStatus === "rejected"
                              ? "bg-red-600"
                              : "bg-blue-500"
                        }`}
                      >
                        {order.orderStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No recent orders</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Top Selling Products */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.topSellingProducts.length > 0 ? (
                dashboardStats.topSellingProducts.map((product, index) => (
                  <div key={product.productId} className="flex items-center space-x-4 p-3 border-b last:border-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.title}</p>
                      <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                      <p className="font-bold">₹{product.price}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No products sold yet</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feature Images */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Feature Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductImageUpload />
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featureImageList && featureImageList.length > 0 ? (
                featureImageList.map((featureImgItem, index) => (
                  <div
                      key={featureImgItem._id || index}
                      className="relative border rounded-lg overflow-hidden"
                  >
                    <img
                      src={featureImgItem.image}
                      alt="Feature"
                      className="w-full h-32 object-cover rounded-lg"
                      crossOrigin="anonymous"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )) : (
                <p className="text-gray-500 text-center py-8">No feature images found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {!isLoading && (
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/products">
            <Button variant="outline" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Manage Products
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="outline" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Manage Orders
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage Users
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

// Helper component for responsive charts
const ResponsiveContainer = ({ children, width, height, ...props }) => {
  return (
    <div style={{ width, height, ...props }}>
      {children}
    </div>
  );
};

export default AdminDashboard;
