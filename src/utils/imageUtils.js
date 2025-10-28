// src/utils/imageUtils.js
export const getImageUrl = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return '';
  return `https://api.nikhilmamdekar.site/api/proxy/image?url=${encodeURIComponent(cloudinaryUrl)}`;
};
