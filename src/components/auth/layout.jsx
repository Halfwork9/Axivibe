import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
