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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  categoryId: "",
  brandId: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  isOnSale: false, // ✅ new field
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
      image: uploadedImageUrl,
      salePrice:
        formData.isOnSale && formData.salePrice
          ? Number(formData.salePrice)
          : 0, // ✅ If not on sale, reset sale price to 0
    };

    currentEditedId !== null
      ? dispatch(editProduct({ id: currentEditedId, formData: payload })).then(
          (data) => {
            if (data?.payload?.success) {
              dispatch(fetchAllProducts());
              setFormData(initialFormData);
              setOpenCreateProductsDialog(false);
              setCurrentEditedId(null);
            }
          }
        )
      : dispatch(addNewProduct(payload)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({ title: "✅ Product added successfully" });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((key) => key !== "averageReview" && key !== "isOnSale")
      .every((key) => formData[key] !== "");
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllBrands());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  return (
    <Fragment>
      {/* Header */}
      <div className="mb-5 w-full flex justify-end">
        <Button
          onClick={() => {
            setFormData(initialFormData);
            setOpenCreateProductsDialog(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Add New Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList?.map((productItem) => (
          <AdminProductTile
            key={productItem._id}
            setFormData={setFormData}
            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
            setCurrentEditedId={setCurrentEditedId}
            product={productItem}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      {/* Product Sheet Drawer */}
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
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
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

          {/* Main Form */}
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={[
                { label: "Title", name: "title", componentType: "input" },
                { label: "Description", name: "description", componentType: "textarea" },
                {
                  label: "Category",
                  name: "categoryId",
                  componentType: "select",
                  options: categoryList.map((c) => ({
                    id: c._id,
                    label: c.name,
                  })),
                },
                {
                  label: "Brand",
                  name: "brandId",
                  componentType: "select",
                  options: brandList.map((b) => ({
                    id: b._id,
                    label: b.name,
                  })),
                },
                { label: "Price", name: "price", componentType: "input" },

                // ✅ Add "Is On Sale?" toggle
                {
                  label: (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="isOnSale" className="text-sm font-semibold">
                        Is On Sale?
                      </Label>
                      <Switch
                        id="isOnSale"
                        checked={formData.isOnSale}
                        onCheckedChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            isOnSale: val,
                            salePrice: val ? prev.salePrice : "",
                          }))
                        }
                      />
                    </div>
                  ),
                  name: "isOnSaleToggle",
                  componentType: "custom",
                },

                // ✅ Conditionally enabled Sale Price
                {
                  label: "Sale Price",
                  name: "salePrice",
                  componentType: "input",
                  disabled: !formData.isOnSale,
                },

                { label: "Total Stock", name: "totalStock", componentType: "input" },
              ]}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
