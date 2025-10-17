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

function ProductImageUpload({ uploadedImageUrls = [], setUploadedImageUrls }) {
  const inputRef = useRef(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const MAX_IMAGES = 5;

  /**  Handle local file selection */
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const remainingSlots = MAX_IMAGES - uploadedImageUrls.length;
      const filesToUpload = selectedFiles.slice(0, remainingSlots);
      setImageFiles(filesToUpload);
    }
  };

  /**  Remove an uploaded image */
  const handleRemoveImage = (indexToRemove) => {
    setUploadedImageUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    if (mainImageIndex >= indexToRemove) {
      setMainImageIndex((prev) => Math.max(0, prev - 1));
    }
  };

  /**  Upload images to backend/Cloudinary */
  const uploadImages = useCallback(async () => {
    if (imageFiles.length === 0) return;

    setIsUploading(true);
    setUploadError("");
    const data = new FormData();

    imageFiles.forEach((file) => data.append("images", file));

    try {
      const response = await api.post("/api/admin/upload/upload-images", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.success) {
        setUploadedImageUrls((prev) =>
          [...prev, ...response.data.data].slice(0, MAX_IMAGES)
        );
      } else {
        throw new Error("Upload failed. Please try again.");
      }

      setImageFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploadError("Upload failed. Please check your connection or try again.");
    } finally {
      setIsUploading(false);
    }
  }, [imageFiles, setUploadedImageUrls]);

  /**  Auto-trigger upload when new files are selected */
  useEffect(() => {
    if (imageFiles.length > 0) uploadImages();
  }, [imageFiles, uploadImages]);

  /**  Prevent invalid main index */
  useEffect(() => {
    if (uploadedImageUrls.length > 0 && mainImageIndex >= uploadedImageUrls.length) {
      setMainImageIndex(0);
    }
  }, [uploadedImageUrls, mainImageIndex]);

  const canUploadMore = uploadedImageUrls.length < MAX_IMAGES;

  return (
    <div className="w-full mt-4">
      <Label className="text-lg font-semibold mb-2 block">Product Images</Label>

      {/*  Main Image Preview */}
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
                  (prev) => (prev + 1) % uploadedImageUrls.length
                )
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/*  Thumbnail Grid */}
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

        {isUploading && (
          <div className="flex items-center justify-center aspect-square border rounded-md">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}
      </div>

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

      {/*  Error Feedback */}
      {uploadError && (
        <p className="text-red-600 text-sm mt-2 text-center">{uploadError}</p>
      )}
    </div>
  );
}

ProductImageUpload.propTypes = {
  uploadedImageUrls: PropTypes.array,
  setUploadedImageUrls: PropTypes.func.isRequired,
};

export default ProductImageUpload;
