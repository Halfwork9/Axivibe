import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCartDetails } from '../store/shop/cart-slice'; // Adjust path if needed
import { getCategoryList } from '../store/admin/category-slice'; // Adjust path if needed

const ShoppingLayout = () => {
  console.log('ShoppingLayout: Rendering');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { categoryList = [] } = useSelector((state) => state.categories || {}); // Default to empty array
  const { cartItems = [] } = useSelector((state) => state.cart || {}); // Default to empty array

  console.log('ShoppingLayout: State:', { categoryList, cartItems, isAuthenticated });

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('ShoppingLayout: Redirecting to /auth/login');
      navigate('/auth/login');
    }
    // Fetch categories and cart details
    dispatch(getCategoryList());
    dispatch(getCartDetails());
  }, [dispatch, isAuthenticated, navigate]);

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
                      key={category.id || category.name}
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
              <div>
                Cart ({cartItems.length})
              </div>
            </nav>
          </div>
        </header>
        <main className="flex-grow">
          <Outlet />
        </main>
        <footer className="bg-gray-800 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            Footer Content
          </div>
        </footer>
      </div>
    );
  } catch (err) {
    console.error('ShoppingLayout: Render error:', err);
    throw err; // Let ErrorBoundary catch this
  }
};

export default ShoppingLayout;
