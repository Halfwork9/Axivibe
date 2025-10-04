import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import PropTypes from "prop-types";
import { Star } from "lucide-react";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  // This line is correctly preventing the dialog from opening because the backend is not sending any product data.
  if (!productDetails) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{productDetails?.title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
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
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {productDetails.reviews.map((review, index) => (
                  <li
                    key={index}
                    className="p-2 border rounded-md bg-muted/30"
                  >
                    <p className="text-sm">{review.comment}</p>
                    <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                      <span>- {review.userName}</span>
                      <span>{review.rating} ★</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
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

