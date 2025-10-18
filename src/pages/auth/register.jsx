import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser, loginWithGoogle } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function AuthRegister() {
  const [formData, setFormData] = useState({ userName: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = await dispatch(registerUser(formData));
    setLoading(false);

    if (data?.payload?.success) {
      toast({ title: data?.payload?.message || "Registration successful 🎉" });
      navigate("/auth/login");
    } else {
      toast({ title: data?.payload?.message || "Registration failed", variant: "destructive" });
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(loginWithGoogle(credentialResponse.credential)).then((res) => {
      if (res.payload?.success) {
        toast({ title: "Google Sign-Up successful 🎉" });
        navigate("/");
      } else {
        toast({ title: "Google sign-up failed.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-6 p-8 rounded-xl shadow-lg bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Create an Account
        </h1>
        <p className="mt-2 text-gray-600">
          Already have an account?{" "}
          <Link className="font-medium text-primary hover:underline" to="/auth/login">
            Login
          </Link>
        </p>
      </div>

      {/* ✅ Google Sign-Up */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast({ title: "Google sign-up error.", variant: "destructive" })}
          width="320px"
        />
      </div>

      {/* Divider */}
      <div className="flex items-center">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-sm font-medium text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      {/* ✅ Email Registration */}
      <CommonForm
        formControls={registerFormControls}
        buttonText={loading ? "Creating Account..." : "Sign Up with Email"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={loading}
      />
    </div>
  );
}

export default AuthRegister;
