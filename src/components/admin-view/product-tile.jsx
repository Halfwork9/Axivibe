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
  const isOnSale = product?.isOnSale && product?.salePrice < product?.price;
  const discount = isOnSale
    ? getDiscountPercentage(product.price, product.salePrice)
    : 0;

  return (
    <Card className="relative w-full max-w-sm mx-auto overflow-visible shadow-lg hover:shadow-xl transition-all bg-white rounded-lg">
      {/* ✅ Image with badges */}
      <div className="relative h-[280px] overflow-visible">
        {/* 🔥 On Sale badge */}
        {isOnSale && (
          <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            🔥 On Sale
          </div>
        )}

        {/* 🟢 % OFF badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 z-20 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {discount}% OFF
          </div>
        )}

        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-full object-cover rounded-t-lg transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* ✅ Product Info */}
      <CardContent className="p-4">
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
            {isOnSale ? (
              <>
                <span className="text-base font-semibold text-gray-500 line-through">
                  ₹{product?.price}
                </span>
                <span className="text-base font-bold text-red-600 ml-2">
                  ₹{product?.salePrice}
                </span>
              </>
            ) : (
              <span className="text-base font-semibold text-primary">
                ₹{product?.price}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      {/* ✅ Buttons */}
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
