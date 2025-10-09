import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import PropTypes from "prop-types";
import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import StarRatingInput from "./star-rating-input"; // ✅ same folder
import { useDispatch, useSelector } from "react-redux";
import { addReviewToProduct } from "@/store/shop/products-slice";
import { useToast } from "@/components/ui/use-toast";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!productDetails) return null;

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
        title: "✅ Review added successfully!",
        className: "bg-green-600 text-white",
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{productDetails?.title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Product Image */}
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="w-full h-[300px] object-cover rounded"
          />

          {/* Description */}
          <p className="text-muted-foreground">{productDetails?.description}</p>

          {/* Category & Brand */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Category: {productDetails?.categoryId?.name}</span>
            <span>Brand: {productDetails?.brandId?.name}</span>
          </div>

          {/* Price */}
          <div className="flex gap-4 items-center">
            <span
              className={`${
                productDetails?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold`}
            >
              ₹{productDetails?.price}
            </span>
            {productDetails?.salePrice > 0 && (
              <Badge className="bg-green-500 text-white">
                ₹{productDetails?.salePrice}
              </Badge>
            )}
          </div>

          {/* Reviews Section */}
          {productDetails?.reviews && productDetails.reviews.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
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

              {/* Individual Reviews */}
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {productDetails.reviews.map((review, index) => (
                  <li
                    key={index}
                    className="p-2 border rounded-md bg-muted/30"
                  >
                    <p className="text-sm">{review.comment}</p>
                    <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                      <span>- {review.userId?.userName || "Anonymous"}</span>
                      <span>{review.rating} ★</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ✅ Add Review Form (only visible if logged in) */}
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
              <Button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="mt-3 w-full"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          )}

          {/* Message for guests */}
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
