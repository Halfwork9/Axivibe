import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import PropTypes from "prop-types";
import api from "@/api";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";

// ------------------------------
// Accordion Section Component
// ------------------------------
function AccordionSection({ title, children, isOpen, onToggle }) {
  return (
    <div className="border rounded-md">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-4 py-3 font-medium bg-muted/50"
      >
        {title}
        <span className="text-xl">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

// ------------------------------
// MAIN FILTER COMPONENT
// ------------------------------
function ProductFilter({ filters, handleFilter, clearFilters }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(true);

  // Accordion states
  const [openSection, setOpenSection] = useState("categories");

  // Price Range
  const [priceRange, setPriceRange] = useState(filters?.priceRange || [0, 100000]);

  // Rating Filter
  const ratingOptions = [
    { label: "4 ★ & above", value: 4 },
    { label: "3 ★ & above", value: 3 },
    { label: "2 ★ & above", value: 2 },
    { label: "1 ★ & above", value: 1 },
  ];

  const toggleSection = (name) =>
    setOpenSection((prev) => (prev === name ? "" : name));

  // ------------------------------
  // Fetch Categories & Brands
  // ------------------------------
  useEffect(() => {
    async function fetchFilters() {
      try {
        setLoading(true);

        const [catRes, brandRes] = await Promise.all([
          api.get("/admin/categories"),
          api.get("/admin/brands"),
        ]);

        if (catRes.data.success) setCategories(catRes.data.data);
        if (brandRes.data.success) setBrands(brandRes.data.data);
      } catch (err) {
        console.error("Error fetching filters", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilters();
  }, []);

  // ------------------------------
  // Handle price range update
  // ------------------------------
  const applyPriceFilter = () => {
    handleFilter("priceRange", priceRange);
  };

  // ------------------------------
  // JSX
  // ------------------------------
  return (
    <div className="bg-background rounded-lg shadow-sm border max-h-[90vh] overflow-y-auto">
      {/* Filter Header */}
      <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-background z-10">
        <h2 className="text-lg font-bold">Filters</h2>
        <Button size="sm" variant="ghost" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      {/* Accordion Filter Sections */}
      <div className="p-4 space-y-4">

        {/* Categories */}
        <AccordionSection
          title="Categories"
          isOpen={openSection === "categories"}
          onToggle={() => toggleSection("categories")}
        >
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : (
            categories.map((cat) => (
              <Label
                key={cat._id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={filters?.category?.includes(cat._id)}
                  onCheckedChange={() => handleFilter("category", cat._id)}
                />
                {cat.name}
              </Label>
            ))
          )}
        </AccordionSection>

        {/* Brands */}
        <AccordionSection
          title="Brands"
          isOpen={openSection === "brands"}
          onToggle={() => toggleSection("brands")}
        >
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : (
            brands.map((brand) => (
              <Label
                key={brand._id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={filters?.brand?.includes(brand._id)}
                  onCheckedChange={() => handleFilter("brand", brand._id)}
                />
                {brand.name}
              </Label>
            ))
          )}
        </AccordionSection>

        {/* Price Range */}
        <AccordionSection
          title="Price Range (₹)"
          isOpen={openSection === "price"}
          onToggle={() => toggleSection("price")}
        >
          <Label className="font-medium">
            ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
          </Label>

          <Slider
            defaultValue={priceRange}
            max={100000}
            step={100}
            min={0}
            onValueChange={(value) => setPriceRange(value)}
          />

          <Button className="mt-2 w-full" onClick={applyPriceFilter}>
            Apply
          </Button>
        </AccordionSection>

        {/* Rating Filter */}
        <AccordionSection
          title="Customer Ratings"
          isOpen={openSection === "ratings"}
          onToggle={() => toggleSection("ratings")}
        >
          {ratingOptions.map((r) => (
            <Label
              key={r.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={filters?.rating === r.value}
                onCheckedChange={() =>
                  handleFilter("rating", filters.rating === r.value ? null : r.value)
                }
              />
              <span className="flex items-center gap-1">
                {r.label}
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              </span>
            </Label>
          ))}
        </AccordionSection>

        {/* On Sale */}
        <AccordionSection
          title="Offers"
          isOpen={openSection === "sale"}
          onToggle={() => toggleSection("sale")}
        >
          <div className="flex items-center justify-between">
            <Label>On Sale Only</Label>
            <Switch
              checked={filters?.isOnSale === true}
              onCheckedChange={(checked) =>
                handleFilter("isOnSale", checked ? true : false)
              }
            />
          </div>
        </AccordionSection>
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
