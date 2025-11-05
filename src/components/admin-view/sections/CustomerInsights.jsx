import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Repeat, ShoppingBag, BarChart3 } from "lucide-react";

export default function CustomerInsights() {
  // Replace with real analytics data when available
  const data = {
    repeatBuyers: 34,
    newCustomers: 120,
    avgOrderValue: 1420,
    retentionRate: 28,
  };

  const insights = [
    {
      label: "Repeat Buyers",
      value: `${data.repeatBuyers}`,
      icon: <Repeat className="text-blue-500" />,
    },
    {
      label: "New Customers",
      value: `${data.newCustomers}`,
      icon: <Users className="text-green-500" />,
    },
    {
      label: "Avg. Order Value",
      value: `₹${data.avgOrderValue.toLocaleString()}`,
      icon: <ShoppingBag className="text-yellow-500" />,
    },
    {
      label: "Retention Rate",
      value: `${data.retentionRate}%`,
      icon: <BarChart3 className="text-purple-500" />,
    },
  ];

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Users className="h-5 w-5 text-indigo-500" />
          Customer Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {insights.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="mb-2">{item.icon}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {item.value}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
