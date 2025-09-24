import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { fetchAllBrands } from "@/store/admin/brand-slice";
import { fetchAllCategories } from "@/store/admin/category-slice";
import SEO from "@/components/common/SEO";
import * as LucideIcons from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { productList = [], productDetails = null } =
    useSelector((state) => state.shopProducts || {});
  const { featureImageList = [] } = useSelector(
    (state) => state.commonFeature || {}
  );
  const { brandList = [] } = useSelector((state) => state.adminBrands || {});
  const { categoryList = [] } = useSelector(
    (state) => state.adminCategories || {}
  );
  const { user } = useSelector((state) => state.auth || {});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Navigate to filtered listing page
  function handleNavigateToListingPage(item, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = { [section]: [item.id || item._id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  // Fetch product details
  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  // Add to cart with defensive checks
  function handleAddtoCart(productId) {
    if (!user?.id) {
      toast({ title: "Please login to add items to cart" });
      return;
    }

    dispatch(
      addToCart({ userId: user.id, productId, quantity: 1 })
    ).then((data) => {
      const items = data?.payload || [];
      if (items.length > 0) {
        dispatch(fetchCartItems(user.id));
        toast({ title: "Product added to cart" });
      } else {
        toast({ title: "Something went wrong adding product" });
      }
    });
  }

  // Open product details dialog
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Auto slide feature images
  useEffect(() => {
    if (featureImageList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  // Fetch products
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" })
    );
  }, [dispatch]);

  // Fetch banners, brands & categories
  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchAllBrands());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Axivibe - Shop Premium Products Online"
        description="Discover top categories, premium brands, and trending products with exclusive deals at Axivibe."
        url="https://axivibe.vercel.app/shop/home"
      />

      {/* Hero Slider */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {featureImageList.map((slide, index) => (
          <img
            src={slide?.image}
            key={index}
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        ))}
      </div>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
           {/* Categories */}
{categoryList.map((categoryItem) => {
  let IconComp = null;

  if (categoryItem.icon && LucideIcons[categoryItem.icon]) {
    IconComp = LucideIcons[categoryItem.icon];
  }

  return (
    <Card
      key={categoryItem._id}
      onClick={() => handleNavigateToListingPage(categoryItem, "category")}
      className="cursor-pointer hover:shadow-lg transition-shadow"
    >
      <CardContent className="flex flex-col items-center justify-center p-6">
        {IconComp ? (
          <IconComp className="w-12 h-12 mb-4 text-primary" />
        ) : (
          <LucideIcons.Box className="w-12 h-12 mb-4 text-primary" />
        )}
        <span className="font-bold">{categoryItem.name}</span>
      </CardContent>
    </Card>
  );
})}

          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           // New robust code
{brandList.map((brandItem) => {
  // 1. Check if the icon key exists and is a valid component in LucideIcons
  const IconComp = 
    brandItem.icon && typeof LucideIcons[brandItem.icon] === 'function' 
      ? LucideIcons[brandItem.icon] 
      : null;

  return (
    <Card
      key={brandItem._id || brandItem.id}
      onClick={() => handleNavigateToListingPage(brandItem, "brand")}
      className="cursor-pointer hover:shadow-lg transition-shadow"
    >
      <CardContent className="flex flex-col items-center justify-center p-6">
        {IconComp ? (
          // Render the icon only if it's a valid component
          <IconComp className="w-12 h-12 mb-4 text-primary" />
        ) : (
          // Otherwise, always render the fallback
          <span className="w-12 h-12 mb-4 flex items-center justify-center text-primary border rounded-full">
            {brandItem?.name?.[0] || "?"}
          </span>
        )}
        <span className="font-bold">{brandItem.name}</span>
      </CardContent>
    </Card>
  );
})}
          </div>
        </div>
      </section>

      {/* Feature Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
                product={productItem}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
