// src/components/admin-view/image-upload.jsx
import {
  UploadCloudIcon,
  XIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useCallback, useState } from "react";
import PropTypes from "prop-types";
import api from "@/api";
import { useToast } from "@/components/ui/use-toast";

function ProductImageUpload({ uploadedImageUrls = [], setUploadedImageUrls }) {
  const inputRef = useRef(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadError, setUploadError] = useState("");
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const { toast } = useToast();

  const MAX_IMAGES = 5;
  const MAX_RETRIES = 3;

  // Function to handle upload with retry logic
  const uploadWithRetry = async (files, retryAttempt = 0) => {
    const data = new FormData();
    
    files.forEach((file) => {
      data.append("images", file);
    });

    try {
      const response = await api.post("/admin/upload/upload-images", data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000, // Increased timeout
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded / total) * 100);
          // We'll just show a single progress for the batch for simplicity
          setUploadProgress({ batch: percentCompleted });
        }
      });

      if (response?.data?.success) {
        return response.data;
      } else {
        throw new Error(response?.data?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Upload images with retry logic
  // FIX: Removed 'retryCount' from dependency array to prevent potential infinite loops.
  // The function uses the latest state value via the setter function form.
  const uploadImages = useCallback(async () => {
    if (imageFiles.length === 0) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const results = await uploadWithRetry(imageFiles, retryCount);
      const imageUrls = results.data || [];
      
      setUploadedImageUrls((prev) =>
        [...prev, ...imageUrls.slice(0, MAX_IMAGES - prev.length)]
      );
      
      setImageFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("Upload failed:", error);
      
      // Retry logic
      setRetryCount((currentCount) => {
        if (currentCount < MAX_RETRIES) {
          setTimeout(() => uploadImages(), 1000 * (currentCount + 1)); // Exponential backoff
          return currentCount + 1;
        } else {
          setUploadError(
            error.message || "Upload failed. Please check your connection or try again."
          );
          return 0; // Reset retry count after final failure
        }
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  }, [imageFiles, setUploadedImageUrls]); // Keep dependencies stable

  // Auto-trigger upload when new files are selected
  useEffect(() => {
    if (imageFiles.length > 0) {
      uploadImages();
    }
  }, [imageFiles, uploadImages]);

  // Prevent invalid main index
  useEffect(() => {
    if (uploadedImageUrls.length > 0 && mainImageIndex >= uploadedImageUrls.length) {
      setMainImageIndex(0);
    }
  }, [uploadedImageUrls, mainImageIndex]);

  // FIX: Added the missing handler for file input changes
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length + uploadedImageUrls.length > MAX_IMAGES) {
      toast({
        title: "Too many images",
        description: `You can only upload a maximum of ${MAX_IMAGES} images.`,
        variant: "destructive",
      });
      return;
    }
    setImageFiles(selectedFiles);
    setUploadError(""); // Clear previous errors
  };

  // FIX: Added the missing handler for removing an image
  const handleRemoveImage = (indexToRemove) => {
    setUploadedImageUrls((prevUrls) =>
      prevUrls.filter((_, index) => index !== indexToRemove)
    );
    // If the removed image was the main image or before it, adjust the index
    if (mainImageIndex >= indexToRemove && mainImageIndex > 0) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  const canUploadMore = uploadedImageUrls.length < MAX_IMAGES;

  return (
    <div className="w-full mt-4">
      <Label className="text-lg font-semibold mb-2 block">Product Images</Label>

      {/* Main Image Preview */}
      <div className="relative mb-4">
        <div className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          {uploadedImageUrls.length > 0 ? (
            <img
              src={uploadedImageUrls[mainImageIndex]}
              alt="Main product"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-500">No images uploaded</span>
          )}
        </div>

        {uploadedImageUrls.length > 1 && (
          <>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() =>
                setMainImageIndex(
                  (prev) =>
                    (prev - 1 + uploadedImageUrls.length) % uploadedImageUrls.length
                )
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              // FIX: Removed the extra closing parenthesis that was causing the build error
              onClick={() =>
                setMainImageIndex(
                  (prev) => (prev + 1) % uploadedImageUrls.length
                )
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {uploadedImageUrls.map((url, index) => (
          <div
            key={index}
            className={`relative aspect-square border-2 ${
              mainImageIndex === index ? "border-blue-500" : "border-gray-200"
            } rounded-md overflow-hidden`}
          >
            <img
              src={url}
              alt={`thumbnail-${index}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setMainImageIndex(index)}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow"
              onClick={() => handleRemoveImage(index)}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Upload Progress Indicator */}
      {isUploading && Object.keys(uploadProgress).length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Uploading images...</span>
            <span className="text-xs text-gray-600">{uploadProgress.batch || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress.batch || 0}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Upload Error Message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          <p className="font-medium">{uploadError}</p>
          {retryCount > 0 && retryCount <= MAX_RETRIES && (
            <p className="text-sm mt-1">Retrying... ({retryCount}/{MAX_RETRIES})</p>
          )}
        </div>
      )}

      {/* 🔸 Upload Area */}
      {canUploadMore && (
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <Input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center h-24 ${
              isUploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-2" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloudIcon className="w-8 h-8 text-muted-foreground mb-2" />
                <span>Click or drag to upload</span>
                <span className="text-xs text-muted-foreground">
                  ({MAX_IMAGES - uploadedImageUrls.length} remaining)
                </span>
              </>
            )}
          </Label>
        </div>
      )}
    </div>
  );
}

ProductImageUpload.propTypes = {
  uploadedImageUrls: PropTypes.array,
  setUploadedImageUrls: PropTypes.func.isRequired,
};

export default ProductImageUpload;
