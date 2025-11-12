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
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-100 text-left text-gray-700 sticky top-0 z-10">
          <tr>
            <th className="p-2 font-medium">Brand</th>
            <th className="p-2 font-medium text-center">Orders</th>
            <th className="p-2 font-medium text-center">Qty</th>
            <th className="p-2 font-medium text-center">Revenue</th>
          </tr>
        </thead>
      </table>

      {/* ✅ Scrollable body for rows beyond top 5 */}
      <div className="max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {brandData.map((b, index) => (
              <tr
                key={b._id}
                className={`border-b hover:bg-gray-50 transition ${
                  index < 5 ? "" : ""
                }`}
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
  );
};

export default BrandPerformanceTable;
