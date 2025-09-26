import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import PropTypes from "prop-types";
import { Star } from "lucide-react";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  console.log('ProductDetailsDialog - productDetails:', productDetails); // Debug

  // Defensive: don't render if missing
  if (!productDetails) return null;

  // Defensive: fallback values
  const title = productDetails?.title || "Untitled";
  const image = productDetails?.image || "";
  const description = productDetails?.description || "";
  const categoryName = productDetails?.categoryId?.name || "Unknown";
  const brandName = productDetails?.brandId?.name || "Unknown";
  const price = typeof productDetails?.price === "number" ? productDetails.price : "-";
  const salePrice = typeof productDetails?.salePrice === "number" ? productDetails.salePrice : 0;

  // Defensive: reviews
  const reviews = Array.isArray(productDetails?.reviews) ? productDetails.reviews : [];
  const averageReview =
    typeof productDetails?.averageReview === "number"
      ? productDetails.averageReview
      : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Product Image */}
          {image && (
            <img
              src={image}
              alt={title}
              className="w-full h-[300px] object-cover rounded"
            />
          )}

          {/* Description */}
          <p className="text-muted-foreground">{description}</p>

          {/* Category & Brand */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Category: {categoryName}</span>
            <span>Brand: {brandName}</span>
          </div>

          {/* Price */}
          <div className="flex gap-4 items-center">
            <span
              className={`${
                salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold`}
            >
              ₹{price}
            </span>
            {salePrice > 0 && (
              <Badge className="bg-green-500 text-white">
                ₹{salePrice}
              </Badge>
            )}
          </div>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
              <div className="flex items-center gap-2 mb-3">
                {/* Average Rating */}
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-5 h-5 ${
                        idx < Math.round(averageReview)
                          ? "fill-yellow-500"
                          : "fill-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {averageReview.toFixed(1)} / 5
                </span>
              </div>

              {/* Individual Reviews */}
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {reviews.map((review, index) => (
                  <li
                    key={index}
                    className="p-2 border rounded-md bg-muted/30"
                  >
                    <p className="text-sm">{review?.comment || ""}</p>
                    <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                      <span>- {review?.userName || "Anonymous"}</span>
                      <span>{review?.rating ?? "-"} ★</span>
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
