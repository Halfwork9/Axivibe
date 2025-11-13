// src/components/shopping-view/shopping-home.js
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchShopProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";

import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { getFeatureImages } from "@/store/common-slice";
import { fetchAllBrands } from "@/store/admin/brand-slice";
import { fetchAllCategories } from "@/store/admin/category-slice";
import * as Icons from "lucide-react";
import SEO from "@/components/common/SEO";
import { getImageUrl } from "@/utils/imageUtils";

// Skeleton component for loading UI
const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

export default function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  const {
    productList = [],
    listLoading,
    detailsLoading,
  } = useSelector((state) => state.shopProducts || {});

  const { featureImageList = [], isLoading: featureImagesLoading } =
    useSelector((state) => state.commonFeature || {});

  const { brandList = [], isLoading: brandsLoading } = useSelector(
    (state) => state.adminBrands || {}
  );

  const {
    categoryList = [],
    isLoading: categoriesLoading,
    error: categoryError,
  } = useSelector((state) => state.adminCategories || {});

  const { user, isAuthenticated, isLoading: authLoading } = useSelector(
    (state) => state.auth || {}
  );

  const {
    cartItems = [],
    isLoading: cartLoading,
    error: cartError,
  } = useSelector((state) => state.shopCart || {});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // -------------------- Navigation --------------------
  const handleNavigateToListingPage = (item, type) => {
    sessionStorage.removeItem("filters");

    const filter = {
      [type]: [item.id || item._id],
    };

    sessionStorage.setItem("filters", JSON.stringify(filter));
    navigate("/shop/listing");
  };

  const handleGetProductDetails = (id) => {
    navigate(`/shop/product/${id}`);
  };

  const handleAddtoCart = async (id) => {
    if (!isAuthenticated) {
      toast({
        title: "Please login to add items to cart",
        variant: "destructive",
      });
      return navigate("/auth/login");
    }

    const action = await dispatch(
      addToCart({ userId: user.id, productId: id, quantity: 1 })
    );

    if (action.meta.requestStatus === "fulfilled") {
      toast({ title: "Product added to cart" });
    } else {
      toast({ title: "Failed to add product to cart", variant: "destructive" });
    }
  };

  // -------------------- Banner Slider --------------------
  useEffect(() => {
    if (featureImageList.length === 0) return;

    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % featureImageList.length),
      4000
    );

    return () => clearInterval(timer);
  }, [featureImageList]);

  // -------------------- Load initial data --------------------
  useEffect(() => {
    dispatch(
      fetchShopProducts({ filterParams: {}, sortParams: "price-lowtohigh" })
    );
    dispatch(getFeatureImages());
    dispatch(fetchAllBrands());
    dispatch(fetchAllCategories());

    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);

  // -------------------- Loading Screen --------------------
  const isLoading =
    authLoading ||
    listLoading ||
    featureImagesLoading ||
    brandsLoading ||
    categoriesLoading ||
    cartLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <SkeletonBox className="h-[300px] w-full" />
        <SkeletonBox className="h-8 w-48 mx-auto" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <SkeletonBox key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // -------------------- Main UI --------------------
  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Axivibe - Shop Premium Products Online"
        description="Discover top categories, premium brands, and trending products."
        url="https://nikhilmamdekar.site/shop/home"
      />

      {/* Error Messages */}
      {(categoryError || cartError) && (
        <div className="bg-red-100 text-red-600 p-4 text-center">
          {categoryError && <p>{categoryError}</p>}
          {cartError && <p>{cartError}</p>}
        </div>
      )}

      {/* -------------------- Featured Banner -------------------- */}
      <div className="relative w-full h-[45vh] md:h-[60vh] overflow-hidden rounded-b-xl">
        {featureImageList.length > 0 ? (
          featureImageList.map((slide, i) => (
            <img
              key={i}
              src={slide.image}
              crossOrigin="anonymous"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                i === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
        ) : (
          <div className="bg-gray-200 w-full h-full"></div>
        )}

        {/* Slide Navigation */}
        {featureImageList.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-3 bg-white/70"
              onClick={() =>
                setCurrentSlide(
                  (prev) =>
                    (prev - 1 + featureImageList.length) %
                    featureImageList.length
                )
              }
            >
              <ChevronLeftIcon />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-3 bg-white/70"
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
              }
            >
              <ChevronRightIcon />
            </Button>
          </>
        )}
      </div>

      {/* -------------------- Categories -------------------- */}
      <section className="py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
          {categoryList?.length ? (
            categoryList.map((c) => {
              const Icon = Icons[c.icon] || Icons.Package;

              return (
                <Card
                  key={c._id}
                  onClick={() => handleNavigateToListingPage(c, "category")}
                  className="cursor-pointer hover:shadow-lg transition p-4 flex flex-col items-center text-center"
                >
                  <Icon className="h-10 w-10 text-primary mb-3" />
                  <p className="font-semibold text-sm md:text-base">{c.name}</p>
                </Card>
              );
            })
          ) : (
            <p>No categories available</p>
          )}
        </div>
      </section>

      {/* -------------------- Brands -------------------- */}
      <section className="py-10 bg-gray-50">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Shop by Brand
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 px-4">
          {brandList?.length ? (
            brandList.map((b) => (
              <Card
                key={b._id}
                onClick={() => handleNavigateToListingPage(b, "brand")}
                className="cursor-pointer hover:shadow-lg transition p-4 flex flex-col items-center"
              >
                {b.logo ? (
                  <img
                    src={
                      imageErrors[b._id]
                        ? "https://via.placeholder.com/80"
                        : getImageUrl(b.logo)
                    }
                    crossOrigin="anonymous"
                    onError={() =>
                      setImageErrors((prev) => ({ ...prev, [b._id]: true }))
                    }
                    className="h-14 w-14 object-contain mb-2"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-primary font-semibold">
                    {b.name?.[0]}
                  </div>
                )}

                <p className="font-semibold text-sm md:text-base text-center">
                  {b.name}
                </p>
              </Card>
            ))
          ) : (
            <p>No brands available</p>
          )}
        </div>
      </section>

      {/* -------------------- Featured Products -------------------- */}
      <section className="py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {productList?.length ? (
            productList.map((p) => (
              <ShoppingProductTile
                key={p._id}
                product={p}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          ) : (
            <p className="col-span-full text-center">
              No products available
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
