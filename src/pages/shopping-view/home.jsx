import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { fetchAllBrands } from "@/store/admin/brand-slice";
import { fetchAllCategories } from "@/store/admin/category-slice";

// Import all Lucide icons
import * as LucideIcons from "lucide-react";


function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // ✅ Defensive selectors with safe fallbacks
  const { productList = [], productDetails = null } =
    useSelector((state) => state.shopProducts || {});

  const { featureImageList = [] } =
    useSelector((state) => state.commonFeature || {});

  const { brandList = [] } =
    useSelector((state) => state.adminBrands || {});

  const { user } = useSelector((state) => state.auth || {});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id || getCurrentItem._id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    if (!user?.id) {
      toast({ title: "Please login to add items to cart" });
      return;
    }

    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({ title: "Product added to cart" });
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
      setCurrentSlide(
        (prevSlide) => (prevSlide + 1) % featureImageList.length
      );
    }, 3000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  // Fetch products
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  // Fetch banners + brands
  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  const { categoryList } = useSelector((state) => state.adminCategories);

useEffect(() => {
  dispatch(fetchAllCategories());
}, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Slider */}
      <div className="relative w-full h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
  {featureImageList.map((slide, index) => (
    <img
      src={slide?.image}
      key={index}
      className={`${
        index === currentSlide ? "opacity-100" : "opacity-0"
      } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
    />
  ))}

  {featureImageList.length > 1 && (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          setCurrentSlide(
            (prevSlide) =>
              (prevSlide - 1 + featureImageList.length) %
              featureImageList.length
          )
        }
        className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white/80"
      >
        <ChevronLeftIcon className="w-4 h-4 sm:w-6 sm:h-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          setCurrentSlide(
            (prevSlide) => (prevSlide + 1) % featureImageList.length
          )
        }
        className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white/80"
      >
        <ChevronRightIcon className="w-4 h-4 sm:w-6 sm:h-6" />
      </Button>
    </>
  )}
</div>


      
     {/* Categories */}
<section className="py-12 bg-gray-50">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {(categoryList || []).map((categoryItem) => {
        const IconComp = LucideIcons[categoryItem.icon] || LucideIcons["Box"]; // ✅ fallback icon
        return (
          <Card
            key={categoryItem._id}
            onClick={() =>
              handleNavigateToListingPage(categoryItem, "category")
            }
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <IconComp className="w-12 h-12 mb-4 text-primary" />
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
      {(brandList || []).map((brandItem) => {
        const IconComp = LucideIcons[brandItem.icon] || null; // ✅ null safe
        return (
          <Card
            key={brandItem._id || brandItem.id}
            onClick={() =>
              handleNavigateToListingPage(brandItem, "brand")
            }
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              {IconComp ? (
                <IconComp className="w-12 h-12 mb-4 text-primary" />
              ) : (
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
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
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
