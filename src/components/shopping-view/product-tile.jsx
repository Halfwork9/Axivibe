import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PropTypes from "prop-types";
import { Star, ShoppingCart } from "lucide-react";
import { getImageUrl } from '@/utils/imageUtils';
import { useState } from 'react'; // Make sure useState is imported

// Helper component to display star ratings
const StarRating = ({ rating = 0 }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < fullStars
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 fill-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
};

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  // Move useState inside the component
  const [imageError, setImageError] = useState(false);
  
  const isOnSale = product?.isOnSale && product?.price > 0 && product?.salePrice < product?.price;
  
  const discount = isOnSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Card className="relative w-full max-w-sm mx-auto shadow-lg hover:shadow-2xl transition-all bg-white rounded-lg border overflow-hidden">
      {/* ✅ FIX: Added the corner "On Sale" Ribbon */}
      {isOnSale && (
        <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden z-10">
          <div
            className="absolute transform -rotate-45 bg-red-600 text-center text-white font-semibold text-xs py-1 shadow-md"
            style={{
              width: '150px',
              left: '-38px',
              top: '28px',
            }}
          >
            On Sale
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-72 w-full overflow-hidden rounded-t-lg">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {discount}% OFF
          </div>
        )}
      <img
  onClick={() => handleGetProductDetails(product?._id)}
  crossOrigin="anonymous"
  src={imageError ? "/placeholder-image.jpg" : getImageUrl(product.images[0] || product.image)}
  alt={product?.title}
  className="h-full w-full object-cover cursor-pointer transition-transform duration-500 hover:scale-110"
  onError={() => setImageError(true)}
/>

      </div>

      {/* Product Info */}
      <CardContent className="p-4 bg-white">
        <p className="mb-1 text-xs font-medium uppercase text-gray-500 tracking-wide">
          {product?.categoryId?.name || "Category"}
        </p>
        <h2
          className="mb-2 h-12 text-base font-semibold text-gray-800 truncate-2-lines"
          title={product?.title}
        >
          {product?.title}
        </h2>
        <div className="mb-3">
          <StarRating rating={product.averageReview || 0} />
        </div>
        <div className="flex items-baseline gap-2">
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

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => handleAddtoCart(product?._id)}
          className="w-full"
          disabled={product?.totalStock === 0}
        >
          {product?.totalStock === 0 ? (
            "Out Of Stock"
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

ShoppingProductTile.propTypes = {
  handleGetProductDetails: PropTypes.func.isRequired,
  handleAddtoCart: PropTypes.func.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    totalStock: PropTypes.number,
    salePrice: PropTypes.number,
    price: PropTypes.number,
    averageReview: PropTypes.number,
    isOnSale: PropTypes.bool,
    categoryId: PropTypes.shape({ name: PropTypes.string }),
    brandId: PropTypes.shape({ name: PropTypes.string }),
  }).isRequired,
};

export default ShoppingProductTile;
