import { Users } from "lucide-react";

const currency = (n) => `₹${Number(n || 0).toLocaleString()}`;

const TopCustomersTable = ({ data }) => {
  if (!data?.length) {
    return <p>No customer data</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Orders</th>
          <th>Total Spent</th>
        </tr>
      </thead>
      <tbody>
        {data.map((c) => (
          <tr key={c.userId}>
            <td>{c.name || "User-" + c.userId.slice(-4)}</td>
            <td>{c.orderCount}</td>
            <td>₹{c.totalSpent.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default TopCustomersTable;
