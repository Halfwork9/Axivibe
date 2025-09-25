"use client";

import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

// ✅ safe icon resolver
function getLucideIcon(name: string, fallback: string = "Box") {
  if (!name || typeof name !== "string") return (LucideIcons as any)[fallback];

  const formatted =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  const aliasMap: Record<string, string> = {
    add: "Plus",
    shoppingcart: "ShoppingCart",
    cart: "ShoppingCart",
    box: "Box",
    // extend if needed
  };

  const finalName =
    aliasMap[name.toLowerCase()] || formatted;

  const IconComp = (LucideIcons as any)[finalName];

  if (!IconComp) {
    console.warn(`⚠️ Invalid icon "${name}", falling back to "${fallback}"`);
    return (LucideIcons as any)[fallback];
  }

  return IconComp;
}

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    // 🔹 Replace with your real API
    async function fetchData() {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands"),
        ]);

        const catData = await catRes.json();
        const brandData = await brandRes.json();

        setCategories(catData || []);
        setBrands(brandData || []);
      } catch (err) {
        console.error("❌ Failed to load categories/brands", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-10">
      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComp = getLucideIcon(cat.icon, "Box");
            return (
              <Link
                key={cat.id}
                href={`/shop/category/${cat.slug}`}
                className="flex flex-col items-center justify-center p-4 border rounded-lg shadow hover:shadow-lg transition"
              >
                <IconComp className="w-8 h-8 mb-2" />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Brands */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Brands</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {brands.map((brand) => {
            const IconComp = getLucideIcon(brand.icon, "Box");
            return (
              <Link
                key={brand.id}
                href={`/shop/brand/${brand.slug}`}
                className="flex flex-col items-center justify-center p-4 border rounded-lg shadow hover:shadow-lg transition"
              >
                <IconComp className="w-8 h-8 mb-2" />
                <span>{brand.name}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
