import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartItems } from '../store/shop/cart-slice';
import { fetchAllCategories } from '../store/admin/category-slice';

const ShoppingLayout = () => {
  console.log('ShoppingLayout: Rendering');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const { categoryList = [], error: categoryError } = useSelector((state) => state.adminCategories || {});
  const { cartItems = [], error: cartError } = useSelector((state) => state.shopCart || {});

  console.log('ShoppingLayout: State:', { categoryList, cartItems, isAuthenticated, user, categoryError, cartError });

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('ShoppingLayout: Redirecting to /auth/login');
      navigate('/auth/login');
    }
    dispatch(fetchAllCategories());
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, isAuthenticated, navigate, user?.id]);

  try {
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
                      href={`/shop/listing?category=${category.name}`}
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
  } catch (err) {
    console.error('ShoppingLayout: Render error:', err);
    throw err;
  }
};

export default ShoppingLayout;
