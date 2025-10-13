import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PropTypes from "prop-types";
import { Star, ShoppingCart } from "lucide-react";

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

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  user
}) {
  return (
    <Card className="group relative w-full max-w-sm mx-auto overflow-hidden rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      <div>
        {/* Clickable Image Area */}
        <div
          onClick={() => handleGetProductDetails(product?._id)}
          className="cursor-pointer"
        >
          <div className="relative h-72 w-full overflow-hidden">
            <img
              src={product?.image}
              alt={product?.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
           {/* ✅ On Sale badge */}
        {product?.isOnSale && (
          <Badge className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-bold">
            🔥 On Sale
          </Badge>
        )}

        {/* ✅ Discount percentage */}
        {discount && (
          <Badge className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 text-xs font-bold">
            {discount}% OFF
          </Badge>
        )}
          </div>
        </div>

        {/* Product Information */}
        <CardContent className="p-4 bg-white">
          {/* Category/Brand */}
          <p className="mb-1 text-xs font-medium uppercase text-gray-500 tracking-wide">
            {product?.categoryId?.name || "Category"}
          </p>
          <h2 className="mb-2 h-12 text-base font-semibold text-gray-800 truncate-2-lines" title={product?.title}>
            {product?.title}
          </h2>

          {/* Star rating display */}
          <div className="mb-3">
            <StarRating rating={product.averageReview || 0} />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-red-600">
              ₹{product?.salePrice > 0 ? product.salePrice : product.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price}
              </span>
            )}
          </div>
        </CardContent>
      </div>

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

