import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartItems } from '../../store/shop/cart-slice';
import { fetchAllCategories } from '../../store/admin/category-slice';

const ShoppingLayout = () => {
  console.log('ShoppingLayout: Rendering');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: authLoading } = useSelector((state) => state.auth || {});
  const { categoryList = [], isLoading: categoriesLoading, error: categoryError } = useSelector((state) => state.adminCategories || {});
  const { cartItems = [], isLoading: cartLoading, error: cartError } = useSelector((state) => state.shopCart || {});

  console.log('ShoppingLayout: State:', { categoryList, cartItems, isAuthenticated, user, authLoading, categoriesLoading, cartLoading, categoryError, cartError });

  useEffect(() => {
    console.log('ShoppingLayout: Dispatching thunks');
    dispatch(fetchAllCategories());
    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);

  // Only redirect if explicitly on a protected route (e.g., /shop/checkout)
  useEffect(() => {
    const protectedRoutes = ['/shop/checkout', '/shop/account'];
    if (!authLoading && !isAuthenticated && protectedRoutes.includes(window.location.pathname)) {
      console.log('ShoppingLayout: Redirecting to /auth/login');
      navigate('/auth/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || categoriesLoading || cartLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

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
          {(categoryError || cartError) && (
            <div className="bg-red-100 text-red-700 p-2 text-center">
              {categoryError && <p>Category Error: {categoryError}</p>}
              {cartError && <p>Cart Error: {cartError}</p>}
            </div>
          )}
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
