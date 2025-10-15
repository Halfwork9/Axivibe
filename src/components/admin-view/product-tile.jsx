import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import PropTypes from "prop-types";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const isOnSale = product?.isOnSale && product?.price > 0 && product?.salePrice < product?.price;
  
  const discount = isOnSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
    
  const isLowStock = product?.totalStock > 0 && product?.totalStock <= 10;

  return (
    <Card className="relative w-full max-w-sm mx-auto overflow-hidden shadow-lg hover:shadow-2xl transition-all bg-white rounded-lg border">
      {/* ✅ FIX: Replaced the floating pill with a corner ribbon style */}
      {isOnSale && (
        <div className="absolute top-0 left-0 h-24 w-24">
          <div className="absolute transform -rotate-45 bg-red-600 text-center text-white font-semibold py-1 left-[-50px] top-[32px] w-[170px]">
            On Sale
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-[280px]">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {discount}% OFF
          </div>
        )}
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      {/* Product Info */}
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-2 mt-2 truncate" title={product?.title}>
          {product?.title}
        </h2>

        <div className="text-sm mb-3 space-y-1 text-gray-700">
          <p>
            <span className="font-semibold text-gray-900">Category:</span>{" "}
            {product?.categoryId?.name || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Brand:</span>{" "}
            {product?.brandId?.name || "N/A"}
          </p>
        </div>

        {/* Stock and Price Info */}
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
                <span className="font-semibold text-gray-900 mr-2">Stock:</span>
                {isLowStock ? (
                    <span className="text-xs font-bold bg-yellow-500 text-white px-2 py-1 rounded-full">{product?.totalStock} Low</span>
                ) : (
                    <span className="text-sm">{product?.totalStock || 0}</span>
                )}
            </div>
             <div>
              {isOnSale ? (
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-500 line-through">
                    ₹{product?.price}
                  </span>
                  <span className="text-lg font-bold text-red-600 ml-2">
                    ₹{product?.salePrice}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-semibold text-primary">
                  ₹{product?.price}
                </span>
              )}
            </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="flex justify-between items-center border-t p-3 bg-gray-50">
        <Button
          variant="outline"
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
          className="w-[48%]"
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleDelete(product?._id)}
          className="w-[48%]"
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

