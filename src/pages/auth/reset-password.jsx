import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    try {
      const action = await dispatch(resetPassword({ token, password }));

      if (resetPassword.fulfilled.match(action)) {
        toast({
          title: "Success",
          description: "Password reset successful!",
        });
        navigate("/auth/login");
      } else {
        toast({
          title: "Error",
          description: action.payload?.message || "Reset failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] px-6">
      <div
        className="max-w-md w-full p-8 rounded-2xl shadow-xl bg-white 
                   border border-gray-200"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
