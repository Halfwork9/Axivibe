import React from 'react';
import { Outlet } from 'react-router-dom';
import ShoppingHeader from './header';
import Footer from './footer';

function ShoppingLayout() {
  console.log('ShoppingLayout: Rendering');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <ShoppingHeader />

      {/* Main content fills remaining space */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ShoppingLayout;
