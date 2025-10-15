import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import PropTypes from "prop-types";
import { getDiscountPercentage } from "@/lib/utils";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  // Ensure numeric values for safe comparison
  const price = Number(product?.price || 0);
  const salePrice = Number(product?.salePrice || 0);

  // Show badges only if admin marked as on sale AND salePrice < price
  const isOnSale = product?.isOnSale === true && salePrice > 0 && salePrice < price;
  const discountPercent = isOnSale ? getDiscountPercentage(price, salePrice) : 0;

  return (
    <Card className="relative w-full max-w-sm mx-auto overflow-hidden shadow-lg hover:shadow-xl transition">
      {/* 🔴 On Sale ribbon (top-left) */}
      {isOnSale && (
        <div className="absolute -top-3 -left-3 z-30 pointer-events-none">
          <div className="rotate-[-45deg] origin-top-left shadow-md">
            <div className="bg-red-600 text-white text-[11px] font-bold px-10 py-1 text-center select-none">
              🔥 ON SALE
            </div>
          </div>
        </div>
      )}

      {/* 🟢 % OFF badge (top-right) */}
      {isOnSale && discountPercent > 0 && (
        <div className="absolute top-2 right-2 z-30">
          <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {discountPercent}% OFF
          </div>
        </div>
      )}

      {/* Product image */}
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[280px] object-cover"
        />
      </div>

      {/* Product content */}
      <CardContent>
        <h2 className="text-lg font-bold mb-2 mt-2 truncate">{product?.title}</h2>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product?.description}</p>

        <div className="text-sm mb-3 space-y-1">
          <p>
            <span className="font-semibold text-gray-900">Category:</span>{" "}
            {product?.categoryId?.name || "—"}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Brand:</span>{" "}
            {product?.brandId?.name || "—"}
          </p>
        </div>

        <p className="text-sm mb-3">
          <span className="font-semibold text-gray-900">Available Stock:</span>{" "}
          {product?.totalStock || 0}
        </p>

        {/* Price */}
        <div className="flex justify-between items-center">
          <div>
            {isOnSale ? (
              <>
                <span className="text-base font-semibold text-gray-500 line-through">
                  ₹{price}
                </span>
                <span className="text-base font-bold text-red-600 ml-2">
                  ₹{salePrice}
                </span>
              </>
            ) : (
              <span className="text-base font-semibold text-primary">
                ₹{price}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex justify-between items-center border-t pt-3">
        <Button
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData({
              ...product,
              categoryId: product?.categoryId?._id || "",
              brandId: product?.brandId?._id || "",
              isOnSale: product?.isOnSale || false,
            });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Edit
        </Button>

        <Button
          onClick={() => handleDelete(product?._id)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold"
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
    description: PropTypes.string,
    price: PropTypes.number,
    salePrice: PropTypes.number,
    totalStock: PropTypes.number,
    categoryId: PropTypes.object,
    brandId: PropTypes.object,
    isOnSale: PropTypes.bool,
    _id: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  setOpenCreateProductsDialog: PropTypes.func.isRequired,
  setCurrentEditedId: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default AdminProductTile;
