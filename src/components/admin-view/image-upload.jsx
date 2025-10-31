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

  const MAX_IMAGES = 5;
  const MAX_RETRIES = 3;

  // Function to handle upload with retry logic
  const uploadWithRetry = async (files, retryAttempt = 0) => {
    const data = new FormData();
    
    files.forEach((file, index) => {
      data.append("images", file);
      if (retryAttempt > 0) {
        data.append("retryAttempt", retryAttempt);
      }
    });

    try {
      const response = await api.post("/admin/upload/upload-images", data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000, // Increased timeout
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded / total) * 100);
          setUploadProgress(prev => ({
            ...prev,
            [`file-${index}`]: percentCompleted
          }));
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
  const uploadImages = useCallback(async () => {
    if (imageFiles.length === 0) return;

    setIsUploading(true);
    setUploadError("");
    setRetryCount(0);

    try {
      const results = await uploadWithRetry(imageFiles, retryCount);
      const imageUrls = results.data || [];
      
      setUploadedImageUrls((prev) =>
        [...prev, ...imageUrls.slice(0, MAX_IMAGES)]
      );
      
      setImageFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      setRetryCount(0);
    } catch (error) {
      console.error("Upload failed:", error);
      
      // Retry logic
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => uploadImages(), 1000 * retryCount); // Exponential backoff
      } else {
        setUploadError(
          error.message || "Upload failed. Please check your connection or try again."
        );
      }
    } finally {
      setIsUploading(false);
    }
  }, [imageFiles, retryCount]);

  // Auto-trigger upload when new files are selected
  useEffect(() => {
    if (imageFiles.length > 0) {
      uploadImages();
    }
  }, [imageFiles]);

  // Prevent invalid main index
  useEffect(() => {
    if (uploadedImageUrls.length > 0 && mainImageIndex >= uploadedImageUrls.length) {
      setMainImageIndex(0);
    }
  }, [uploadedImageUrls, mainImageIndex]);

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
              onClick={() =>
                setMainImageIndex(
                  (prev) => (prev + 1) % uploadedImageUrls.length)
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
        
        {/* Upload Progress Indicators */}
        {isUploading && Object.keys(uploadProgress).length > 0 && (
          <div className="mt-2 space-y-2">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Uploading...</span>
                  <span className="text-xs text-gray-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Error Message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          <p className="font-medium">{uploadError}</p>
          {retryCount > 0 && (
            <Button 
              onClick={() => uploadImages()} 
              variant="outline" 
              size="sm"
              className="mt-2"
            >
              Retry ({MAX_RETRIES - retryCount} attempts left)
            </Button>
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
