import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, loginWithGoogle } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";

const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Handle Email + Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      const role = result?.role;
     toast({ title: "Login Successful", description: `Welcome back, ${result?.userName || "User"}!` });
      if (role === "admin") navigate("/admin/dashboard");
      else navigate("/shop/home");
    } catch (err) {
      setError(err?.message || "Invalid credentials. Please try again.");
      toast({ title: "Login Failed", description: err?.message || "Invalid email or password", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      const token = credentialResponse?.credential;
      if (!token) throw new Error("No Google token received");

      const result = await dispatch(loginWithGoogle(token)).unwrap();
      const role = result.user?.role;
      toast({ title: "Google Login Successful", description: `Welcome, ${result.user?.userName}!` });
      if (role === "admin") navigate("/admin/dashboard");
      else navigate("/shop/home");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Please try again.");
      toast({ title: "Google Login Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Google Login Failure
  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
    toast({ title: "Error", description: "Google sign-in failed", variant: "destructive" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <img src="/AIXIVIBE.png" alt="Axivibe Logo" className="w-20 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">Axivibe</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue shopping</p>
        </div>

        {error && <div className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap={false} />
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/auth/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </div>
        <div className="text-center text-sm mt-2">
          <Link to="/auth/forgot-password" className="text-blue-500 hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
