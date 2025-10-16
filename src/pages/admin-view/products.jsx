import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

const initialFormData = {
  images: [],
  title: "",
  description: "",
  categoryId: "",
  brandId: "",
  price: 0,
  salePrice: 0,
  totalStock: 0,
  isOnSale: false,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList, pagination } = useSelector((state) => state.adminProducts);
  const { brandList } = useSelector((state) => state.adminBrands);
  const { categoryList } = useSelector((state) => state.adminCategories);

  const dispatch = useDispatch();
  const { toast } = useToast();

  const loadProducts = () => {
    dispatch(fetchAllProducts());
  };

  useEffect(() => {
    loadProducts();
    dispatch(fetchAllBrands());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const filteredProducts = productList; // Assuming search/filter logic is handled elsewhere or not needed for now

  function onSubmit(e) {
    e.preventDefault();
    if (uploadedImageUrls.length === 0) {
      toast({ title: "Please upload at least one image.", variant: "destructive" });
      return;
    }
    const payload = { ...formData, images: uploadedImageUrls };

    const action = currentEditedId
      ? editProduct({ id: currentEditedId, formData: payload })
      : addNewProduct(payload);

    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        loadProducts();
        toast({ title: `Product ${currentEditedId ? "updated" : "added"} successfully!` });
        resetForm();
      } else {
        toast({ title: data.payload.message || "An error occurred.", variant: "destructive" });
      }
    });
  }

  const resetForm = () => {
    setFormData(initialFormData);
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setUploadedImageUrls([]);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id)).then(loadProducts);
  };

  const handleEdit = (product) => {
    setCurrentEditedId(product._id);
    setFormData({
      ...product,
      categoryId: product.categoryId?._id || "",
      brandId: product.brandId?._id || "",
    });
    setUploadedImageUrls(product.images || []);
    setOpenCreateProductsDialog(true);
  };

  const formControls = [
    { label: "Title", name: "title", componentType: "input" },
    { label: "Description", name: "description", componentType: "textarea" },
    { label: "Category", name: "categoryId", componentType: "select", options: categoryList?.map(c => ({ id: c._id, label: c.name })) || [] },
    { label: "Brand", name: "brandId", componentType: "select", options: brandList?.map(b => ({ id: b._id, label: b.name })) || [] },
    { label: "Price", name: "price", componentType: "input", type: "number" },
    { label: "Total Stock", name: "totalStock", componentType: "input", type: "number" },
  ];

  return (
    <Fragment>
      <div className="flex justify-end mb-6">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>Add Product</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts?.length ? (
          filteredProducts.map((product) => (
            <AdminProductTile
              key={product._id}
              product={product}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">No products found.</p>
        )}
      </div>

      <Sheet open={openCreateProductsDialog} onOpenChange={resetForm}>
        <SheetContent side="right" className="overflow-auto w-full max-w-2xl">
          <SheetHeader>
            <SheetTitle>{currentEditedId ? "Edit Product" : "Add New Product"}</SheetTitle>
          </SheetHeader>
          
          <ProductImageUpload
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
          />
          
          <form onSubmit={onSubmit} className="py-6 space-y-4">
            <CommonForm
              formData={formData}
              setFormData={setFormData}
              formControls={formControls}
              buttonText={currentEditedId ? "Update Product" : "Add Product"}
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
                <input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  placeholder="Enter sale price"
                />
              </div>
            )}
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

