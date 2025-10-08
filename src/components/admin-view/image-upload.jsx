import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropTypes from "prop-types";
import api from "@/api";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const uploadImageToCloudinary = useCallback(async () => {
    if (!imageFile) return;
    setImageLoadingState(true);

    try {
      const data = new FormData();
      // 🔥 Must match backend route key: "my_file"
      data.append("my_file", imageFile);

      const response = await api.post("/admin/upload/upload-image", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.secure_url);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setImageLoadingState(false);
    }
  }, [imageFile, setImageLoadingState, setUploadedImageUrl]);

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile, uploadImageToCloudinary]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div className="border-2 border-dashed rounded-lg p-4">
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {!imageFile && !uploadedImageUrl ? (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-48 w-full bg-gray-200" />
        ) : uploadedImageUrl ? (
          <div className="relative">
            <img
              src={uploadedImageUrl}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/70 hover:bg-white"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <FileIcon className="w-8 text-primary mr-2 h-8" />
            <p className="text-sm font-medium">{imageFile?.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

ProductImageUpload.propTypes = {
  imageFile: PropTypes.object,
  setImageFile: PropTypes.func.isRequired,
  imageLoadingState: PropTypes.bool.isRequired,
  uploadedImageUrl: PropTypes.string,
  setUploadedImageUrl: PropTypes.func.isRequired,
  setImageLoadingState: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  isCustomStyling: PropTypes.bool,
};

export default ProductImageUpload;
