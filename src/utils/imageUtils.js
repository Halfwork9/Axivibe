// src/utils/imageUtils.js
export const getImageUrl = (imageInput) => {
  if (!imageInput) {
    return "https://picsum.photos/seed/default/400/400.jpg";
  }

  // If it's an array, pick the first non-empty string
  if (Array.isArray(imageInput)) {
    const validImage = imageInput.find((img) => typeof img === "string" && img.trim() !== "");
    if (validImage) return getImageUrl(validImage);
    return "https://picsum.photos/seed/default/400/400.jpg";
  }

  // If single string URL
  const imageUrl = imageInput.trim();

  if (imageUrl.startsWith("http")) {
    // Handle Cloudinary URLs with a parameter to prevent cache issues
    if (imageUrl.includes("res.cloudinary.com")) {
      const separator = imageUrl.includes("?") ? "&" : "?";
      return `${imageUrl}${separator}auto=format`;
    }
    return imageUrl;
  }

  return "https://picsum.photos/seed/default/400/400.jpg";
};
