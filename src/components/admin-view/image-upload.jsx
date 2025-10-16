import { UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropTypes from "prop-types";
import api from "@/api";

function ProductImageUpload({ uploadedImageUrls = [], setUploadedImageUrls, isEditMode = false }) {
  const inputRef = useRef(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length) {
      const remainingSlots = 5 - (uploadedImageUrls?.length || 0);
      setImageFiles(selectedFiles.slice(0, remainingSlots));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImageUrls((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const uploadImages = useCallback(async () => {
    if (imageFiles.length === 0) return;
    
    setIsUploading(true);
    const data = new FormData();
    imageFiles.forEach(file => {
      data.append("images", file);
    });

    try {
      const response = await api.post("/admin/upload/upload-images", data);
      if (response?.data?.success) {
        setUploadedImageUrls((prev) => [...(prev || []), ...response.data.data].slice(0, 5));
        setImageFiles([]);
        if(inputRef.current) inputRef.current.value = "";
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  }, [imageFiles, setUploadedImageUrls]);

  useEffect(() => {
    if(imageFiles.length > 0) {
        uploadImages();
    }
  }, [imageFiles, uploadImages]);

  const canUploadMore = (uploadedImageUrls?.length || 0) < 5;

  return (
    <div className="w-full mt-4">
      <Label className="text-lg font-semibold mb-2 block">Product Images</Label>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4 min-h-[6rem]">
        {uploadedImageUrls?.map((url, index) => (
          <div key={index} className="relative aspect-square">
            <img src={url} alt={`upload-preview-${index}`} className="w-full h-full object-cover rounded-md" />
            <Button
              variant="destructive" size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={() => handleRemoveImage(index)}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {isUploading && <Skeleton className="w-full h-full aspect-square" />}
      </div>

      {canUploadMore && (
        <div className="border-2 border-dashed rounded-lg p-4">
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
            className={`flex flex-col items-center justify-center h-24 ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <UploadCloudIcon className="w-8 h-8 text-muted-foreground mb-2" />
            <span>Click or Drag & Drop to Upload</span>
            <span className="text-xs text-muted-foreground">({5 - (uploadedImageUrls?.length || 0)} remaining)</span>
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

