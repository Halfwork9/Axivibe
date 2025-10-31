import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchShopProducts } from "@/store/shop/products-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      queryParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
    } else if (value) {
      queryParams.push(`${key}=${encodeURIComponent(value)}`);
    }
  }
  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, pagination } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  // Apply filters from sessionStorage on load
  useEffect(() => {
    const savedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
    setFilters(savedFilters);
  }, []);

  // Persist filters to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(sectionId, option) {
    let updated = { ...filters };
    if (sectionId === "isOnSale") {
      updated[sectionId] = option ? true : false;
    } else {
      if (!updated[sectionId]) updated[sectionId] = [];
      const idx = updated[sectionId].indexOf(option);
      if (idx === -1) updated[sectionId].push(option);
      else updated[sectionId].splice(idx, 1);
    }
    setFilters({ ...updated });
    setPage(1);
  }

  function clearFilters() {
    setFilters({});
    sessionStorage.removeItem("filters");
    setPage(1);
  }

  function handleGetProductDetails(id) {
    // Navigate to the product details page instead of opening a dialog
    navigate(`/shop/product/${id}`);
  }

  function handleAddtoCart(productId, totalStock) {
    const existingItem = cartItems.items?.find((i) => i.productId === productId);
    if (existingItem && existingItem.quantity >= totalStock) {
      toast({
        title: `Only ${totalStock} available in stock.`,
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Added to cart" });
      }
    });
  }

  useEffect(() => {
    const queryString = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(queryString));
    dispatch(fetchShopProducts({ filterParams: filters, sortParams: sort, page, limit: 20 }));
  }, [dispatch, sort, filters, page, setSearchParams]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 p-4 md:p-6">
      {/* Sidebar Filters */}
      <ProductFilter filters={filters} handleFilter={handleFilter} clearFilters={clearFilters} />

      {/* Products List */}
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {pagination?.totalProducts || productList?.length || 0} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.id} value={option.id}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0 ? (
            productList.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No products found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex justify-center items-center gap-3 mt-8 mb-4">
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
      </div>
    </div>
  );
}

export default ShoppingListing;
