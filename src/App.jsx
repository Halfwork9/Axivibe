// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { checkAuth, logoutUser } from './store/auth-slice';
import { fetchAllCategories, fetchAllBrands } from './store/admin/category-slice';
import { fetchCartItems } from './store/shop/cart-slice';
import ShoppingLayout from './components/shopping-view/layout';
import AuthLayout from './components/auth/layout';
import ShoppingHome from './pages/shop/home';
import ShoppingListing from './pages/shop/listing';
import ShoppingCheckout from './pages/shop/checkout';
import ShoppingAccount from './pages/shop/account';
import PaypalReturnPage from './pages/shop/paypal-return';
import PaymentSuccessPage from './pages/shop/payment-success';
import SearchProducts from './pages/shop/search';
import HelpPage from './pages/shop/help';
import ContactPage from './pages/shop/contact';
import ProductSupportPage from './pages/shop/product-support';
import TechnicalSupportPage from './pages/shop/technical-support';
import DistributorPage from './pages/shop/distributor';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
import AdminLayout from './components/admin/layout';
import AdminDashboard from './pages/admin/dashboard';
import AdminProducts from './pages/admin/products';
import AdminOrders from './pages/admin/orders';
import AdminFeatures from './pages/admin/features';
import Brands from './pages/admin/brands';
import AdminCategoriesPage from './pages/admin/categories';
import AdminDistributorsPage from './pages/admin/distributors';
import UnauthPage from './pages/unauth-page';
import NotFound from './pages/not-found';
import ErrorBoundary from './components/error-boundary';

class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
            <p className="text-red-500">{this.state.error.message || 'Unknown error'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log('App: Dispatching global thunks (once)');
    dispatch(checkAuth());
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  React.useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log(`App: Dispatching fetchCartItems for user: ${user.id}`);
      dispatch(fetchCartItems(user.id));
    } else if (!isLoading && !isAuthenticated) {
      navigate('/auth/login');
    }
  }, [dispatch, isAuthenticated, user?.id, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId="554858497538-5lglbrrcecarc9n5qd25tpicvi2q1lcf.apps.googleusercontent.com">
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-white">
          <Router>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/shop/home" replace />} />
                <Route path="/shop" element={<ShoppingLayout />}>
                  <Route index element={<Navigate to="/shop/home" replace />} />
                  <Route path="home" element={<ShoppingHome />} />
                  <Route path="listing" element={<ShoppingListing />} />
                  <Route path="checkout" element={<ShoppingCheckout />} />
                  <Route path="account" element={<ShoppingAccount />} />
                  <Route path="paypal-return" element={<PaypalReturnPage />} />
                  <Route path="payment-success" element={<PaymentSuccessPage />} />
                  <Route path="search" element={<SearchProducts />} />
                  <Route path="help" element={<HelpPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="product-support" element={<ProductSupportPage />} />
                  <Route path="technical-support" element={<TechnicalSupportPage />} />
                  <Route path="distributors" element={<DistributorPage />} />
                </Route>
                <Route path="/auth" element={<AuthLayout />}>
                  <Route index element={<Navigate to="/auth/login" replace />} />
                  <Route path="login" element={<AuthLogin />} />
                  <Route path="register" element={<AuthRegister />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password/:token" element={<ResetPassword />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="features" element={<AdminFeatures />} />
                  <Route path="brands" element={<Brands />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="distributors" element={<AdminDistributorsPage />} />
                </Route>
                <Route path="/unauth-page" element={<UnauthPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </div>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  );
}

export default App;
