import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { fetchAllBrands } from "@/store/admin/brand-slice";
import { fetchAllCategories } from "@/store/admin/category-slice";
import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";

const initialFormData = {
  images: [],
  title: "",
  description: "",
  categoryId: "",
  brandId: "",
  price: "",
  salePrice: "",
  totalStock: "",
  isOnSale: false,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const { brandList } = useSelector((state) => state.adminBrands);
  const { categoryList } = useSelector((state) => state.adminCategories);

  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllBrands());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleEdit = (product) => {
    setCurrentEditedId(product._id);
    setFormData({
      ...product,
      categoryId: product.categoryId?._id || "",
      brandId: product.brandId?._id || "",
    });
    // This logic handles both old (single image string) and new (multiple images array) data structures.
    const images = Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : (product.image ? [product.image] : []);
    setUploadedImageUrls(images);
    setOpenCreateProductsDialog(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id)).then(() => {
      toast({ title: "Product deleted successfully." });
      dispatch(fetchAllProducts());
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, images: uploadedImageUrls };
    const action = currentEditedId
      ? editProduct({ id: currentEditedId, formData: payload })
      : addNewProduct(payload);

    dispatch(action).then((res) => {
      if (res.payload?.success) {
        toast({ title: `Product ${currentEditedId ? "updated" : "added"} successfully!` });
        resetForm();
        dispatch(fetchAllProducts());
      } else {
        toast({ title: "Operation failed.", description: res.payload?.message, variant: "destructive" });
      }
    });
  };

  const resetForm = () => {
    setOpenCreateProductsDialog(false);
    setFormData(initialFormData);
    setCurrentEditedId(null);
    setUploadedImageUrls([]);
  };
  
  const formControls = [
    { label: "Title", name: "title", componentType: "input" },
    { label: "Description", name: "description", componentType: "textarea" },
    { label: "Category", name: "categoryId", componentType: "select", options: categoryList?.map(c => ({id: c._id, label: c.name})) || [] },
    { label: "Brand", name: "brandId", componentType: "select", options: brandList?.map(b => ({id: b._id, label: b.name})) || [] },
    { label: "Price", name: "price", componentType: "input", type: "number" },
    { label: "Total Stock", name: "totalStock", componentType: "input", type: "number" },
  ];

  return (
    <Fragment>
      <div className="flex justify-end">
        <Button onClick={() => {
          resetForm();
          setOpenCreateProductsDialog(true);
        }}>Add Product</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mt-6">
        {productList?.map((product) => (
          <AdminProductTile
            key={product._id}
            product={product}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      </div>
      <Sheet open={openCreateProductsDialog} onOpenChange={setOpenCreateProductsDialog}>
        <SheetContent side="right" className="overflow-auto w-full max-w-2xl">
          <SheetHeader>
            <SheetTitle>{currentEditedId ? "Edit Product" : "Add New Product"}</SheetTitle>
          </SheetHeader>
          <form onSubmit={onSubmit}>
            <ProductImageUpload
              uploadedImageUrls={uploadedImageUrls}
              setUploadedImageUrls={setUploadedImageUrls}
              isEditMode={!!currentEditedId}
            />
            <div className="py-6 space-y-4">
              <CommonForm
                isBtn={false}
                formData={formData}
                setFormData={setFormData}
                formControls={formControls}
              />
              <div className="flex items-center justify-between">
                <Label htmlFor="isOnSale" className="font-semibold text-md">Is On Sale?</Label>
                <Switch
                  id="isOnSale"
                  checked={formData.isOnSale}
                  onCheckedChange={(val) => setFormData({ ...formData, isOnSale: val })}
                />
              </div>
              {formData.isOnSale && (
                <div>
                  <Label className="font-semibold text-md">Sale Price</Label>
                  <Input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="Enter sale price"
                  />
                </div>
              )}
            </div>
            <Button type="submit" className="w-full">
              {currentEditedId ? "Update Product" : "Add Product"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;

