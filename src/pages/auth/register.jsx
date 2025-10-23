import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { registerUser, loginWithGoogle } from '@/store/auth-slice';
import { GoogleLogin } from '@react-oauth/google';
import { registerFormControls } from '@/config';

const AuthRegister = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const action = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(action)) {
        toast({ title: 'Success', description: 'Registration successful. Please log in.' });
        navigate('/auth/login');
      } else {
        toast({ title: 'Error', description: action.payload?.message || 'Registration failed', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Registration failed', variant: 'destructive' });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const action = await dispatch(loginWithGoogle(credentialResponse.credential));
      if (loginWithGoogle.fulfilled.match(action)) {
        toast({ title: 'Success', description: 'Google Sign-In successful' });
        navigate('/shop/home');
      } else {
        toast({ title: 'Error', description: action.payload?.message || 'Google login failed', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Google login failed', variant: 'destructive' });
    }
  };

  const handleGoogleError = () => {
    toast({ title: 'Error', description: 'Google Sign-In failed', variant: 'destructive' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        {error && typeof error === 'string' && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {registerFormControls.map((control) => (
            <div key={control.name}>
              <label htmlFor={control.name} className="block text-sm font-medium text-gray-700">
                {control.label}
              </label>
              <input
                id={control.name}
                name={control.name}
                type={control.type}
                value={formData[control.name]}
                onChange={handleChange}
                placeholder={control.placeholder}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Sign up'}
          </button>
        </form>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthRegister;
