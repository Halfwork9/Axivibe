import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { loginFormControls } from '@/config';
import { loginUser, loginWithGoogle } from '@/store/auth-slice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function AuthLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      toast({
        title: 'Success',
        description: result.message || 'Logged in successfully',
      });
      navigate('/shop/home');
    } catch (err) {
      toast({
        title: 'Error',
        description: err?.message || 'Login failed',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await dispatch(loginWithGoogle(credentialResponse.credential)).unwrap();
      toast({
        title: 'Success',
        description: result.message || 'Google Sign-In successful',
      });
      navigate('/shop/home');
    } catch (err) {
      toast({
        title: 'Error',
        description: err?.message || 'Google login failed',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleError = () => {
    toast({
      title: 'Error',
      description: 'Google Sign-In failed. Please try again.',
      variant: 'destructive',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        {error && (
          <div className="text-red-600 text-center">{error.message || 'An error occurred'}</div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {loginFormControls.map((control) => (
            <div key={control.name}>
              <label htmlFor={control.name} className="block text-sm font-medium text-gray-700">
                {control.label}
              </label>
              <input
                id={control.name}
                name={control.name}
                type={control.type}
                placeholder={control.placeholder}
                value={formData[control.name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>
        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signin_with"
            shape="rectangular"
            theme="outline"
            size="large"
          />
        </div>
      </div>
    </div>
  );
}
