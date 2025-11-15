import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, loginWithGoogle } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      const role = result?.role;

      toast({
        title: "Login Successful",
        description: `Welcome back, ${result?.userName || "User"}!`,
      });

      navigate(role === "admin" ? "/admin/dashboard" : "/shop/home");

    } catch (err) {
      setError(err?.message || "Invalid credentials. Please try again.");
      toast({
        title: "Login Failed",
        description: err?.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-10 border border-gray-200">

        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <img
            src="/AIXIVIBE.png"
            alt="Logo"
            className="w-24 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to continue shopping with Axivibe
          </p>
        </div>

        {/* Error Box */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPwd ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(cred) => handleGoogleSuccess(cred)}
            onError={() => {}}
            useOneTap={false}
          />
        </div>

        {/* Navigation Links */}
        <div className="mt-8 text-center text-gray-600 text-sm">
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
