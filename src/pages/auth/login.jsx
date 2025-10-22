import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { loginUser, loginWithGoogle } from '@/store/auth-slice';
import { GoogleLogin } from '@react-oauth/google';
import { loginFormControls } from '@/config';

const AuthLogin = () => {
  console.log('AuthLogin: Component rendering');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, error } = useSelector((state) => state.auth);

  console.log('AuthLogin: State:', { formData, isLoading, error });
  console.log('AuthLogin: loginFormControls:', loginFormControls);

  const handleChange = (e) => {
    console.log('AuthLogin: handleChange:', e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('AuthLogin: Submitting formData:', formData);
    try {
      const action = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(action)) {
        toast({ title: 'Success', description: 'Logged in successfully' });
        navigate('/shop/home');
      } else {
        toast({ title: 'Error', description: action.payload?.message || 'Login failed', variant: 'destructive' });
      }
    } catch (err) {
      console.error('AuthLogin: Submit error:', err);
      toast({ title: 'Error', description: 'Unexpected error during login', variant: 'destructive' });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('AuthLogin: Google login success:', credentialResponse);
    try {
      const action = await dispatch(loginWithGoogle(credentialResponse.credential));
      if (loginWithGoogle.fulfilled.match(action)) {
        toast({ title: 'Success', description: 'Google Sign-In successful' });
        navigate('/shop/home');
      } else {
        toast({ title: 'Error', description: action.payload?.message || 'Google login failed', variant: 'destructive' });
      }
    } catch (err) {
      console.error('AuthLogin: Google login error:', err);
      toast({ title: 'Error', description: 'Unexpected error during Google login', variant: 'destructive' });
    }
  };

  const handleGoogleError = (error) => {
    console.error('AuthLogin: Google login error:', error);
    toast({ title: 'Error', description: 'Google Sign-In failed', variant: 'destructive' });
  };

  try {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {loginFormControls.map((control, index) => {
              console.log('AuthLogin: Rendering control:', control);
              return (
                <div key={control.name || `control-${index}`}>
                  <label htmlFor={control.name} className="block text-sm font-medium text-gray-700">
                    {control.label || 'Unknown Label'}
                  </label>
                  <input
                    id={control.name}
                    name={control.name}
                    type={control.type || 'text'}
                    value={formData[control.name] || ''}
                    onChange={handleChange}
                    placeholder={control.placeholder || ''}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              );
            })}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Sign in'}
            </button>
          </form>
          <div className="flex justify-center">
            <GoogleLogin
              clientId="554858497538-5lglbrrcecarc9n5qd25tpicvi2q1lcf.apps.googleusercontent.com"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error('AuthLogin: Render error:', err);
    throw err; // Let ErrorBoundary catch this
  }
};

export default AuthLogin;
