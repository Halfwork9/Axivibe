// src/utils/imageUtils.js
export const getImageUrl = (imageUrl) => {
  // Handle null, undefined, or non-string values
  if (!imageUrl || typeof imageUrl !== 'string') {
    return '/placeholder-image.jpg';
  }
  
  // For Cloudinary URLs, add CORS parameters
  if (imageUrl.includes('res.cloudinary.com')) {
    // Add CORS parameters to Cloudinary URL
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}_c=coar`;
  }
  
  // Return as is for other images
  return imageUrl;
};
