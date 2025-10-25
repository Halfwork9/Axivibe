import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser, loginWithGoogle } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { GoogleLogin } from "@react-oauth/google";

function AuthLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate(); // ✅ Initialize navigate

  // ✅ FIX: Centralized login success handler with admin redirect
  const handleLoginSuccess = (payload) => {
    if (payload?.success) {
      if (payload.user?.role === 'admin') {
        toast({ title: `Welcome Admin, ${payload.user?.userName}!` });
        navigate('/admin/dashboard'); // Redirect admin
      } else {
        toast({ title: `Welcome, ${payload.user?.userName}!` });
        navigate('/shop/home'); // Redirect regular user
      }
    } else {
      toast({ title: payload?.message, variant: "destructive" });
    }
  };

  const handleEmailLogin = (event) => {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      handleLoginSuccess(data.payload);
    });
  };

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(loginWithGoogle(credentialResponse.credential)).then((data) => {
      handleLoginSuccess(data.payload);
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
      
      <div className="flex justify-center">
         <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast({ title: "Google sign-in error.", variant: "destructive" })}
            width="320px"
          />
      </div>

      <div className="flex items-center">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-sm font-medium text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>
      
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In with Email"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEmailLogin}
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

