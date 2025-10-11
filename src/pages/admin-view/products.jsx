import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { fetchAllBrands } from "@/store/admin/brand-slice";
import { fetchAllCategories } from "@/store/admin/category-slice";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  categoryId: "",
  brandId: "",
  price: "",
  salePrice: "",
  totalStock: "",
  isOnSale: false,
  averageReview: 0,
};

function AdminProducts() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { productList, pagination } = useSelector((state) => state.adminProducts);
  const { brandList } = useSelector((state) => state.adminBrands);
  const { categoryList } = useSelector((state) => state.adminCategories);

  // --- Local UI states ---
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  // --- Filters + Pagination ---
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    brandId: "",
    isOnSale: "",
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllProducts({ page, ...filters }));
    dispatch(fetchAllBrands());
    dispatch(fetchAllCategories());
  }, [dispatch, page, filters]);

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  }

  function handleSearchChange(e) {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(1);
  }

  function onSubmit(e) {
    e.preventDefault();
    const payload = { ...formData, image: uploadedImageUrl || formData.image };

    const action = currentEditedId
      ? editProduct({ id: currentEditedId, formData: payload })
      : addNewProduct(payload);

    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        resetForm();
        toast({
          title: currentEditedId ? "Product updated successfully" : "Product added successfully",
        });
      }
    });
  }

  function resetForm() {
    setFormData(initialFormData);
    setOpenDialog(false);
    setCurrentEditedId(null);
    setImageFile(null);
    setUploadedImageUrl("");
  }

  function handleDelete(id) {
    dispatch(deleteProduct(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "Product deleted" });
      }
    });
  }

  return (
    <Fragment>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <Button onClick={() => setOpenDialog(true)}>Add Product</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <Input
          placeholder="Search by name..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-64"
        />

        <Select onValueChange={(val) => handleFilterChange("categoryId", val)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categoryList.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => handleFilterChange("brandId", val)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Brands</SelectItem>
            {brandList.map((b) => (
              <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => handleFilterChange("isOnSale", val)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sale Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="true">On Sale</SelectItem>
            <SelectItem value="false">Not on Sale</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList?.map((p) => (
          <AdminProductTile
            key={p._id}
            product={p}
            setFormData={setFormData}
            setOpenCreateProductsDialog={setOpenDialog}
            setCurrentEditedId={setCurrentEditedId}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </Button>
          <span className="font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add/Edit Product Sheet */}
      <Sheet open={openDialog} onOpenChange={() => resetForm()}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{currentEditedId ? "Edit Product" : "Add New Product"}</SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={() => {}}
            imageLoadingState={false}
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
                { label: "Total Stock", name: "totalStock", componentType: "input" },
              ]}
              isBtnDisabled={!formData.title || !formData.price}
            />

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
              <div className="mt-3">
                <Label className="font-semibold">Sale Price</Label>
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
