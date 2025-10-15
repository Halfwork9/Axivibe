import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import { Star, ShoppingCart } from "lucide-react";
import { getDiscountPercentage } from "@/lib/utils"; // your helper

// Star rating small helper
const StarRating = ({ rating = 0 }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < fullStars ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

StarRating.propTypes = { rating: PropTypes.number };

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  // Ensure numeric values for comparison
  const price = Number(product?.price || 0);
  const salePrice = Number(product?.salePrice || 0);
  const isOnSale = product?.isOnSale === true && salePrice > 0 && salePrice < price;
  const discountPercent = isOnSale ? getDiscountPercentage(price, salePrice) : 0;

  return (
    <Card className="group relative w-full max-w-sm mx-auto overflow-hidden rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between bg-white">
      {/* Diagonal ribbon - top-left */}
      {isOnSale && (
        <div className="absolute -top-3 -left-3 z-30 pointer-events-none">
          <div className="rotate-[-45deg] origin-top-left shadow-md">
            <div className="bg-red-600 text-white text-[11px] font-bold px-10 py-1 text-center select-none">
              🔥 ON SALE
            </div>
          </div>
        </div>
      )}

      {/* % OFF - top-right */}
      {isOnSale && discountPercent > 0 && (
        <div className="absolute top-2 right-2 z-30">
          <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {discountPercent}% OFF
          </div>
        </div>
      )}

      {/* Clickable image */}
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative h-72 w-full overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Content */}
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
          <StarRating rating={product?.averageReview || 0} />
        </div>

        <div className="flex items-baseline gap-2">
          {isOnSale ? (
            <>
              <span className="text-lg font-bold text-red-600">₹{salePrice}</span>
              <span className="text-sm text-gray-500 line-through">₹{price}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">₹{price}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => handleAddtoCart(product?._id)}
          className="w-full"
          disabled={product?.totalStock === 0}
        >
          {product?.totalStock === 0 ? "Out Of Stock" : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
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
