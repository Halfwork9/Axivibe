import { Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthLayout from './components/auth/layout';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
import AdminLayout from './components/admin-view/layout';
import AdminDashboard from './pages/admin-view/dashboard';
import AdminProducts from './pages/admin-view/products';
import AdminOrders from './pages/admin-view/orders';
import AdminFeatures from './pages/admin-view/features';
import ShoppingLayout from './components/shopping-view/layout';
import NotFound from './pages/not-found';
import ShoppingHome from './pages/shopping-view/home';
import ShoppingListing from './pages/shopping-view/listing';
import ShoppingCheckout from './pages/shopping-view/checkout';
import ShoppingAccount from './pages/shopping-view/account';
import UnauthPage from './pages/unauth-page';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, Component } from 'react';
import { checkAuth } from './store/auth-slice';
import { Skeleton } from '@/components/ui/skeleton';
import PaypalReturnPage from './pages/shopping-view/StripeReturnPage';
import PaymentSuccessPage from './pages/shopping-view/payment-success';
import SearchProducts from './pages/shopping-view/search';
import Brands from './pages/admin-view/brands';
import AdminCategoriesPage from './components/admin-view/categories-page';
import HelpPage from './pages/shopping-view/customer-service/help';
import ContactPage from './pages/shopping-view/customer-service/contact';
import ProductSupportPage from './pages/shopping-view/customer-service/product-support';
import TechnicalSupportPage from './pages/shopping-view/customer-service/technical-support';
import DistributorPage from './components/shopping-view/distributor';
import AdminDistributorsPage from './components/admin-view/distributors-page';

// Error Boundary Component
class ErrorBoundary extends Component {
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
            <pre className="text-sm text-gray-700 mt-2">
              {this.state.errorInfo?.componentStack || 'No stack trace available'}
            </pre>
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
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('App: Dispatching checkAuth');
    dispatch(checkAuth());
  }, [dispatch]);

  console.log('App: Rendering with Auth State:', { isLoading, isAuthenticated, user, error });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-80 h-96" />
      </div>
    );
  }

  try {
    console.log('App: Rendering Routes');
    return (
      <GoogleOAuthProvider clientId="554858497538-5lglbrrcecarc9n5qd25tpicvi2q1lcf.apps.googleusercontent.com">
        <ErrorBoundary>
          <div className="flex flex-col min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<ShoppingHome />} />
              <Route path="/auth" element={<AuthLayout />}>
                <Route index element={<div>Auth Home</div>} />
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
              <Route path="/shop" element={<ShoppingLayout />}>
                <Route index element={<ShoppingHome />} />
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
              <Route path="/unauth-page" element={<UnauthPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </ErrorBoundary>
      </GoogleOAuthProvider>
    );
  } catch (err) {
    console.error('App: Render error:', err);
    throw err;
  }
}

export default App;
