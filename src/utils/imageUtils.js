// src/utils/imageUtils.js
export const getImageUrl = (imageUrl) => {
  // Handle null or invalid URLs
  if (!imageUrl || typeof imageUrl !== "string") {
    return "https://picsum.photos/seed/default/300/400.jpg";
  }

  // ✅ For Cloudinary URLs, add CORS parameters
  if (imageUrl.includes("res.cloudinary.com")) {
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}_c=coar`;
  }

  // ✅ For any other full URLs
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // ✅ Fallback to placeholder for relative paths
  return "https://picsum.photos/seed/default/300/400.jpg";
};
