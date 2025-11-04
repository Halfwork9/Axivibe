import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

import { fetchOrdersForAdmin } from "@/store/admin/order-slice";
import api from "@/api";

import ProductImageUpload from "@/components/admin-view/image-upload";
import SalesOverviewChart from "@/components/admin-view/charts/SalesOverviewChart";
import TopProductsChart from "@/components/admin-view/charts/TopProductsChart";
import RecentOrdersTable from "@/components/admin-view/tables/RecentOrdersTable";
import { getImageUrl } from "@/utils/imageUtils";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import Sparkline from "@/components/admin-view/charts/Sparkline";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  
  // ✅ FIX: Select only the necessary state from the adminOrder slice
  const { orderList, isLoading: ordersLoading } = useSelector(
    (state) => state.adminOrder
  );

  const [uploadedFeatureImages, setUploadedFeatureImages] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [stats, setStats] = useState(null);
  const [salesOverview, setSalesOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // ✅ NEW: Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, salesRes] = await Promise.all([
        api.get("/admin/orders/stats"),
        api.get("/admin/orders/sales-overview"),
      ]);

      console.log("Stats response:", statsRes.data); // Debug log
      setStats(statsRes.data?.data);
      setSalesOverview(salesRes.data?.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ NEW: Function to manually refresh data
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
    dispatch(getFeatureImages());
    dispatch(fetchOrdersForAdmin({ page: 1, limit: 10 }));
  };

  useEffect(() => {
    fetchDashboardData();
    dispatch(getFeatureImages());
    // ✅ FIX: Dispatch the new thunk to fetch the first page of orders
    dispatch(fetchOrdersForAdmin({ page: 1, limit: 10 }));
  }, [dispatch]);

  function handleUploadFeatureImages() {
    if (uploadedFeatureImages.length === 0) return;
    const uploadPromises = uploadedFeatureImages.map((imageUrl) =>
      dispatch(addFeatureImage(imageUrl))
    );
    Promise.all(uploadPromises).then(() => {
      dispatch(getFeatureImages());
      setUploadedFeatureImages([]);
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  // Prepare data for sparklines and dynamic changes
  const orderSparklineData = salesOverview.slice(-7).map(d => ({ value: d.orders }));
  const revenueSparklineData = salesOverview.slice(-7).map(d => ({ value: d.revenue }));
  
  const formatChange = (change) => {
    const { value, percentage } = change || {};
    const sign = value > 0 ? "+" : "";
    return `${sign}${value} (${sign}${percentage}%) this week`;
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">View Store</Button>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <DashboardCard
          title="Total Orders"
          icon={<ShoppingCart className="text-blue-500" size={28} />}
          value={stats?.totalOrders || 0}
          change={formatChange(stats?.ordersChange)}
          sparklineData={orderSparklineData}
          sparklineColor="#3b82f6"
        />
        <DashboardCard
          title="Revenue"
          icon={<DollarSign className="text-green-500" size={28} />}
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          change={`${stats?.revenueGrowthPercentage > 0 ? '+' : ''}${stats?.revenueGrowthPercentage || 0}% vs last month`}
          sparklineData={revenueSparklineData}
          sparklineColor="#10b981"
        />
        <DashboardCard
          title="Pending Orders"
          icon={<Package className="text-yellow-500" size={28} />}
          value={stats?.pendingOrders || 0}
          change={formatChange(stats?.pendingChange)}
        />
        <DashboardCard
          title="Delivered"
          icon={<Truck className="text-indigo-500" size={28} />}
          value={stats?.deliveredOrders || 0}
          change={formatChange(stats?.deliveredChange)}
        />
        <DashboardCard
          title="Customers"
          icon={<Users className="text-purple-500" size={28} />}
          value={stats?.totalCustomers || 0}
          change={formatChange(stats?.customersChange)}
        />
      </div>

      {/* CHARTS SECTION WITH TITLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Sales Overview (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SalesOverviewChart data={salesOverview} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Top 5 Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TopProductsChart data={stats?.topProducts || []} />
          </CardContent>
        </Card>
      </div>

      {/* RECENT ORDERS */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-500" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✅ FIX: Pass only the list and loading state. The table now handles its own pagination. */}
          <RecentOrdersTable 
            orders={orderList || []} 
            isLoading={ordersLoading}
            onOrderStatusChange={handleRefresh} // ✅ NEW: Refresh data when order status changes
          />
        </CardContent>
      </Card>

      {/* FEATURE IMAGES MANAGEMENT */}
      <Card className="shadow-sm mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Homepage Feature Images
          </CardTitle>
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
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Uploading...
              </>
            ) : (
              "Upload to Features"
            )}
          </Button>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {Array.isArray(featureImageList) && featureImageList.length > 0 ? (
              featureImageList.map((img) => (
                <div
                  key={img._id}
                  className="relative border rounded-lg overflow-hidden shadow-sm"
                >
                  <img
                    src={getImageUrl(img.image)}
                    alt="Feature"
                    className="w-full h-48 object-cover rounded-md"
                    crossOrigin="anonymous"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleDeleteFeatureImage(img._id)}
                  >
                    Delete
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No feature images found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* 🔸 Enhanced Reusable Dashboard Card */
const DashboardCard = ({ title, value, icon, change, sparklineData, sparklineColor }) => {
  const isPositive = change && (change.includes('+') || !change.startsWith('-'));

  return (
    <Card className="shadow-sm">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
          <p className={`text-sm mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {change}
          </p>
          {sparklineData && (
            <div className="mt-2 w-24">
              <Sparkline data={sparklineData} color={sparklineColor} />
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-gray-100 ml-4">{icon}</div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
