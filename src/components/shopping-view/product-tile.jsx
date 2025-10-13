import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="group relative w-full max-w-sm mx-auto overflow-hidden rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
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
          {product?.salePrice > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white border-none">
              Sale
            </Badge>
          )}
        </div>
      </div>

      {/* Product Information */}
      <CardContent className="p-4 pb-16 bg-white">
        {/* Category/Brand */}
        <p className="mb-1 text-xs font-medium uppercase text-gray-500 tracking-wide">
          {product?.categoryId?.name || "Category"}
        </p>
        <h2 className="mb-2 h-12 text-base font-semibold text-gray-800 truncate-2-lines" title={product?.title}>
          {product?.title}
        </h2>

        {/* Star rating display */}
        <div className="mb-3">
          <StarRating rating={product.averageReview || 4.5} />
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

      <div className="flex flex-col justify-between h-full">
  <div>
    <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded-t" />
    <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
    <p className="text-sm text-gray-500">{product.categoryId?.name}</p>
  </div>

  <div className="mt-3 flex justify-between items-center">
    <span className="font-bold text-primary">₹{product.salePrice || product.price}</span>
    <Button
      onClick={() => handleAddtoCart(product._id)}
      className="bg-primary hover:bg-primary/90 text-white"
    >
      Add to Cart
    </Button>
  </div>
</div>


      {/* Review Section for product 
      <div className="mt-6">
        <ProductReviewSection productId={product._id} user={user} />
      </div> */}
    </Card>
  );
}

// Add CSS utility for multi-line truncation to your global CSS file (e.g., index.css)
/*
@layer utilities {
  .truncate-2-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
*/

ShoppingProductTile.propTypes = {
  handleGetProductDetails: PropTypes.func.isRequired,
  handleAddtoCart: PropTypes.func.isRequired,
  user: PropTypes.object, // Pass logged-in user object
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
