import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import PropTypes from "prop-types";
import { Badge } from "../ui/badge";
import { getDiscountPercentage } from "@/lib/utils";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const discount = getDiscountPercentage(product?.price, product?.salePrice);

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden shadow-lg hover:shadow-xl transition">
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[280px] object-cover"
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

      <CardContent>
        <h2 className="text-lg font-bold mb-2 mt-2 truncate">
          {product?.title}
        </h2>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product?.description}
        </p>

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

        <div className="flex justify-between items-center">
          <div>
            <span
              className={`${
                product?.isOnSale && product?.salePrice > 0
                  ? "line-through text-gray-500"
                  : ""
              } text-base font-semibold text-primary`}
            >
              ₹{product?.price}
            </span>
            {product?.isOnSale && product?.salePrice > 0 && (
              <span className="text-base font-bold text-red-600 ml-2">
                ₹{product?.salePrice}
              </span>
            )}
          </div>
        </div>
      </CardContent>

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
