const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.nikhilmamdekar.site";

export const getImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return "https://picsum.photos/seed/default/300/400.jpg";
  }

  if (imageUrl.includes("res.cloudinary.com")) {
    // ✅ Proxy Cloudinary requests through backend
    const encodedUrl = encodeURIComponent(imageUrl);
    return `${API_BASE_URL}/api/image-proxy?url=${encodedUrl}`;
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return "https://picsum.photos/seed/default/300/400.jpg";
};
