import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { getImageUrl } from "@/utils/imageUtils";
import {
  ShoppingCart,
  Package,
  DollarSign,
  Truck,
  TrendingUp,
  BarChart3,
  Users,
  Loader2,
} from "lucide-react";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    customers: 0,
  });

  useEffect(() => {
    dispatch(getFeatureImages());
    // 🧠 Simulated stats (replace with API call later)
    setTimeout(() => {
      setStats({
        totalOrders: 242,
        totalRevenue: 95860,
        pendingOrders: 18,
        deliveredOrders: 210,
        customers: 420,
      });
    }, 600);
  }, [dispatch]);

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
          value={stats.totalOrders}
          change="+12%"
          color="blue"
        />
        <DashboardCard
          title="Revenue"
          icon={<DollarSign className="text-green-500" size={28} />}
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          change="+8%"
          color="green"
        />
        <DashboardCard
          title="Pending Orders"
          icon={<Package className="text-yellow-500" size={28} />}
          value={stats.pendingOrders}
          change="-3%"
          color="yellow"
        />
        <DashboardCard
          title="Delivered"
          icon={<Truck className="text-indigo-500" size={28} />}
          value={stats.deliveredOrders}
          change="+15%"
          color="indigo"
        />
        <DashboardCard
          title="Customers"
          icon={<Users className="text-purple-500" size={28} />}
          value={stats.customers}
          change="+5%"
          color="purple"
        />
      </div>

      {/* ANALYTICS PREVIEW SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Sales Overview
            </CardTitle>
            <TrendingUp className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="h-[220px] flex items-center justify-center text-gray-400">
              📈 Chart placeholder (use Chart.js / Recharts later)
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Category Performance
            </CardTitle>
            <BarChart3 className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Electronics", "Fashion", "Home Decor", "Beauty", "Books"].map(
                (cat, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-gray-600">{cat}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-40 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            i % 2 ? "bg-blue-500" : "bg-green-500"
                          }`}
                          style={{ width: `${70 - i * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {70 - i * 10}%
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
