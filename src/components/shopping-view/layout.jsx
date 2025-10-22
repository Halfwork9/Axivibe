import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ✅ This component is now simpler. It just displays the layout.
// All data fetching is handled by App.jsx
const ShoppingLayout = () => {
  const { isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth || {});
  const { categoryList = [] } = useSelector((state) => state.adminCategories || {});
  const { cartItems = [] } = useSelector((state) => state.shopCart || {});
  const navigate = useNavigate();

  // Redirect logic for protected routes
  React.useEffect(() => {
    const protectedRoutes = ['/shop/checkout', '/shop/account'];
    if (!authLoading && !isAuthenticated && protectedRoutes.includes(window.location.pathname)) {
      navigate('/auth/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            <div>Logo</div>
            <div className="flex space-x-4">
              {categoryList.length > 0 ? (
                categoryList.map((category) => (
                  <a
                    key={category._id || category.name}
                    href={`/shop/listing?category=${encodeURIComponent(category.name)}`}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    {category.name || 'Unknown'}
                  </a>
                ))
              ) : (
                <span>No categories available</span>
              )}
            </div>
            <div>Cart ({cartItems.length})</div>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">Footer Content</div>
      </footer>
    </div>
  );
};

export default ShoppingLayout;
