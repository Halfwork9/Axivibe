// src/utils/imageUtils.js
export const getImageUrl = (imageUrl) => {
  // Handle null, undefined, or non-string values
  if (!imageUrl || typeof imageUrl !== 'string') {
    return "https://picsum.photos/seed/default/300/400.jpg";
  }
  
  // If it's already a proxied URL, return as is
  if (imageUrl.includes('/api/proxy/image')) {
    return imageUrl;
  }
  
  // If it's a Cloudinary URL, add CORS parameters
  if (imageUrl.includes('res.cloudinary.com')) {
    // Add CORS parameters to Cloudinary URL
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}_c=coar`;
  }
  
  // Return as is for other images
  return imageUrl;
};
