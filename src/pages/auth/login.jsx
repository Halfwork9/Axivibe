import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/store/auth-slice';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function AuthLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await dispatch(loginUser({ email, password })).unwrap();
    const role = result.user?.role;

    if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/shop/home');
  } catch (err) {
    setError(err.message || 'Login failed. Please try again.');
  }
};

const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const token = credentialResponse.credential;
    const result = await dispatch(loginWithGoogle(token)).unwrap();
    const role = result.user?.role;

    if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/shop/home');
  } catch (err) {
    setError('Google login failed. Please try again.');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <img src="/AIXIVIBE.png" alt="Axivibe Logo" className="w-20 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">Axivibe </h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue shopping</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google login failed.')} />
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
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
}

export default AuthLogin;
