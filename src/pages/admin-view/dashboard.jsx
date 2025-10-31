import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductImageUpload from "@/components/admin-view/image-upload";
import SalesOverviewChart from "@/components/admin-view/charts/SalesOverviewChart";
import TopProductsChart from "@/components/admin-view/charts/TopProductsChart";
import RecentOrdersTable from "@/components/admin-view/tables/RecentOrdersTable";
import api from "@/api";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [salesOverview, setSalesOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [statsRes, salesRes] = await Promise.all([
          api.get("/admin/orders/stats"),
          api.get("/admin/orders/sales-overview"),
        ]);
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (salesRes.data.success) setSalesOverview(salesRes.data.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats?.totalOrders}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">₹{stats?.totalRevenue.toFixed(2)}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Pending</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-yellow-500">{stats?.pendingOrders}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Delivered</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-green-600">{stats?.deliveredOrders}</p></CardContent></Card>
      </div>

      {/* Sales Overview */}
      <Card>
        <CardHeader><CardTitle>Sales Overview (Last 30 Days)</CardTitle></CardHeader>
        <CardContent><SalesOverviewChart data={salesOverview} /></CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
        <CardContent><TopProductsChart data={stats?.topProducts || []} /></CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
        <CardContent><RecentOrdersTable /></CardContent>
      </Card>

      {/* Feature Images */}
      <Card>
        <CardHeader><CardTitle>Homepage Feature Images</CardTitle></CardHeader>
        <CardContent>
          <ProductImageUpload
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
          />
          <Button className="mt-4">Save Feature Images</Button>
        </CardContent>
      </Card>
    </div>
  );
}
