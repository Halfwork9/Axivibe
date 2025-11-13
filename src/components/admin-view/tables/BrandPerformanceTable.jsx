// src/components/admin-view/tables/BrandPerformanceTable.jsx
import { Package } from "lucide-react";

const BrandPerformanceTable = ({ data }) => {
  const brandData = Array.isArray(data) ? data : [];

  if (!brandData.length) {
    return (
      <div className="h-[200px] flex flex-col items-center justify-center text-gray-400">
        <Package className="h-10 w-10 mb-2" />
        <p>No brand sales yet</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="max-h-[250px] overflow-y-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="p-2 text-left font-medium w-1/3">Brand</th>
                <th className="p-2 text-center font-medium w-1/5">Orders</th>
                <th className="p-2 text-center font-medium w-1/5">Qty</th>
                <th className="p-2 text-center font-medium w-1/3">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {brandData.map((b) => (
                <tr
                  key={b._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-2">{b.brand}</td>
                  <td className="p-2 text-center">{b.orderCount ?? 0}</td>
                  <td className="p-2 text-center">{b.qty ?? 0}</td>
                  <td className="p-2 text-center">
                    ₹{Number(b.revenue || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BrandPerformanceTable;
