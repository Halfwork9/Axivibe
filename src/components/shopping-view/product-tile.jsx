import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import { Star, ShoppingCart } from "lucide-react";

// ⭐ Helper: Star Rating
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

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart, user }) {
  // 🔢 Sale Logic
  const isOnSale = product?.salePrice && product?.salePrice < product?.price;
  const discountPercent = isOnSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Card className="group relative w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* 🔴 Angled On Sale Ribbon */}
      {isOnSale && (
        <div className="absolute top-3 left-[-40px] bg-red-600 text-white text-xs font-bold px-12 py-1 rotate-[-45deg] shadow-md">
          🔥 ON SALE
        </div>
      )}

      {/* 🟢 Discount Badge */}
      {isOnSale && (
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {discountPercent}% OFF
        </div>
      )}

      {/* 🖼️ Product Image */}
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        <div className="relative h-72 w-full overflow-hidden bg-gray-50">
          <img
            src={product?.image || "/placeholder.png"}
            alt={product?.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>

      {/* 📋 Product Details */}
      <CardContent className="p-4 bg-white">
        <p className="mb-1 text-xs font-medium uppercase text-gray-500 tracking-wide">
          {product?.categoryId?.name || "Category"}
        </p>

        <h2
          className="mb-1 text-base font-semibold text-gray-800 truncate"
          title={product?.title}
        >
          {product?.title}
        </h2>

        {/* 🏷️ Brand Name */}
        {product?.brandId?.name && (
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium text-gray-800">
              Brand:
            </span>{" "}
            {product.brandId.name}
          </p>
        )}

        {/* ⭐ Star Rating */}
        <div className="mb-3">
          <StarRating rating={product.averageReview || 4.5} />
        </div>

        {/* 💰 Price */}
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

      {/* 🛒 Add to Cart Button */}
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => handleAddtoCart(product?._id)}
          className="w-full font-semibold"
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
  user: PropTypes.object,
  product: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    totalStock: PropTypes.number,
    salePrice: PropTypes.number,
    price: PropTypes.number,
    averageReview: PropTypes.number,
    categoryId: PropTypes.shape({
      name: PropTypes.string,
    }),
    brandId: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
};

export default ShoppingProductTile;
