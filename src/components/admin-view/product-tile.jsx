import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import PropTypes from "prop-types";

function AdminProductTile({ product, handleEdit, handleDelete }) {
  const isOnSale = product?.isOnSale && product?.price > 0 && product?.salePrice < product?.price;
  
  const discount = isOnSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
    
  const isLowStock = product?.totalStock > 0 && product?.totalStock <= 10;
  
  // ✅ FIX: Handles both old and new image formats for display
  const displayImage = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images[0]
    : product.image;

  return (
    <Card className="relative w-full max-w-sm mx-auto shadow-lg hover:shadow-2xl transition-all bg-white rounded-lg border overflow-hidden">
      {isOnSale && (
        <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden z-10">
          <div
            className="absolute transform -rotate-45 bg-red-600 text-center text-white font-semibold text-xs py-1 shadow-md"
            style={{ width: '150px', left: '-38px', top: '28px' }}
          >
            On Sale
          </div>
        </div>
      )}

      <div className="relative h-[280px]">
        {discount > 0 && (
          <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {discount}% OFF
          </div>
        )}
        <img
          src={displayImage}
          alt={product?.title}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-2 mt-2 truncate" title={product?.title}>
          {product?.title}
        </h2>
        <div className="text-sm mb-3 space-y-1 text-gray-700">
          <p><span className="font-semibold text-gray-900">Category:</span> {product?.categoryId?.name || "N/A"}</p>
          <p><span className="font-semibold text-gray-900">Brand:</span> {product?.brandId?.name || "N/A"}</p>
        </div>
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
                  <span className="text-sm font-semibold text-gray-500 line-through">₹{product?.price}</span>
                  <span className="text-lg font-bold text-red-600 ml-2">₹{product?.salePrice}</span>
                </div>
              ) : (
                <span className="text-lg font-semibold text-primary">₹{product?.price}</span>
              )}
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t p-3 bg-gray-50">
        <Button variant="outline" onClick={() => handleEdit(product)} className="w-[48%]">
          Edit
        </Button>
        <Button variant="destructive" onClick={() => handleDelete(product?._id)} className="w-[48%]">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

AdminProductTile.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string, // For backward compatibility
    images: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    price: PropTypes.number,
    salePrice: PropTypes.number,
    totalStock: PropTypes.number,
    categoryId: PropTypes.object,
    brandId: PropTypes.object,
    isOnSale: PropTypes.bool,
    _id: PropTypes.string,
  }).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default AdminProductTile;

