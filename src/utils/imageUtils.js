const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.nikhilmamdekar.site";

export const getImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return "https://picsum.photos/seed/default/300/400.jpg";
  }

  // ✅ Proxy Cloudinary URLs through backend
  if (imageUrl.includes("res.cloudinary.com")) {
    const encoded = encodeURIComponent(imageUrl);
    return `${API_BASE_URL}/api/image-proxy?url=${encoded}`;
  }

  // ✅ Keep other absolute URLs unchanged
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // ✅ Default fallback
  return "https://picsum.photos/seed/default/300/400.jpg";
};
