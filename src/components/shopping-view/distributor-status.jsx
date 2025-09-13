import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { withdrawApplication } from "@/store/admin/distributor-slice";
import { useToast } from "@/components/ui/use-toast";
import api from "@/api";

function DistributorStatus() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  const { toast } = useToast();

  const fetchStatus = async () => {
    try {
      const res = await api.get("/distributors/status", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setApplication(data.data);
      } else {
        setApplication(null);
      }
    } catch {
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus(); // initial load
    const interval = setInterval(fetchStatus, 10000); // 🔁 auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Your Distributor Application
      </h3>

      {application ? (
        <div className="border p-4 rounded bg-gray-50 text-center">
          <p className="mb-2">✅ You have already applied.</p>
          <p>
            <strong>Status:</strong> {application.status}
          </p>
          <p>
            <strong>Submitted on:</strong>{" "}
            {new Date(application.createdAt).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            You haven’t applied to become a distributor yet.
          </p>
          <a
            href="/shop/distributor"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply Now
          </a>
        </div>
      )}
     {application?.status === "Submitted" && (
  <Button
    onClick={() => {
      if (window.confirm("Are you sure you want to withdraw?")) {
        dispatch(withdrawApplication(application._id))
          .unwrap()
          .then(() => {
            toast({
              title: "Application withdrawn successfully",
              className: "bg-green-500 text-white",
            });
          })
          .catch((err) => {
            toast({
              title: err.message || "Error withdrawing application",
              variant: "destructive",
            });
          });
      }
    }}
    className="bg-red-500 text-white mt-3"
  >
    Withdraw Application
  </Button>
)}
    </div>
  );
}

export default DistributorStatus;

