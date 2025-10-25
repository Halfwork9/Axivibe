import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginWithGoogle } from '@/store/auth-slice';
import { GoogleLogin } from '@react-oauth/google';
import { useToast } from '@/components/ui/use-toast';
import { registerFormControls } from '@/config';

const AuthRegister = () => {
  const [formData, setFormData] = useState({ userName: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(action)) {
      toast({ title: 'Success', description: 'Registration successful. Please log in.' });
      navigate('/auth/login');
    } else {
      toast({ title: 'Error', description: action.payload?.message || 'Registration failed', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <img src="/AIXIVIBE.png" alt="Logo" className="w-20 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join Axivibe and start shopping today!</p>
        </div>

       {error && (
  <div className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded mb-4 text-center">
    {typeof error === 'string' ? error : error.message || 'Something went wrong'}
  </div>
)}

        <form onSubmit={handleSubmit} className="space-y-4">
          {registerFormControls.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(cred) => dispatch(loginWithGoogle(cred.credential))}
            onError={() => toast({ title: 'Error', description: 'Google login failed', variant: 'destructive' })}
          />
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600 font-medium hover:underline">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthRegister;
