import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// ✅ Calculate discount percentage safely
export function getDiscountPercentage(price, salePrice) {
  if (!price || !salePrice || salePrice >= price) return null;
  const discount = ((price - salePrice) / price) * 100;
  return Math.round(discount);
}
