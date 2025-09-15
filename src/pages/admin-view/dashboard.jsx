import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage, 
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return;

    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      {/* Image Upload Component */}
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />

      {/* Upload Button */}
      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={!uploadedImageUrl}
      >
        Upload
      </Button>

      {/* Temporary Preview (before saving to DB) */}
      {uploadedImageUrl && (
        <div className="mt-5">
          <h3 className="text-lg font-medium mb-2">Preview (Not Saved)</h3>
          <img
            src={uploadedImageUrl}
            alt="Preview"
            className="w-full h-auto max-h-[300px] object-cover rounded-lg"
          />
        </div>
      )}

      {/* DB Saved Images */}
      <div className="flex flex-col gap-4 mt-5">
  {Array.isArray(featureImageList) && featureImageList.length > 0 ? (
    featureImageList.map((featureImgItem, index) => (
      <div
        key={featureImgItem._id || index}
        className="relative border rounded-lg overflow-hidden"
      >
        <img
          src={featureImgItem.image}
          alt="Feature"
          className="w-full h-auto max-h-[300px] object-cover rounded-lg"
        />
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
        >
          Delete
        </Button>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No feature images found.</p>
  )}
</div>

    </div>
  );
}

export default AdminDashboard;
