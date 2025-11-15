import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(forgotPassword(email));

    if (forgotPassword.fulfilled.match(result)) {
      toast({
        title: "Reset Email Sent",
        description: "Check your inbox for the password reset link.",
      });
      navigate("/auth/login");
    } else {
      toast({
        title: "Error",
        description:
          result.payload?.message || "Unable to send reset email.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">

        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="/AIXIVIBE.png"
            alt="Axivibe Logo"
            className="w-20 mx-auto mb-3"
          />
          <h2 className="text-3xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back Link */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Remember your password?{" "}
          <a
            href="/auth/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
