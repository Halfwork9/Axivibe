import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import PropTypes from "prop-types";
import { Star } from "lucide-react";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const isOnSale =
    product?.salePrice && product?.salePrice < product?.price && product?.salePrice > 0;

  return (
    <Card className="w-full max-w-sm mx-auto border border-gray-200 shadow-sm hover:shadow-lg transition">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[260px] object-contain bg-gray-50 rounded-t-lg p-2"
        />

        {/* ✅ Show sale badge only if salePrice < price */}
        {isOnSale && (
          <Badge className="absolute top-3 left-3 bg-red-600 text-white border-none">
            On Sale
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="space-y-3">
        {/* Title */}
        <h2
          className="text-lg font-bold text-gray-800 truncate"
          title={product?.title}
        >
          {product?.title}
        </h2>

        {/* Category and Brand (highlighted labels) */}
        <div className="flex justify-between text-sm text-gray-700">
          <span>
            <strong className="text-gray-900">Category:</strong>{" "}
            {product?.categoryId?.name || "Uncategorized"}
          </span>
          <span>
            <strong className="text-gray-900">Brand:</strong>{" "}
            {product?.brandId?.name || "N/A"}
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-2">
          <span
            className={`${
              isOnSale ? "line-through text-gray-400" : "text-gray-800"
            } text-lg font-semibold`}
          >
            ₹{product?.price}
          </span>
          {isOnSale && (
            <span className="text-lg font-bold text-red-600">
              ₹{product?.salePrice}
            </span>
          )}
        </div>

        {/* Stock & Rating Info */}
        <div className="flex justify-between items-center text-sm mt-2">
          <span
            className={`font-medium ${
              product?.totalStock > 10
                ? "text-green-600"
                : product?.totalStock > 0
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            Stock: {product?.totalStock ?? 0}
          </span>

          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-700">
              {product?.averageReview?.toFixed(1) || "0.0"}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="flex justify-between items-center pt-3">
        {/* ✅ Brighter Edit Button */}
        <Button
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Edit
        </Button>

        <Button
          variant="destructive"
          onClick={() => handleDelete(product?._id)}
          className="font-semibold"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

AdminProductTile.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
    salePrice: PropTypes.number,
    _id: PropTypes.string,
    totalStock: PropTypes.number,
    averageReview: PropTypes.number,
    categoryId: PropTypes.shape({
      name: PropTypes.string,
    }),
    brandId: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  setOpenCreateProductsDialog: PropTypes.func.isRequired,
  setCurrentEditedId: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default AdminProductTile;
