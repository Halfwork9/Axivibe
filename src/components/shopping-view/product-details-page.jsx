import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import StarRatingInput from "./star-rating-input";
import { useDispatch, useSelector } from "react-redux";
import { addReviewToProduct, fetchProductDetails } from "../../store/shop/products-slice";
import { addToCart,updateCartQuantity,
  fetchCartItems, } from "../../store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { getImageUrl } from "@/utils/imageUtils";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { productDetails, isLoading } = useSelector((state) => state.shopProducts);
  const { cartItems, loading: cartLoading } = useSelector((state) => state.shopCart);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // ✅ Fetch product details and cart when id changes
  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id));
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [dispatch, id, user]);

  // ✅ Check if product already exists in cart
  const existingCartItem = cartItems?.find(
    (item) => item.productId === productDetails?._id
  );

  // ✅ Preload quantity if product already in cart
  useEffect(() => {
    if (existingCartItem) {
      setQuantity(existingCartItem.quantity);
    }
  }, [existingCartItem]);


  // ✅ Safe check: return loader or error message before product loads
  if (isLoading || !productDetails) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-gray-500">
        {isLoading ? "Loading product details..." : "Product not found"}
      </div>
    );
  }

  // ✅ Compute safely after data exists
  const productImages = Array.isArray(productDetails?.images) && productDetails.images.length > 0
    ? productDetails.images
    : productDetails?.image
    ? [productDetails.image]
    : [];

  const handlePrevImage = () => {
    setImageError(false);
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setImageError(false);
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setImageError(false);
    setCurrentImageIndex(index);
  };

  // ✅ Quantity + Sync Cart
  const handleQuantityChange = async (type) => {
    const newQty =
      type === "increase"
        ? Math.min(quantity + 1, productDetails.totalStock)
        : Math.max(quantity - 1, 1);

    setQuantity(newQty);

    // 🔄 Auto-update cart if item exists
    if (user && existingCartItem) {
      try {
        await dispatch(
          updateCartQuantity({
            userId: user.id,
            productId: productDetails._id,
            quantity: newQty,
          })
        ).unwrap();
      } catch (err) {
        toast({
          title: "Failed to update cart",
          description: err.message || "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };


  const handleAddToCart = async () => {
    if (!user || !user.id) {
      toast({
        title: "Please login to add items to cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    setIsAddingToCart(true);
    try {
      await dispatch(
        addToCart({
          userId: user.id,
          productId: productDetails._id,
          quantity,
        })
      ).unwrap();
      toast({ title: "Product added to cart successfully" });
    } catch (error) {
      toast({
        title: "Failed to add product to cart",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !user.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (!rating || !comment.trim()) {
      toast({
        title: "Please fill all fields",
        description: "Provide both a rating and a comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(
        addReviewToProduct({
          productId: productDetails._id,
          rating,
          comment,
        })
      ).unwrap();

      setRating(0);
      setComment("");
      toast({
        title: "Review added successfully!",
        className: "bg-green-400 text-white",
      });
    } catch (err) {
      console.error("Failed to add review:", err);
      toast({
        title: "Failed to add review",
        description: err.message || "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isOnSale =
    productDetails?.salePrice > 0 && productDetails?.salePrice < productDetails?.price;
  const discount = isOnSale
    ? Math.round(
        ((productDetails.price - productDetails.salePrice) / productDetails.price) * 100
      )
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center space-x-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate("/shop/home")} className="hover:text-primary">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigate("/shop/listing")} className="hover:text-primary">
          Products
        </button>
        <span>/</span>
        <span className="text-gray-900">{productDetails?.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
            {productImages.length > 0 ? (
              <img
                src={
                  imageError
                    ? "https://picsum.photos/seed/product/600/600.jpg"
                    : getImageUrl(productImages[currentImageIndex])
                }
                alt={productDetails?.title || "Product"}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}

            {productImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                {discount}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {productImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    currentImageIndex === index ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${productDetails?.title || "Product"} ${index + 1}`}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">{productDetails?.title}</h1>

          <div className="flex items-center mt-2 space-x-2">
            <div className="flex text-yellow-500">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-5 h-5 ${
                    idx < productDetails?.averageReview ? "fill-yellow-500" : "fill-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {productDetails?.averageReview?.toFixed(1) || "0.0"} (
              {productDetails?.reviews?.length || 0} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-4">
            {isOnSale ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  ₹{productDetails?.salePrice}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ₹{productDetails?.price}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                ₹{productDetails?.price}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="outline">{productDetails?.categoryId?.name}</Badge>
            <Badge variant="outline">{productDetails?.brandId?.name}</Badge>
            {productDetails?.totalStock > 0 ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                In Stock ({productDetails?.totalStock})
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-600">
                Out of Stock
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange("increase")}
                  disabled={quantity >= productDetails?.totalStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={
                  productDetails?.totalStock === 0 || isAddingToCart || cartLoading
                }
                className="flex-1"
              >
                {isAddingToCart || cartLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border rounded-md p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">Free delivery on orders over ₹500</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <span className="text-sm">7 days return policy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">1 year warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Product Description</h3>
            <p className="text-gray-600 whitespace-pre-line">
              {productDetails?.description || "No description available for this product."}
            </p>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
            {productDetails?.reviews && productDetails.reviews.length > 0 ? (
              <div className="space-y-4">
                {productDetails.reviews.map((review) => (
                  <div key={review._id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{review.userName}</span>
                      <div className="flex items-center">
                        <div className="flex text-yellow-500 mr-2">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-4 h-4 ${
                                idx < review.rating ? "fill-yellow-500" : "fill-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to write one!</p>
            )}

            {user && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>
                <div className="space-y-4">
                  <StarRatingInput rating={rating} setRating={setRating} />
                  <Textarea
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                  <Button
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="w-full md:w-auto"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </div>
            )}

            {!user && (
              <p className="text-gray-500 italic mt-6">
                Please{" "}
                <button
                  onClick={() => navigate("/auth/login")}
                  className="text-primary hover:underline"
                >
                  log in
                </button>{" "}
                to add a review.
              </p>
            )}
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
            <p className="text-gray-600">Standard delivery: 5-7 business days</p>
            <p className="text-gray-600">Express delivery: 2-3 business days</p>
            <p className="text-gray-600">Free delivery on orders over ₹500</p>
            <p className="text-gray-600">International shipping available</p>
            <Separator className="my-6" />
            <h3 className="text-lg font-semibold mb-4">Return Policy</h3>
            <p className="text-gray-600">7 days return policy</p>
            <p className="text-gray-600">Product must be in original condition</p>
            <p className="text-gray-600">Original packaging required</p>
            <p className="text-gray-600">Return shipping fee may apply</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
