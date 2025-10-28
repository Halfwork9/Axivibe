import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import PropTypes from "prop-types";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import StarRatingInput from "./star-rating-input";
import { useDispatch, useSelector } from "react-redux";
import { addReviewToProduct } from "../../store/shop/products-slice";
import { useToast } from "../ui/use-toast";
import { getImageUrl } from '@/utils/imageUtils';

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (productDetails) {
      setCurrentIndex(0);
      setImageError(false); // Reset error state when product changes
    }
  }, [productDetails]);

  if (!productDetails) return null;
  
  const productImages = Array.isArray(productDetails.images) && productDetails.images.length > 0
    ? productDetails.images
    : (productDetails.image ? [productDetails.image] : []);

  const handlePrevImage = () => {
    setImageError(false); // Reset error state when changing images
    setCurrentIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setImageError(false); // Reset error state when changing images
    setCurrentIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleSubmitReview = async () => {
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
        description:
          err.message || "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{productDetails?.title}</DialogTitle>
          <DialogDescription className="sr-only" id="product-description">
            Details for {productDetails?.title}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Product Images Carousel */}
          <div className="relative w-full h-[400px] bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
            {productImages.length > 0 ? (
              <img
                src={imageError ? "https://via.placeholder.com/400x400" : getImageUrl(productImages[currentIndex])}
                alt={productDetails?.title}
                className="w-full h-full object-cover rounded-lg"
                crossOrigin="anonymous"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-gray-500">No image available</span>
            )}

            {/* Carousel Controls */}
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
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setImageError(false); // Reset error state when changing images
                        setCurrentIndex(index);
                      }}
                      className={`h-2 w-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Description Section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {productDetails?.description || "No description available for this product."}
            </p>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Category: {productDetails?.categoryId?.name}</span>
            <span>Brand: {productDetails?.brandId?.name}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span className={`${productDetails?.salePrice > 0 ? "line-through text-gray-500" : ""} text-2xl font-bold`}>
              ₹{productDetails?.price}
            </span>
            {productDetails?.salePrice > 0 && (
              <span className="text-2xl font-bold text-red-600">
                ₹{productDetails?.salePrice}
              </span>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
            {productDetails?.reviews && productDetails.reviews.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-5 h-5 ${
                          idx < productDetails.averageReview
                            ? "fill-yellow-500"
                            : "fill-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {productDetails.averageReview.toFixed(1)} / 5
                  </span>
                </div>
                <ul className="space-y-3 mt-4 max-h-40 overflow-y-auto">
                  {productDetails.reviews.map((review) => (
                    <li key={review._id} className="p-3 border rounded-md bg-muted/30">
                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                        <span className="font-semibold text-black">{review.userName}</span>
                        <div className="flex items-center">
                          <span className="mr-1">{review.rating}</span>
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No reviews yet. Be the first to write one!</p>
            )}
          </div>
          
          {user && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Add Your Review</h3>
              <StarRatingInput rating={rating} setRating={setRating} />
              <Textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-3"
              />
              <Button onClick={handleSubmitReview} disabled={submitting} className="mt-3 w-full">
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          )}

          {!user && (
            <p className="text-sm text-gray-500 italic mt-3">
              Please log in to add a review.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

ProductDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  productDetails: PropTypes.object,
};

export default ProductDetailsDialog;
