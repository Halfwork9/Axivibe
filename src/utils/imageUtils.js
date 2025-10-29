// src/utils/imageUtils.js
export const getImageUrl = (imageUrl) => {
  // Handle null or invalid URLs
  if (!imageUrl || typeof imageUrl !== "string") {
    return "https://picsum.photos/seed/default/300/400.jpg";
  }

  // ✅ Directly return Cloudinary URLs (no modification)
  if (imageUrl.includes("res.cloudinary.com")) {
    return imageUrl;
  }

  // ✅ For other full URLs
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // ✅ Fallback to placeholder for relative paths
  return "https://picsum.photos/seed/default/300/400.jpg";
};
