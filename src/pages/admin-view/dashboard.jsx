// src/components/admin-view/AdminDashboard.jsx
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
  Moon,
  Sun,
  Percent,
 CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
import CategorySalesChart from "@/components/admin-view/charts/CategorySalesChart";
import OrderStatusChart from "@/components/admin-view/charts/OrderStatusChart";
import RecentOrdersTable from "@/components/admin-view/tables/RecentOrdersTable";
import Sparkline from "@/components/admin-view/charts/Sparkline";
import BrandPerformanceTable from "@/components/admin-view/tables/BrandPerformanceTable";
import PaymentMethodDonutChart from "@/components/admin-view/charts/PaymentMethodDonutChart";
import TopCustomersTable from "@/components/admin-view/tables/TopCustomersTable";
import { getImageUrl } from "@/utils/imageUtils";

// ──────────────────────────────────────────────────────────────
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
  monthlyRevenue: 0,
weeklyRevenue: 0,
todayRevenue: 0,
bestSellingBrand: null,
bestSellingCategory: null,
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { featureImageList = [] } = useSelector((state) => state.commonFeature || {});
  const {
    salesOverview = [],
    orderStats = null,
    orderList = [],
    isLoading = false,
  } = useSelector((state) => state.adminOrder || {});

  const [uploadedFeatureImages, setUploadedFeatureImages] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const currency = (n) => `₹${Number(n || 0).toLocaleString()}`;

  // ──────────────────────────────────────────────────────────────
  // Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // ──────────────────────────────────────────────────────────────
  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => handleRefresh(), 30000);
    return () => clearInterval(interval);
  }, []);

  // ──────────────────────────────────────────────────────────────
  // Safe refresh handler
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

  // ──────────────────────────────────────────────────────────────
  // Feature images
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

  // ──────────────────────────────────────────────────────────────
  // Safe sparkline data
  const getSparkline = (data, key) =>
    Array.isArray(data) ? data.slice(-7).map((d) => ({ value: d[key] ?? 0 })) : [];

  // ──────────────────────────────────────────────────────────────
  // Safe change formatter
  const formatChange = (change) => {
    if (!change || typeof change !== "object") return "N/A";
    const { value = 0, percentage = 0 } = change;
    const sign = value > 0 ? "+" : "";
    return `${sign}${value} (${sign}${percentage}%)`;
  };

  // ──────────────────────────────────────────────────────────────
  // Safe stats (never null)
  const stats = orderStats ? { ...DEFAULT_STATS, ...orderStats } : DEFAULT_STATS;

  // ──────────────────────────────────────────────────────────────
  // PDF Export
  const exportPDF = async () => {
    const element = document.getElementById("dashboard-content");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, width, height);
      pdf.save(`admin-report-${format(new Date(), "yyyy-MM-dd_HH-mm")}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  };

  // ──────────────────────────────────────────────────────────────
  // Loading state
  if (isLoading && !refreshing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 mr-3" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // Render
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* HEADER */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={exportPDF}>
                <Download className="h-4 w-4 mr-1" /> PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
                />
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
                className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
              >
                <Download className="h-4 w-4" /> Export
              </CSVLink>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div id="dashboard-content" className="p-6 space-y-8 max-w-7xl mx-auto">
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
          <DashboardCard
           title="Avg Order Value"
           icon={<DollarSign className="text-emerald-500" size={28} />}
           value={currency(stats.avgOrderValue)}
           change="lifetime"
         />
         <DashboardCard
           title="Repeat Customers"
           icon={<Users className="text-pink-500" size={28} />}
           value={`${stats.repeatCustomers} (${stats.repeatCustomerRate}% )`}
           change="lifetime"
         />
         <DashboardCard
           title="Cancel Rate"
           icon={<Percent className="text-red-500" size={28} />}
           value={`${stats.cancelRate}%`}
           change="lifetime"
         />
         <DashboardCard
           title="Return Rate"
           icon={<Percent className="text-orange-500" size={28} />}
           value={`${stats.returnRate}%`}
           change="lifetime"
         />
          <DashboardCard
  title="Monthly Revenue"
  icon={<DollarSign className="text-green-600" size={28} />}
  value={currency(stats.monthlyRevenue)}
  change="vs last month"
/>

<DashboardCard
  title="Weekly Revenue"
  icon={<TrendingUp className="text-orange-500" size={28} />}
  value={currency(stats.weeklyRevenue)}
  change="vs last week"
/>

<DashboardCard
  title="Today's Revenue"
  icon={<DollarSign className="text-blue-500" size={28} />}
  value={currency(stats.todayRevenue)}
  change="today"
/>

<DashboardCard
  title="Top Brand"
  icon={<Package className="text-purple-500" size={28} />}
  value={stats.bestSellingBrand ?? "—"}
  change="Best performer"
/>

<DashboardCard
  title="Top Category"
  icon={<Package className="text-rose-500" size={28} />}
  value={stats.bestSellingCategory ?? "—"}
  change="Best performer"
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
              {salesOverview.length > 0 ? (
                <SalesOverviewChart data={salesOverview} />
              ) : (
                <div className="h-[280px] flex items-center justify-center text-gray-400">
                  No sales data
                </div>
              )}
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
              <OrderStatusChart data={stats} />
            </CardContent>
          </Card>
        </div>

{/* NEW ANALYTICS ROW */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
   {/* Top Customers */}
   <Card className="shadow-sm">
     <CardHeader>
       <CardTitle className="flex items-center gap-2">
         <Users className="h-5 w-5 text-blue-500" />
         Top Customers
       </CardTitle>
     </CardHeader>
     <CardContent>
       <TopCustomersTable data={stats.topCustomers} />
     </CardContent>
   </Card>

   {/* Brand Sales */}
   <Card className="shadow-sm">
     <CardHeader>
       <CardTitle className="flex items-center gap-2">
         <Package className="h-5 w-5 text-green-500" />
         Brand Sales Performance
       </CardTitle>
     </CardHeader>
     <CardContent>
       <BrandPerformanceTable data={stats.brandSalesPerformance} />
     </CardContent>
   </Card>
 </div>

 {/* Payment Distribution */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
   <Card className="shadow-sm">
     <CardHeader>
       <CardTitle className="flex items-center gap-2">
         <CreditCard className="h-5 w-5 text-violet-500" />
         Payment Method Distribution
      </CardTitle>
     </CardHeader>
     <CardContent>
       <PaymentMethodDonutChart data={stats.paymentMethodBreakdown} />
     </CardContent>
   </Card>

   {/* Keep Order Status or any other panel here */}
   <Card className="shadow-sm">
     <CardHeader>
       <CardTitle className="flex items-center gap-2">
         <BarChart3 className="h-5 w-5 text-blue-500" />
         Order Status
       </CardTitle>
     </CardHeader>
     <CardContent>
       <OrderStatusChart data={stats} />
     </CardContent>
   </Card>
 </div>

        {/* LOW STOCK */}
        {stats.lowStock?.length > 0 && (
          <Card className="shadow-sm border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.lowStock.map((p) => (
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
            <RecentOrdersTable onOrderStatusChange={handleRefresh} />
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
 const isPositive = change && typeof change === "string"
   ? (change.includes("+") || !change.startsWith("-"))
   : true; // default positive styling
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
