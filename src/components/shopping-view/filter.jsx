import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import PropTypes from "prop-types";
import api from "@/api";

function ProductFilter({ filters, handleFilter, clearFilters }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function fetchFilters() {
      try {
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
    <div className="bg-background rounded-lg shadow-sm border">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">Filters</h2>
        <Button size="sm" variant="ghost" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-2">Categories</h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <Label key={cat._id} className="flex items-center gap-2">
                <Checkbox
                  checked={filters?.category?.includes(cat._id)}
                  onCheckedChange={() => handleFilter("category", cat._id)}
                />
                {cat.name}
              </Label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Brands */}
        <div>
          <h3 className="font-semibold mb-2">Brands</h3>
          <div className="space-y-1">
            {brands.map((brand) => (
              <Label key={brand._id} className="flex items-center gap-2">
                <Checkbox
                  checked={filters?.brand?.includes(brand._id)}
                  onCheckedChange={() => handleFilter("brand", brand._id)}
                />
                {brand.name}
              </Label>
            ))}
          </div>
        </div>

        <Separator />

        {/* On Sale */}
        <div className="flex items-center justify-between">
          <Label className="font-semibold">On Sale Only</Label>
          <Switch
            checked={filters?.isOnSale === true}
            onCheckedChange={(checked) =>
              handleFilter("isOnSale", checked ? true : false)
            }
          />
        </div>
      </div>
    </div>
  );
}

ProductFilter.propTypes = {
  filters: PropTypes.object,
  handleFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
};

export default ProductFilter;
