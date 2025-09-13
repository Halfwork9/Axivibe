import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import PropTypes from "prop-types";
import api from "@/api";   // ✅ use your centralized axios instance

function ProductFilter({ filters, handleFilter }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function fetchFilters() {
      try {
        // ✅ API calls now use baseURL from api.js (VITE_API_BASE_URL)
        const [catRes, brandRes] = await Promise.all([
          api.get("/admin/categories"),
          api.get("/admin/brands"),
        ]);

        if (catRes.data.success) setCategories(catRes.data.data);
        if (brandRes.data.success) setBrands(brandRes.data.data);
      } catch (err) {
        console.error("Error fetching filters", err);
      }
    }

    fetchFilters();
  }, []);

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* ✅ Dynamic Categories */}
        <div>
          <h3 className="text-base font-bold">Categories</h3>
          <div className="grid gap-2 mt-2">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Label
                  key={cat._id}
                  className="flex font-medium items-center gap-2"
                >
                  <Checkbox
                    checked={filters?.category?.includes(cat._id) || false}
                    onCheckedChange={() => handleFilter("category", cat._id)}
                  />
                  {cat.name}
                </Label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No categories found</p>
            )}
          </div>
        </div>
        <Separator />

        {/* ✅ Dynamic Brands */}
        <div>
          <h3 className="text-base font-bold">Brands</h3>
          <div className="grid gap-2 mt-2">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <Label
                  key={brand._id}
                  className="flex font-medium items-center gap-2"
                >
                  <Checkbox
                    checked={filters?.brand?.includes(brand._id) || false}
                    onCheckedChange={() => handleFilter("brand", brand._id)}
                  />
                  {brand.name}
                </Label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No brands found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ProductFilter.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.arrayOf(PropTypes.string),
    brand: PropTypes.arrayOf(PropTypes.string),
  }),
  handleFilter: PropTypes.func.isRequired,
};

export default ProductFilter;
