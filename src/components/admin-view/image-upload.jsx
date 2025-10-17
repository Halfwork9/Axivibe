import { UploadCloudIcon, XIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropTypes from "prop-types";
import api from "@/api";

function ProductImageUpload({ uploadedImageUrls = [], setUploadedImageUrls }) {
  const inputRef = useRef(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Handles file selection from the input.
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length) {
      const remainingSlots = 5 - uploadedImageUrls.length;
      setImageFiles(selectedFiles.slice(0, remainingSlots));
    }
  };

  // Removes an image from both previews and the state.
  const handleRemoveImage = (indexToRemove) => {
    setUploadedImageUrls((prev) => prev.filter((_, index) => index !== indexToRemove));
    if (mainImageIndex >= indexToRemove) {
      setMainImageIndex(prev => Math.max(0, prev - 1));
    }
  };

  // The core upload function.
  const uploadImages = useCallback(async () => {
    if (imageFiles.length === 0) return;

    setIsUploading(true);
    const data = new FormData();
    imageFiles.forEach(file => {
      data.append("images", file);
    });

    try {
      const response = await api.post("/api/admin/upload/upload-images", data);
      if (response?.data?.success) {
        setUploadedImageUrls((prev) => [...prev, ...response.data.data].slice(0, 5));
        setImageFiles([]);
        if (inputRef.current) inputRef.current.value = "";
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  }, [imageFiles, setUploadedImageUrls]);

  // Automatically triggers upload when new files are selected.
  useEffect(() => {
    if (imageFiles.length > 0) {
      uploadImages();
    }
  }, [imageFiles, uploadImages]);

  useEffect(() => {
    if(uploadedImageUrls.length > 0 && mainImageIndex >= uploadedImageUrls.length) {
        setMainImageIndex(0);
    }
  }, [uploadedImageUrls, mainImageIndex])

  const canUploadMore = uploadedImageUrls.length < 5;

  return (
    <div className="w-full mt-4">
      <Label className="text-lg font-semibold mb-2 block">Product Images</Label>
      
      {/* ✅ NEW: Image Carousel Preview */}
      <div className="relative mb-4">
        <div className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center">
            {uploadedImageUrls.length > 0 ? (
                <img src={uploadedImageUrls[mainImageIndex]} alt="Main product" className="w-full h-full object-cover rounded-lg"/>
            ) : (
                <span className="text-gray-500">No images uploaded</span>
            )}
        </div>
        {uploadedImageUrls.length > 1 && (
            <>
                <Button type="button" size="icon" variant="outline" className="absolute left-2 top-1/2 -translate-y-1/2" onClick={() => setMainImageIndex(prev => (prev - 1 + uploadedImageUrls.length) % uploadedImageUrls.length)}>
                    <ChevronLeft className="h-4 w-4"/>
                </Button>
                <Button type="button" size="icon" variant="outline" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setMainImageIndex(prev => (prev + 1) % uploadedImageUrls.length)}>
                    <ChevronRight className="h-4 w-4"/>
                </Button>
            </>
        )}
      </div>

      {/* Grid to display image thumbnails */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {uploadedImageUrls.map((url, index) => (
          <div key={index} className={`relative aspect-square border-2 ${mainImageIndex === index ? 'border-primary' : 'border-transparent'} rounded-md`}>
            <img src={url} alt={`thumbnail-${index}`} className="w-full h-full object-cover rounded-md cursor-pointer" onClick={() => setMainImageIndex(index)}/>
            <Button
              type="button"
              variant="destructive" size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => handleRemoveImage(index)}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {isUploading && <Skeleton className="w-full h-full aspect-square" />}
      </div>

      {/* File Upload Area */}
      {canUploadMore && (
        <div className="border-2 border-dashed rounded-lg p-4">
          <Input
            id="image-upload" type="file" multiple accept="image/*"
            className="hidden" ref={inputRef} onChange={handleFileChange}
            disabled={isUploading}
          />
          <Label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center h-24 ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <UploadCloudIcon className="w-8 h-8 text-muted-foreground mb-2" />
            <span>Click or Drag to Upload</span>
            <span className="text-xs text-muted-foreground">({5 - uploadedImageUrls.length} remaining)</span>
          </Label>
        </div>
      )}
    </div>
  );
}

ProductImageUpload.propTypes = {
  uploadedImageUrls: PropTypes.array,
  setUploadedImageUrls: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
};

export default ProductImageUpload;

