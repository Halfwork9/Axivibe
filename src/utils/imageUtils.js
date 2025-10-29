// src/utils/imageUtils.js
export const getImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return "https://picsum.photos/seed/default/300/400.jpg";
  }

  if (imageUrl.includes("res.cloudinary.com")) {
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}_c=coar`;
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return "https://picsum.photos/seed/default/300/400.jpg";
};
