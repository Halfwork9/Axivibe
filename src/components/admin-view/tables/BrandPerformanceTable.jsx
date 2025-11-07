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
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th>Brand</th>
          <th>Qty</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {brandData.map((b) => (
          <tr key={b._id}>
            <td>{b.brand}</td>
            <td>{b.qty}</td>
            <td>₹{b.revenue.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BrandPerformanceTable;
