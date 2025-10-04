import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PropTypes from "prop-types";
import { Star } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import StarRatingInput from "@/components/shopping-view/star-rating-input";
import { addReviewToProduct } from "@/store/shop/products-slice";


// Helper component to display existing ratings
const StarRatingDisplay = ({ rating = 0, totalReviews = 0 }) => {
    const totalStars = 5;
    const fullStars = Math.floor(rating);

    return (
        <div className="flex items-center gap-2">
            <div className="flex text-yellow-500">
                {[...Array(totalStars)].map((_, idx) => (
                    <Star
                        key={idx}
                        className={`w-5 h-5 ${
                            idx < fullStars ? "fill-yellow-500" : "fill-gray-300"
                        }`}
                    />
                ))}
            </div>
            <span className="text-sm text-muted-foreground">
                {rating.toFixed(1)} ({totalReviews} reviews)
            </span>
        </div>
    );
};
StarRatingDisplay.propTypes = {
    rating: PropTypes.number,
    totalReviews: PropTypes.number,
}


function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [newRating, setNewRating] = useState(0);
  const [comment, setComment] = useState("");
  const { user } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const { toast } = useToast();

  if (!productDetails) return null;

  const handleReviewSubmit = () => {
    if (newRating === 0) {
      toast({ title: "Please select a star rating.", variant: "destructive" });
      return;
    }
    if (!user?.id) {
       toast({ title: "Please log in to submit a review.", variant: "destructive" });
      return;
    }
    
    dispatch(addReviewToProduct({ 
      productId: productDetails._id, 
      rating: newRating, 
      comment 
    })).then(result => {
        if (result.meta.requestStatus === 'fulfilled') {
            toast({ title: "Thank you for your review!" });
            setNewRating(0);
            setComment("");
        } else {
            toast({ title: "Failed to submit review.", description: result.payload, variant: "destructive" });
        }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{productDetails?.title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 max-h-[80vh] overflow-y-auto pr-4">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="w-full h-[300px] object-cover rounded"
          />

          <p className="text-muted-foreground">{productDetails?.description}</p>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Category: {productDetails?.categoryId?.name}</span>
            <span>Brand: {productDetails?.brandId?.name}</span>
          </div>

          <div className="flex gap-4 items-center">
            <span
              className={`${
                productDetails?.salePrice > 0 ? "line-through text-gray-500" : ""
              } text-2xl font-bold`}
            >
              ₹{productDetails?.price}
            </span>
            {productDetails?.salePrice > 0 && (
               <span className="text-2xl font-bold text-red-600">
                ₹{productDetails?.salePrice}
              </span>
            )}
          </div>

          {/* Existing Reviews Section */}
          <div className="border-t pt-4">
             <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
            {productDetails?.reviews && productDetails.reviews.length > 0 ? (
              <>
                <StarRatingDisplay rating={productDetails.averageReview} totalReviews={productDetails.reviews.length} />
                <ul className="space-y-3 mt-4 max-h-40 overflow-y-auto">
                  {productDetails.reviews.map((review) => (
                    <li
                      key={review._id}
                      className="p-3 border rounded-md bg-muted/30"
                    >
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

          {/* Add a Review Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
            <div className="grid gap-4">
               <div>
                  <label className="text-sm font-medium mb-2 block">Your Rating</label>
                  <StarRatingInput rating={newRating} setRating={setNewRating} />
               </div>
               <div>
                  <label htmlFor="comment" className="text-sm font-medium mb-2 block">Your Review</label>
                  <Textarea
                    id="comment"
                    placeholder="Share your thoughts about the product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
               </div>
               <Button onClick={handleReviewSubmit} disabled={!user}>
                {user ? 'Submit Review' : 'Login to Review'}
               </Button>
            </div>
          </div>
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
