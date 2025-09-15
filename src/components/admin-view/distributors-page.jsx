import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDistributors, updateDistributorStatus, deleteDistributor } from "@/store/admin/distributor-slice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function AdminDistributorsPage() {
  const dispatch = useDispatch();
  const { distributorList, isLoading } = useSelector((state) => state.adminDistributors);

  useEffect(() => {
    dispatch(fetchAllDistributors());
  }, [dispatch]);

 const handleStatusChange = async (id, status) => {
  await dispatch(updateDistributorStatus({ id, status }));
  dispatch(fetchAllDistributors()); // refresh list
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure?");
  if (confirmDelete) {
    await dispatch(deleteDistributor(id));
    dispatch(fetchAllDistributors()); // refresh list
  }
};


  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Distributor Applications</h2>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Distributor Applications</h2>
        <Button
          onClick={() => {
            window.open("https://axivibe.onrender.com/api/distributors/export/csv", "_blank");
          }}
          className="bg-blue-500 text-white"
        >
          Download CSV
        </Button>
      </div>

      {distributorList.length === 0 ? (
        <p className="text-gray-500">No distributor applications yet.</p>
      ) : (
        <div className="space-y-4">
          {distributorList.map((app) => (
            <div key={app._id} className="border p-4 rounded shadow-sm">
              <p><strong>Company:</strong> {app.company}</p>
              <p><strong>Contact:</strong> {app.contactName}</p>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Phone:</strong> {app.phone}</p>
              <p><strong>Markets:</strong> {app.markets || "N/A"}</p>
              <p><strong>Status:</strong> {app.status}</p>
              <p>
                <strong>Submitted on:</strong>{" "}
                {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
              </p>

              <div className="flex gap-2 mt-3">
                <Button
                  onClick={() => handleStatusChange(app._id, "Approved")}
                  className="bg-green-600 text-white"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusChange(app._id, "Rejected")}
                  className="bg-red-600 text-white"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleDelete(app._id)}
                  className="bg-gray-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDistributorsPage;

