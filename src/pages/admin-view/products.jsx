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
import { Select } from "@/components/ui/select";
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
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [currentEditedId, setCurrentEditedId] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [saleFilter, setSaleFilter] = useState("");
  const [page, setPage] = useState(1);

  const { productList, pagination } = useSelector((state) => state.adminProducts);
  const { brandList } = useSelector((state) => state.adminBrands);
  const { categoryList } = useSelector((state) => state.adminCategories);

  const dispatch = useDispatch();
  const { toast } = useToast();

  // --- SAFE OPTIONS ---
  const categoryOptions = categoryList?.filter(c => c && c._id && c.name)
    .map(c => ({ id: String(c._id), label: c.name })) || [];
  const brandOptions = brandList?.filter(b => b && b._id && b.name)
    .map(b => ({ id: String(b._id), label: b.name })) || [];
  const saleOptions = [
    { id: "true", label: "On Sale" },
    { id: "false", label: "Regular" },
  ];

  const loadProducts = () => {
    dispatch(
      fetchAllProducts({
        page,
        categoryId: categoryFilter,
        brandId: brandFilter,
        isOnSale: saleFilter,
      })
    );
  };

  // 🔁 Fetch products when filters/pagination change
  useEffect(() => {
    loadProducts();
  }, [dispatch, page, categoryFilter, brandFilter, saleFilter]);

  useEffect(() => {
    dispatch(fetchAllBrands());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Handle search filter
  const filteredProducts = productList?.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  // Add / Edit form submission
  function onSubmit(e) {
    e.preventDefault();
    const payload = { ...formData, image: uploadedImageUrl || formData.image };

    const action = currentEditedId
      ? editProduct({ id: currentEditedId, formData: payload })
      : addNewProduct(payload);

    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        loadProducts();
        toast({ title: currentEditedId ? "Product updated" : "Product added" });
        resetForm();
      }
    });
  }

  const resetForm = () => {
    setFormData(initialFormData);
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setImageFile(null);
    setUploadedImageUrl("");
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id)).then((data) => {
      if (data?.payload?.success) {
        loadProducts();
        toast({ title: "Product deleted" });
      }
    });
  };

  return (
    <Fragment>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-48 focus:ring-2 focus:ring-blue-200"
          />
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            options={categoryOptions}
            placeholder="Filter by Category"
          />
          <Select
            value={brandFilter}
            onValueChange={setBrandFilter}
            options={brandOptions}
            placeholder="Filter by Brand"
          />
          <Select
            value={saleFilter}
            onValueChange={setSaleFilter}
            options={saleOptions}
            placeholder="Sale Status"
          />
        </div>
        <Button onClick={() => setOpenCreateProductsDialog(true)}>Add Product</Button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts?.length ? (
          filteredProducts.map((product) => (
            <AdminProductTile
              key={product._id}
              product={product}
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">
            No products found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="px-4 py-2 font-semibold">
            Page {page} of {pagination.totalPages || 1}
          </span>
          <Button
            variant="outline"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add/Edit Drawer */}
      <Sheet open={openCreateProductsDialog} onOpenChange={resetForm}>
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
                  options: categoryOptions,
                },
                {
                  label: "Brand",
                  name: "brandId",
                  componentType: "select",
                  options: brandOptions,
                },
                { label: "Price", name: "price", componentType: "input" },
                { label: "Total Stock", name: "totalStock", componentType: "input" },
              ]}
            />

            <div className="flex items-center justify-between">
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
