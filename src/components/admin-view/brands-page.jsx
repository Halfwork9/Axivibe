import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrand, deleteBrand, fetchAllBrands } from "@/store/admin/brand-slice";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as LucideIcons from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function AdminBrandsPage() {
  const dispatch = useDispatch();
  const { brandList } = useSelector((state) => state.adminBrands);
  const { toast } = useToast();

  const [brandName, setBrandName] = useState("");
  const [brandIcon, setBrandIcon] = useState("");
  const [brandLogo, setBrandLogo] = useState(null); // ✅ ADD THIS

  useEffect(() => {
    dispatch(fetchAllBrands());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!brandName) {
      toast({ title: "Brand name is required", variant: "destructive" });
      return;
    }

    const formData = new FormData(); // ✅ Create FormData for file upload
    formData.append("name", brandName);
    formData.append("icon", brandIcon);
    if (brandLogo) formData.append("logo", brandLogo);

    dispatch(createBrand(formData)).then((res) => {
      if (res?.payload?.success) {
        toast({ title: "Brand created successfully!" });
        setBrandName("");
        setBrandIcon("");
        setBrandLogo(null);
      }
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteBrand(id))
      .unwrap()
      .then(() => {
        toast({ title: "Brand Deleted Successfully!" });
      })
      .catch((error) => {
        toast({
          title: "Deletion Failed",
          description: error.message || "An error occurred.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Brands</h2>

      {/* Create Brand Form */}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
        <div>
          <Label htmlFor="brandName">Brand Name</Label>
          <Input
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Enter brand name"
          />
        </div>

        <div>
          <Label htmlFor="brandIcon">Icon (optional)</Label>
          <select
            id="brandIcon"
            value={brandIcon}
            onChange={(e) => setBrandIcon(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">None</option>
            {Object.keys(LucideIcons).map((iconName) => (
              <option key={iconName} value={iconName}>
                {iconName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="brandLogo">Logo Image</Label>
          <Input
            id="brandLogo"
            type="file"
            accept="image/*"
            onChange={(e) => setBrandLogo(e.target.files[0])} // ✅ FIXED
          />
        </div>

        <Button type="submit" className="self-end">
          Create Brand
        </Button>
      </form>

      {/* Brand List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {brandList.map((brand) => {
          const IconComp = LucideIcons[brand.icon];
          return (
            <Card key={brand._id}>
              <CardContent className="flex flex-col items-center p-4">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-16 h-16 object-contain mb-2 border rounded bg-white"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : IconComp ? (
                  <IconComp className="w-10 h-10 text-primary mb-2" />
                ) : (
                  <span className="w-10 h-10 flex items-center justify-center border rounded-full mb-2">
                    {brand.name[0]}
                  </span>
                )}
                <span className="font-bold">{brand.name}</span>
              </CardContent>
              <CardFooter className="p-2 flex gap-2">
                <Button variant="outline" className="w-1/2">
                  <LucideIcons.Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  className="w-1/2"
                  onClick={() => handleDelete(brand._id)}
                >
                  <LucideIcons.Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default AdminBrandsPage;
