// src/pages/shopping-view/listing.jsx
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
import { ArrowUpDownIcon, SlidersHorizontal, X } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchShopProducts } from "@/store/shop/products-slice";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

function createSearchParamsHelper(filters) {
  const params = {};

  if (filters.category?.length) params.category = filters.category.join(",");
  if (filters.brand?.length) params.brand = filters.brand.join(",");
  if (filters.isOnSale) params.isOnSale = "true";
  if (filters.priceRange) params.priceRange = filters.priceRange.join(",");
  if (filters.rating) params.rating = filters.rating;

  return params;
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { productList, pagination, isLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  // -------------------------------
  // Load saved filters on mount
  // -------------------------------
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem("filters")) || {};
    setFilters(saved);
  }, []);

  // Persist filters
  useEffect(() => {
    sessionStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

  const handleSort = (v) => {
    setSort(v);
  };

  const handleFilter = (sectionId, option) => {
    let updated = { ...filters };

    if (sectionId === "isOnSale") {
      updated[sectionId] = option || false;
    } else {
      if (!updated[sectionId]) updated[sectionId] = [];
      const idx = updated[sectionId].indexOf(option);
      if (idx === -1) updated[sectionId].push(option);
      else updated[sectionId].splice(idx, 1);
    }

    setFilters({ ...updated });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    sessionStorage.removeItem("filters");
    setPage(1);
  };

  const handleGetProductDetails = (id) => {
    navigate(`/shop/product/${id}`);
  };

  const handleAddtoCart = useCallback(
    (productId, totalStock) => {
      const exists = cartItems.items?.find((i) => i.productId === productId);

      if (exists && exists.quantity >= totalStock) {
        toast({
          title: `Only ${totalStock} available in stock.`,
          variant: "destructive",
        });
        return false;
      }

      return dispatch(
        addToCart({ userId: user?.id, productId, quantity: 1 })
      )
        .then((res) => {
          if (res?.payload?.success) {
            dispatch(fetchCartItems(user?.id));
            toast({ title: "Added to cart" });
            return true;
          }
          return false;
        })
        .catch(() => false);
    },
    [cartItems, dispatch, toast, user]
  );

  // -------------------------------
  // Fetch Products on filter/sort/page change
  // -------------------------------
  useEffect(() => {
    const query = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(query));

    dispatch(
      fetchShopProducts({
        filterParams: filters,
        sortParams: sort,
        page,
        limit: 20,
      })
    );
  }, [filters, sort, page, dispatch]);

  // -------------------------------
  // Render Page
  // -------------------------------
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">

      {/* MOBILE FILTER BUTTON */}
      <div className="md:hidden flex justify-end mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">

        {/* SIDEBAR (DESKTOP) */}
        <div className="hidden md:block">
          <ProductFilter
            filters={filters}
            handleFilter={handleFilter}
            clearFilters={clearFilters}
          />
        </div>

        {/* MOBILE DRAWER FILTER */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
            <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-lg p-4 overflow-y-auto transition-all">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ProductFilter
                filters={filters}
                handleFilter={handleFilter}
                clearFilters={clearFilters}
              />
            </div>
          </div>
        )}

        {/* MAIN PRODUCT SECTION */}
        <div className="w-full bg-background rounded-lg shadow-sm">

          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-extrabold">All Products</h2>

            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">
                {pagination?.totalProducts || productList?.length || 0} Products
              </span>

              {/* SORT */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ArrowUpDownIcon className="h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                    {sortOptions.map((item) => (
                      <DropdownMenuRadioItem key={item.id} value={item.id}>
                        {item.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productList?.length > 0 ? (
              productList.map((p) => (
                <ShoppingProductTile
                  key={p._id}
                  product={p}
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

          {/* PAGINATION */}
          {pagination && (
            <div className="flex justify-center items-center gap-3 mb-8">

              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Prev
              </Button>

              <span className="font-medium text-sm">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;
