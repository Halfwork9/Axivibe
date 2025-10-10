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
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  categoryId: "",
  brandId: "",
  price: "",
  salePrice: "",
  totalStock: "",
  isOnSale: false, // ✅ added
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const { brandList } = useSelector((state) => state.adminBrands);
  const { categoryList } = useSelector((state) => state.adminCategories);

  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    const payload = {
      ...formData,
      image: uploadedImageUrl || formData.image,
    };

    currentEditedId
      ? dispatch(editProduct({ id: currentEditedId, formData: payload })).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            resetForm();
            toast({ title: "Product updated successfully" });
          }
        })
      : dispatch(addNewProduct(payload)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            resetForm();
            toast({ title: "Product added successfully" });
          }
        });
  }

  function resetForm() {
    setFormData(initialFormData);
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setImageFile(null);
    setUploadedImageUrl("");
  }

  function handleDelete(productId) {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "Product deleted" });
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((key) => key !== "averageReview")
      .every((key) => key !== "salePrice" || formData.isOnSale ? formData[key] !== "" : true);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllBrands());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList?.map((product) => (
          <AdminProductTile
            key={product._id}
            product={product}
            setFormData={setFormData}
            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
            setCurrentEditedId={setCurrentEditedId}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-6 space-y-4">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId ? "Update Product" : "Add Product"}
              formControls={[
                { label: "Title", name: "title", componentType: "input" },
                { label: "Description", name: "description", componentType: "textarea" },
                {
                  label: "Category",
                  name: "categoryId",
                  componentType: "select",
                  options: categoryList.map((c) => ({ id: c._id, label: c.name })),
                },
                {
                  label: "Brand",
                  name: "brandId",
                  componentType: "select",
                  options: brandList.map((b) => ({ id: b._id, label: b.name })),
                },
                { label: "Price", name: "price", componentType: "input" },
                {
                  label: "Total Stock",
                  name: "totalStock",
                  componentType: "input",
                },
              ]}
              isBtnDisabled={!isFormValid()}
            />

            {/* ✅ Is On Sale Toggle + Conditional Sale Price Input */}
            <div className="flex items-center justify-between mt-4">
              <Label htmlFor="isOnSale" className="font-semibold text-md">
                Is On Sale?
              </Label>
              <Switch
                checked={formData.isOnSale}
                onCheckedChange={(val) => setFormData({ ...formData, isOnSale: val })}
              />
            </div>

            {formData.isOnSale && (
              <div className="mt-2">
                <Label className="font-semibold text-md">Sale Price</Label>
                <input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
                  placeholder="Enter discounted price"
                />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
