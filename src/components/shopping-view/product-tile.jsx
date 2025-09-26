import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PropTypes from "prop-types";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto flex flex-col justify-between">
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out Of Stock
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2">Sale</Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-lg font-bold truncate mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
            <span>{product?.categoryId?.name}</span>
            <span>{product?.brandId?.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`text-lg font-semibold text-primary ${
                product?.salePrice > 0 ? "line-through text-gray-500" : ""
              }`}
            >
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-bold text-red-500">
                ₹{product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => handleAddtoCart(product?._id)}
          className="w-full"
          disabled={product?.totalStock === 0}
        >
          {product?.totalStock === 0 ? "Out Of Stock" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

ShoppingProductTile.propTypes = {
  handleGetProductDetails: PropTypes.func.isRequired,
  handleAddtoCart: PropTypes.func.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    totalStock: PropTypes.number,
    salePrice: PropTypes.number,
    price: PropTypes.number,
    categoryId: PropTypes.shape({
      name: PropTypes.string,
    }),
    brandId: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
};

export default ShoppingProductTile;
