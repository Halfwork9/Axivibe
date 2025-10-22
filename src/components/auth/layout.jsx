import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  console.log('AuthLayout: Rendering');
  try {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Outlet />
      </div>
    );
  } catch (err) {
    console.error('AuthLayout: Render error:', err);
    throw err;
  }
};

export default AuthLayout;
