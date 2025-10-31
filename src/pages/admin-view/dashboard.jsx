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
} from "lucide-react";

import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
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

function AdminDashboard() {
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { orderList = [], isLoading = false, pagination = null } =
  useSelector((state) => state.adminOrder) || {};


  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const [stats, setStats] = useState(null);
  const [salesOverview, setSalesOverview] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Fetch dashboard stats and analytics
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, salesRes] = await Promise.all([
          api.get("/admin/orders/stats"),
          api.get("/admin/orders/sales-overview"),
        ]);

        setStats(statsRes.data?.data);
        setSalesOverview(salesRes.data?.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    dispatch(getFeatureImages());
    dispatch(getAllOrdersForAdmin({ sortBy: "date-desc", page: 1 }));
  }, [dispatch]);

  // 🧠 Feature image upload handlers
  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return;
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
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

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <Button variant="outline">View Store</Button>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <DashboardCard
          title="Total Orders"
          icon={<ShoppingCart className="text-blue-500" size={28} />}
          value={stats?.totalOrders || 0}
          change="+12%"
        />
        <DashboardCard
          title="Revenue"
          icon={<DollarSign className="text-green-500" size={28} />}
          value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
          change="+8%"
        />
        <DashboardCard
          title="Pending Orders"
          icon={<Package className="text-yellow-500" size={28} />}
          value={stats?.pendingOrders || 0}
          change="-3%"
        />
        <DashboardCard
          title="Delivered"
          icon={<Truck className="text-indigo-500" size={28} />}
          value={stats?.deliveredOrders || 0}
          change="+15%"
        />
        <DashboardCard
          title="Customers"
          icon={<Users className="text-purple-500" size={28} />}
          value={stats?.totalCustomers || 0}
          change="+5%"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesOverviewChart data={salesOverview} />
        <TopProductsChart data={stats?.topProducts || []} />
      </div>

      {/* RECENT ORDERS */}
      <RecentOrdersTable orders={orderList || []} isLoading={ordersLoading} />

      {/* FEATURE IMAGES MANAGEMENT */}
      <Card className="shadow-sm mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Homepage Feature Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          <Button
            onClick={handleUploadFeatureImage}
            className="mt-4 w-full"
            disabled={!uploadedImageUrl}
          >
            {imageLoadingState ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {Array.isArray(featureImageList) && featureImageList.length > 0 ? (
              featureImageList.map((img, i) => (
                <div
                  key={img._id || i}
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
              <p className="text-gray-500 text-center">
                No feature images found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* 🔸 Reusable Dashboard Card */
const DashboardCard = ({ title, value, icon, change }) => (
  <Card className="shadow-sm">
    <CardContent className="p-5 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        <p
          className={`text-sm mt-1 ${
            change.startsWith("+") ? "text-green-500" : "text-red-500"
          }`}
        >
          {change} from last week
        </p>
      </div>
      <div className="p-3 rounded-full bg-gray-100">{icon}</div>
    </CardContent>
  </Card>
);

export default AdminDashboard;
