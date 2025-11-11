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
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700">
            <th className="p-2 font-medium">Brand</th>
            <th className="p-2 font-medium text-center">Orders</th>
            <th className="p-2 font-medium text-center">Qty</th>
            <th className="p-2 font-medium text-center">Revenue</th>
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
              <td classname="p-2 text-center">
                ₹{Number(b.revenue || 0).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandPerformanceTable;
