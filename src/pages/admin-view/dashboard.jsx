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
  RefreshCw,
  BarChart3,
  TrendingUp,
  Download,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import { fetchOrdersForAdmin, fetchSalesOverview, fetchOrderStats } from "@/store/admin/order-slice";
import { getFeatureImages } from "@/store/common-slice";
import ProductImageUpload from "@/components/admin-view/image-upload";
import SalesOverviewChart from "@/components/admin-view/charts/SalesOverviewChart";
import TopProductsChart from "@/components/admin-view/charts/TopProductsChart";
import OrderStatusChart from "@/components/admin-view/charts/OrderStatusChart";
import CategorySalesChart from "@/components/admin-view/charts/CategorySalesChart";
import CustomerInsights from "@/components/admin-view/sections/CustomerInsights";
import RecentOrdersTable from "@/components/admin-view/tables/RecentOrdersTable";
import Sparkline from "@/components/admin-view/charts/Sparkline";

const DEFAULT_STATS = {
  totalOrders: 0,
  totalRevenue: 0,
  pendingOrders: 0,
  deliveredOrders: 0,
  totalCustomers: 0,
  revenueGrowthPercentage: 0,
  topProducts: [],
  ordersChange: { value: 0, percentage: 0 },
  pendingChange: { value: 0, percentage: 0 },
  deliveredChange: { value: 0, percentage: 0 },
  customersChange: { value: 0, percentage: 0 },
  lowStock: [],
  confirmedOrders: 0,
  shippedOrders: 0,
  categorySales: [],
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { salesOverview = [], orderStats = null, orderList = [], isLoading = false } =
    useSelector((state) => state.adminOrder || {});

  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filters, setFilters] = useState({ status: "all", dateRange: "30d" });

  const stats = orderStats ? { ...DEFAULT_STATS, ...orderStats } : DEFAULT_STATS;
   // Feature images
  // ──────────────────────────────────────────────────────────────
  const handleUploadFeatureImages = () => {
    if (!uploadedFeatureImages.length) return;
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
// Redux state
  const { featureImageList = [] } = useSelector((state) => state.commonFeature || {});
  const {
    salesOverview = [],
    orderStats = null,
    orderList = [],
    isLoading = false,
  } = useSelector((state) => state.adminOrder || {});

  // Local state
  const [uploadedFeatureImages, setUploadedFeatureImages] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // ──────────────────────────────────────────────────────────────
  // Auto-refresh every 30s
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => handleRefresh(), 30000);
    return () => clearInterval(interval);
  }, []);

  // Safe sparkline data
  const getSparkline = (data, key) =>
    Array.isArray(data) ? data.slice(-7).map((d) => ({ value: d[key] ?? 0 })) : [];

 const formatChange = (change) => {
    if (!change || typeof change !== "object") return "N/A";
    const { value = 0, percentage = 0 } = change;
    const sign = value > 0 ? "+" : "";
    return `${sign}${value} (${sign}${percentage}%)`;
  };


  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.allSettled([
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

  if (isLoading && !refreshing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 mr-3" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <CSVLink
            data={orderList}
            headers={[
              { label: "Order ID", key: "_id" },
              { label: "Customer", key: "userId.userName" },
              { label: "Amount", key: "totalAmount" },
              { label: "Status", key: "orderStatus" },
              { label: "Payment", key: "paymentStatus" },
              { label: "Date", key: "createdAt" },
            ]}
            filename={`orders-${format(new Date(), "yyyy-MM-dd")}.csv`}
            className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
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
          value={stats.totalOrders}
          change={formatChange(stats.ordersChange)}
          sparklineData={getSparkline(salesOverview, "orders")}
          sparklineColor="#3b82f6"
        />
        <DashboardCard
          title="Revenue"
          icon={<DollarSign className="text-green-500" size={28} />}
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          change={`${stats.revenueGrowthPercentage > 0 ? "+" : ""}${stats.revenueGrowthPercentage}% vs last month`}
          sparklineData={getSparkline(salesOverview, "revenue")}
          sparklineColor="#10b981"
        />
        <DashboardCard
          title="Pending"
          icon={<Package className="text-yellow-500" size={28} />}
          value={stats.pendingOrders}
          change={formatChange(stats.pendingChange)}
        />
        <DashboardCard
          title="Delivered"
          icon={<Truck className="text-indigo-500" size={28} />}
          value={stats.deliveredOrders}
          change={formatChange(stats.deliveredChange)}
        />
        <DashboardCard
          title="Customers"
          icon={<Users className="text-purple-500" size={28} />}
          value={stats.totalCustomers}
          change={formatChange(stats.customersChange)}
        />
      </div>



      {/* FILTER BAR */}
      <Card className="shadow-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Filters:</span>
            <select
              className="border rounded-md px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700"
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="border rounded-md px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700"
              value={filters.dateRange}
              onChange={(e) => setFilters((f) => ({ ...f, dateRange: e.target.value }))}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* CHART ROW: SALES OVERVIEW + CATEGORY SALES */}
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
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategorySalesChart data={stats.categorySales || []} />
          </CardContent>
        </Card>
      </div>

      {/* TOP PRODUCTS + CUSTOMER INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top 5 Products (by Quantity)</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProductsChart data={stats.topProducts} />
          </CardContent>
        </Card>

        <CustomerInsights />
      </div>

      {/* LOW STOCK + RECENT ORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats.lowStock?.length > 0 && (
          <Card className="shadow-sm border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                ⚠️ Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.lowStock.map((p) => (
                <div key={p._id} className="flex justify-between p-2 bg-red-50 dark:bg-red-900 rounded mb-1">
                  <span>{p.title}</span>
                  <span className="text-red-600">Only {p.totalStock} left</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable filters={filters} onOrderStatusChange={handleRefresh} />
          </CardContent>
        </Card>
      </div>
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
            {imageLoadingState ? "Uploading..." : "Upload to Features"}
          </Button>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {featureImageList.length > 0 ? (
              featureImageList.map((img) => (
                <div key={img._id} className="relative group">
                  <img
                    src={getImageUrl(img.image)}
                    alt="Feature"
                    className="w-full h-48 object-cover rounded-lg"
                    crossOrigin="anonymous"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.png"; // fallback
                    }}
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

// ──────────────────────────────────────────────────────────────
// Reusable Dashboard Card
// ──────────────────────────────────────────────────────────────
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
          <p
            className={`text-sm mt-1 ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {change}
          </p>
          {sparklineData && sparklineData.length > 0 && (
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
