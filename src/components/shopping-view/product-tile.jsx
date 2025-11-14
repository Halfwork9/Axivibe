// src/components/shopping-view/product-tile.js
import React, { useState, useCallback } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import {
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";

// ⭐ Star Rating Component
const StarRating = ({ rating = 0 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 fill-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

// ⭐ MAIN COMPONENT
function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const isOnSale =
    product?.isOnSale &&
    product?.price > 0 &&
    product?.salePrice < product?.price;

  const discount = isOnSale
    ? Math.round(
        ((product.price - product.salePrice) / product.price) * 100
      )
    : 0;

  // 🔄 Image Navigation
  const prevImage = useCallback(
    (e) => {
      e.stopPropagation();
      setImageError(false);
      setCurrentImageIndex((i) =>
        i === 0 ? images.length - 1 : i - 1
      );
    },
    [images.length]
  );

  const nextImage = useCallback(
    (e) => {
      e.stopPropagation();
      setImageError(false);
      setCurrentImageIndex((i) =>
        i === images.length - 1 ? 0 : i + 1
      );
    },
    [images.length]
  );

  // 🛒 Add to cart
  const handleAdd = async (e) => {
    e.stopPropagation();
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    await handleAddtoCart(product._id, product.totalStock);
    setIsAddingToCart(false);
  };

  // 📱 Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const swipe = touchStartX - touchEndX;

    if (swipe > 50) nextImage(e);
    if (swipe < -50) prevImage(e);
  };

  return (
    <Card className="relative w-full h-full shadow-lg hover:shadow-2xl transition-all bg-white rounded-lg border overflow-hidden">
      {/* SALE RIBBON */}
      {isOnSale && (
        <div className="absolute top-0 left-0 z-10">
          <div className="absolute transform -rotate-45 bg-red-600 text-white text-xs font-semibold px-6 py-1 shadow-md mt-4 -ml-9">
            SALE
          </div>
        </div>
      )}

      {/* IMAGE SECTION */}
      <div
        className="relative h-64 sm:h-72 w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* DISCOUNT BADGE */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">
            {discount}% OFF
          </div>
        )}

        {/* MAIN IMAGE */}
        {images.length > 0 ? (
          <img
            onClick={() => handleGetProductDetails(product._id)}
            src={
              imageError
                ? "/fallback-product.png"
                : getImageUrl(images[currentImageIndex])
            }
            alt={product?.title}
            crossOrigin="anonymous"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-all duration-500 hover:scale-110 cursor-pointer"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">
            No Image
          </div>
        )}

        {/* IMAGE NAVIGATION BUTTONS */}
        {images.length > 1 && (
          <>
            <Button
              size="icon"
              variant="outline"
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 backdrop-blur-sm h-7 w-7 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 backdrop-blur-sm h-7 w-7 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* DOT INDICATORS */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 w-2 rounded-full ${
                    currentImageIndex === idx
                      ? "bg-white"
                      : "bg-white/50"
                  }`}
                ></span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* INFO SECTION */}
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
          {product?.categoryId?.name || "Category"}
        </p>

        <h2
          className="text-base font-semibold text-gray-900 leading-tight line-clamp-2 mb-2"
          title={product.title}
        >
          {product.title}
        </h2>

        <StarRating rating={product.averageReview || 0} />

        <div className="mt-2 flex items-center gap-2">
          {isOnSale ? (
            <>
              <span className="text-lg font-bold text-red-600">
                ₹{product.salePrice}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price}
            </span>
          )}
        </div>
      </CardContent>

      {/* ADD TO CART */}
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={product.totalStock === 0 || isAddingToCart}
          onClick={handleAdd}
        >
          {product.totalStock === 0 ? (
            "Out of Stock"
          ) : isAddingToCart ? (
            <>
              <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

ShoppingProductTile.propTypes = {
  product: PropTypes.object.isRequired,
  handleGetProductDetails: PropTypes.func.isRequired,
  handleAddtoCart: PropTypes.func.isRequired,
};

export default ShoppingProductTile;
