// src/utils/imageUtils.js
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-image.jpg';
  
  // If it's already a proxied URL, return as is
  if (imageUrl.includes('/api/proxy/image')) {
    return imageUrl;
  }
  
  // If it's a Cloudinary URL, proxy it through your backend
  if (imageUrl.includes('res.cloudinary.com')) {
    return `https://api.nikhilmamdekar.site/api/proxy/image?url=${encodeURIComponent(imageUrl)}`;
  }
  
  // For other external images, also proxy them
  if (imageUrl.startsWith('http')) {
    return `https://api.nikhilmamdekar.site/api/proxy/image?url=${encodeURIComponent(imageUrl)}`;
  }
  
  // For relative paths, return as is
  return imageUrl;
};
