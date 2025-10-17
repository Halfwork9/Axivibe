import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import PropTypes from "prop-types";
import { useState } from "react"; // ✅ Import useState for local state management
import { ChevronLeft, ChevronRight } from "lucide-react"; // ✅ Import new icons

function AdminProductTile({ product, handleEdit, handleDelete }) {
  const [currentIndex, setCurrentIndex] = useState(0); // ✅ State to track the current image

  const isOnSale = product?.isOnSale && product?.price > 0 && product?.salePrice < product?.price;
  const discount = isOnSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const isLowStock = product?.totalStock > 0 && product?.totalStock <= 10;

  // ✅ Consistent logic to handle both old and new image formats
  const productImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : []);

  const handlePrev = (e) => {
    e.stopPropagation(); // Prevent card's onClick from firing
    setCurrentIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1));
  };
  const handleNext = (e) => {
    e.stopPropagation(); // Prevent card's onClick from firing
    setCurrentIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
  };


  return (
    <Card className="group relative w-full max-w-sm mx-auto shadow-lg hover:shadow-2xl transition-all bg-white rounded-lg border overflow-hidden">
      {isOnSale && (
        <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden z-20">
          <div
            className="absolute transform -rotate-45 bg-red-600 text-center text-white font-semibold text-xs py-1 shadow-md"
            style={{ width: '150px', left: '-38px', top: '28px' }}
          >
            On Sale
          </div>
        </div>
      )}

      {/* ✅ NEW: Image Carousel Section */}
      <div className="relative h-[280px]">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 z-20 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {discount}% OFF
          </div>
        )}

        {/* Main Image Display */}
        {productImages.length > 0 ? (
           <img
            src={productImages[currentIndex]}
            alt={product?.title}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">No Image</div>
        )}
        
        {/* Carousel Controls (visible on hover) */}
        {productImages.length > 1 && (
            <>
                <Button
                    variant="outline" size="icon"
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline" size="icon"
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                {/* Dot Indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {productImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(index);
                            }}
                            className={`h-2 w-2 rounded-full transition-colors ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            </>
        )}
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
    image: PropTypes.string,
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

