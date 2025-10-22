import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShopProducts, fetchProductDetails } from '@/store/shop/products-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { useToast } from '@/components/ui/use-toast';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { getFeatureImages } from '@/store/common-slice';
import { fetchAllBrands } from '@/store/admin/brand-slice';
import { fetchAllCategories } from '@/store/admin/category-slice';
import * as LucideIcons from 'lucide-react';
import SEO from '@/components/common/SEO';

function ShoppingHome() {
  console.log('ShoppingHome: Rendering');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { productList = [], productDetails = null } = useSelector((state) => state.shopProducts || {});
  const { featureImageList = [] } = useSelector((state) => state.commonFeature || {});
  const { brandList = [] } = useSelector((state) => state.adminBrands || {});
  const { categoryList = [], error: categoryError } = useSelector((state) => state.adminCategories || {});
  const { cartItems = [], error: cartError } = useSelector((state) => state.shopCart || {});
  const { user } = useSelector((state) => state.auth || {});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log('ShoppingHome: State:', { productList, featureImageList, brandList, categoryList, cartItems, user, categoryError, cartError });

  const handleNavigateToListingPage = (item, section) => {
    sessionStorage.removeItem('filters');
    const filter = { [section]: [item.id || item._id] };
    sessionStorage.setItem('filters', JSON.stringify(filter));
    navigate('/shop/listing');
  };

  const handleGetProductDetails = (id) => {
    console.log('ShoppingHome: Fetching product details for ID:', id);
    dispatch(fetchProductDetails(id));
  };

  const handleAddtoCart = (id) => {
    if (!user?.id) {
      toast({ title: 'Please login to add items to cart', variant: 'destructive' });
      navigate('/auth/login');
      return;
    }
    console.log('ShoppingHome: Adding to cart, product ID:', id);
    dispatch(addToCart({ userId: user.id, productId: id, quantity: 1 })).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({ title: 'Product added to cart' });
      } else {
        toast({ title: 'Failed to add product to cart', variant: 'destructive' });
      }
    });
  };

  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (featureImageList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    console.log('ShoppingHome: Dispatching thunks');
    dispatch(fetchShopProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }));
    dispatch(getFeatureImages());
    dispatch(fetchAllBrands());
    dispatch(fetchAllCategories());
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Axivibe - Shop Premium Products Online"
        description="Discover top categories, premium brands, and trending products with exclusive deals at Axivibe."
        url="https://axivibe.vercel.app/shop/home"
      />

      {/* Error Display */}
      {(categoryError || cartError) && (
        <div className="bg-red-100 text-red-700 p-4 text-center">
          {categoryError && <p>Category Error: {categoryError}</p>}
          {cartError && <p>Cart Error: {cartError}</p>}
        </div>
      )}

      {/* Hero Slider */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList?.length > 0 ? (
          featureImageList.map((slide, i) => (
            <img
              key={i}
              src={slide?.image}
              alt={`Slide ${i}`}
              className={`${
                i === currentSlide ? 'opacity-100' : 'opacity-0'
              } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            />
          ))
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            No featured images available
          </div>
        )}
        {featureImageList.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentSlide((prev) => (prev - 1 + featureImageList.length) % featureImageList.length)
              }
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % featureImageList.length)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryList?.length > 0 ? (
              categoryList.map((c) => {
                const Icon = LucideIcons[c.icon] || LucideIcons.Package;
                return (
                  <Card
                    key={c._id}
                    onClick={() => handleNavigateToListingPage(c, 'category')}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Icon className="w-12 h-12 mb-4 text-primary" />
                      <span className="font-bold">{c.name || 'Unknown'}</span>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="col-span-full text-center">No categories available</p>
            )}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandList?.length > 0 ? (
              brandList.map((b) => {
                const Icon = b.icon && typeof LucideIcons[b.icon] === 'function' ? LucideIcons[b.icon] : null;
                return (
                  <Card
                    key={b._id}
                    onClick={() => handleNavigateToListingPage(b, 'brand')}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      {b.logo ? (
                        <img src={b.logo} alt={b.name} className="w-16 h-16 mb-4 object-contain" />
                      ) : Icon ? (
                        <Icon className="w-12 h-12 mb-4 text-primary" />
                      ) : (
                        <span className="w-12 h-12 mb-4 flex items-center justify-center border rounded-full text-primary">
                          {b.name?.[0] || '?'}
                        </span>
                      )}
                      <span className="font-bold text-center">{b.name || 'Unknown'}</span>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="col-span-full text-center">No brands available</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.length > 0 ? (
              productList.map((p) => (
                <ShoppingProductTile
                  key={p._id}
                  product={p}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddtoCart={handleAddtoCart}
                  user={user}
                />
              ))
            ) : (
              <p className="col-span-full text-center">No products available</p>
            )}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
