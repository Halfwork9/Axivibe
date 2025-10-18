import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser, loginWithGoogle } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function AuthLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    const result = await dispatch(loginUser(formData));
    setLoading(false);

    if (result.payload?.success) {
      toast({ title: "Welcome back!", description: "Login successful 🎉" });
    } else {
      toast({ title: result.payload?.message || "Login failed.", variant: "destructive" });
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(loginWithGoogle(credentialResponse.credential)).then((res) => {
      if (res.payload?.success) {
        toast({ title: "Google Sign-In successful 🎉" });
      } else {
        toast({ title: "Google sign-in failed.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-6 p-8 rounded-xl shadow-lg bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sign In</h1>
        <p className="mt-2 text-gray-600">
          New here?{" "}
          <Link className="font-medium text-primary hover:underline" to="/auth/register">
            Create an account
          </Link>
        </p>
      </div>
      
      {/* ✅ Google Sign-In Button */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast({ title: "Google sign-in error.", variant: "destructive" })}
          width="320px"
        />
      </div>

      {/* Divider */}
      <div className="flex items-center">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-sm font-medium text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>
      
      {/* ✅ Email/Password Login */}
      <CommonForm
        formControls={loginFormControls}
        buttonText={loading ? "Signing In..." : "Sign In with Email"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEmailLogin}
        isBtnDisabled={loading}
      />

      <div className="text-center text-sm">
        <Link to="/auth/forgot-password" className="font-medium text-primary hover:underline">
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}

export default AuthLogin;
