// src/pages/admin-view/dashboard.jsx
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Package,
  DollarSign,
  Truck,
  Users,
  Loader2,
  TrendingUp,
  BarChart3,
  RefreshCw,
  AlertCircle,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import {
  fetchOrdersForAdmin,
  fetchSalesOverview,
  fetchOrderStats,
} from "@/store/admin/order-slice";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import ProductImageUpload from "@/components/admin-view/image-upload";
import SalesOverviewChart from "@/components/admin-view/charts/SalesOverviewChart";
import TopProductsChart from "@/components/admin-view/charts/TopProductsChart";
import OrderStatusChart from "@/components/admin-view/charts/OrderStatusChart";
import RecentOrdersTable from "@/components/admin-view/tables/RecentOrdersTable";
import Sparkline from "@/components/admin-view/charts/Sparkline";
import { getImageUrl } from "@/utils/imageUtils";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { salesOverview, orderStats, orderList, isLoading } = useSelector(
    (state) => state.adminOrder
  );

  const [uploadedFeatureImages, setUploadedFeatureImages] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      dispatch(fetchSalesOverview()),
      dispatch(fetchOrderStats()),
      dispatch(fetchOrdersForAdmin({ page: 1, limit: 10 })),
      dispatch(getFeatureImages()),
    ]).finally(() => {
      setRefreshing(false);
      setLastUpdated(new Date());
    });
  }, [dispatch]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleUploadFeatureImages = () => {
    if (uploadedFeatureImages.length === 0) return;
    Promise.all(
      uploadedFeatureImages.map((url) => dispatch(addFeatureImage(url)))
    ).then(() => {
      dispatch(getFeatureImages());
      setUploadedFeatureImages([]);
    });
  };

  const handleDeleteFeatureImage = (id) => {
    dispatch(deleteFeatureImage(id)).then(() => dispatch(getFeatureImages()));
  };

  const sparkline7d = (data, key) =>
    data.slice(-7).map((d) => ({ value: d[key] || 0 }));

  const formatChange = (change) => {
    if (!change) return "N/A";
    const { value = 0, percentage = 0 } = change;
    const sign = value > 0 ? "+" : "";
    return `${sign}${value} (${sign}${percentage}%)`;
  };

  if (isLoading && !refreshing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 mr-3" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <CSVLink
            data={orderList || []}
            filename={`orders-${format(new Date(), "yyyy-MM-dd")}.csv`}
            className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
          >
            <Download className="h-4 w-4" /> Export
          </CSVLink>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <DashboardCard
          title="Total Orders"
          icon={<ShoppingCart className="text-blue-500" size={28} />}
          value={orderStats?.totalOrders || 0}
          change={formatChange(orderStats?.ordersChange)}
          sparklineData={sparkline7d(salesOverview, "orders")}
          sparklineColor="#3b82f6"
        />
        <DashboardCard
          title="Revenue"
          icon={<DollarSign className="text-green-500" size={28} />}
          value={`₹${(orderStats?.totalRevenue || 0).toLocaleString()}`}
          change={`${orderStats?.revenueGrowthPercentage > 0 ? "+" : ""}${orderStats?.revenueGrowthPercentage || 0}% vs last month`}
          sparklineData={sparkline7d(salesOverview, "revenue")}
          sparklineColor="#10b981"
        />
        <DashboardCard
          title="Pending"
          icon={<Package className="text-yellow-500" size={28} />}
          value={orderStats?.pendingOrders || 0}
          change={formatChange(orderStats?.pendingChange)}
        />
        <DashboardCard
          title="Delivered"
          icon={<Truck className="text-indigo-500" size={28} />}
          value={orderStats?.deliveredOrders || 0}
          change={formatChange(orderStats?.deliveredChange)}
        />
        <DashboardCard
          title="Customers"
          icon={<Users className="text-purple-500" size={28} />}
          value={orderStats?.totalCustomers || 0}
          change={formatChange(orderStats?.customersChange)}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Sales Overview (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SalesOverviewChart data={salesOverview} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusChart data={orderStats} />
          </CardContent>
        </Card>
      </div>

      {/* TOP PRODUCTS */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Top 5 Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TopProductsChart data={orderStats?.topProducts || []} />
        </CardContent>
      </Card>

      {/* LOW STOCK ALERT */}
      {orderStats?.lowStock?.length > 0 && (
        <Card className="shadow-sm border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {orderStats.lowStock.map((p) => (
                <div
                  key={p._id}
                  className="flex justify-between items-center p-2 bg-red-50 rounded"
                >
                  <span className="font-medium">{p.title}</span>
                  <span className="text-red-600">Only {p.totalStock} left</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RECENT ORDERS */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-500" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable
            onOrderStatusChange={handleRefresh}
          />
        </CardContent>
      </Card>

      {/* FEATURE IMAGES */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Homepage Feature Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductImageUpload
            uploadedImageUrls={uploadedFeatureImages}
            setUploadedImageUrls={setUploadedFeatureImages}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          <Button
            onClick={handleUploadFeatureImages}
            className="mt-4 w-full"
            disabled={uploadedFeatureImages.length === 0 || imageLoadingState}
          >
            {imageLoadingState ? (
              <>Uploading...</>
            ) : (
              "Upload to Features"
            )}
          </Button>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {featureImageList?.length > 0 ? (
              featureImageList.map((img) => (
                <div key={img._id} className="relative group">
                  <img
                    src={getImageUrl(img.image)}
                    alt="Feature"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                    onClick={() => handleDeleteFeatureImage(img._id)}
                  >
                    Delete
                  </Button>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No feature images
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const DashboardCard = ({
  title,
  value,
  icon,
  change,
  sparklineData,
  sparklineColor,
}) => {
  const isPositive = change && (change.includes("+") || !change.startsWith("-"));
  return (
    <Card className="shadow-sm hover:shadow-md transition">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
          <p className={`text-sm mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {change}
          </p>
          {sparklineData && (
            <div className="mt-3 w-24">
              <Sparkline data={sparklineData} color={sparklineColor} />
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-gray-100">{icon}</div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
