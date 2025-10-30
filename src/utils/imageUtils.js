export const getImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string" || imageUrl.trim() === "") {
    return "https://picsum.photos/seed/default/400/400.jpg";
  }

  // Fix missing Cloudinary prefix
  if (imageUrl.startsWith("//res.cloudinary.com")) {
    return `https:${imageUrl}`;
  }

  // Valid Cloudinary or absolute URL
  if (imageUrl.includes("res.cloudinary.com") || imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // Fallback (if only filename given)
  return `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/${imageUrl}`;
};
