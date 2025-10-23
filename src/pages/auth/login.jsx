import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/store/auth-slice';
import { GoogleLogin } from '@react-oauth/google'; // Import Google OAuth component
import axios from 'axios';

function AuthLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/shop/home');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google-login`,
        { token },
        { withCredentials: true }
      );
      if (response.data.success) {
        navigate('/shop/home');
      } else {
        setError(response.data.message || 'Google login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
    }
  };

  // Handle Google login failure
  const handleGoogleFailure = (error) => {
    console.error('Google Login Failed:', error);
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
          >
            Login
          </button>
        </form>
        {/* Google Login Button */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Login with Google
            </button>
          )}
        />
        <p className="mt-4 text-center">
          <a href="/auth/register" className="text-blue-600 hover:underline">Register</a> |{' '}
          <a href="/auth/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
}

export default AuthLogin;
