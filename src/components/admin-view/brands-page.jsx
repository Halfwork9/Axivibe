import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrand, deleteBrand, fetchAllBrands, editBrand } from "@/store/admin/brand-slice";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as LucideIcons from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";


function AdminBrandsPage() {
  const dispatch = useDispatch();
  const { brandList } = useSelector((state) => state.adminBrands);
  const { toast } = useToast();

  // State for creating a new brand
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandIcon, setNewBrandIcon] = useState("");
  const [newBrandLogo, setNewBrandLogo] = useState(null);

  // State for editing an existing brand
  const [editingBrand, setEditingBrand] = useState(null); // Holds the full brand object
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editLogo, setEditLogo] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);


  useEffect(() => {
    dispatch(fetchAllBrands());
  }, [dispatch]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newBrandName) {
      toast({ title: "Brand name is required", variant: "destructive" });
      return;
    }
    const formData = new FormData();
    formData.append("name", newBrandName);
    formData.append("icon", newBrandIcon);
    if (newBrandLogo) formData.append("logo", newBrandLogo);

    dispatch(createBrand(formData)).then((res) => {
      if (res?.payload?.success) {
        toast({ title: "Brand created successfully!" });
        setNewBrandName("");
        setNewBrandIcon("");
        setNewBrandLogo(null);
        // Clear the file input
        document.getElementById("brandLogo").value = "";
      }
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteBrand(id)).then(() => {
        toast({ title: "Brand Deleted Successfully!" });
    });
  };
  
  const openEditDialog = (brand) => {
    setEditingBrand(brand);
    setEditName(brand.name);
    setEditIcon(brand.icon || "");
    setEditLogo(null);
    setIsEditDialogOpen(true);
  }

  const handleEditSubmit = async () => {
  if (!editName) {
    toast({ title: "Brand name is required", variant: "destructive" });
    return;
  }

  const formData = new FormData();
  formData.append("name", editName);
  formData.append("icon", editIcon);
  if (editLogo) formData.append("logo", editLogo);

  const res = await dispatch(editBrand({ id: editingBrand._id, formData }));

  if (res?.payload?.success) {
    toast({ title: "Brand updated successfully!" });
    setIsEditDialogOpen(false);
    dispatch(fetchAllBrands()); // ✅ reload the updated list
  } else {
    toast({
      title: "Failed to update brand",
      description: res?.payload?.message || "Something went wrong",
      variant: "destructive",
    });
  }
};


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Brands</h2>

      {/* Create Brand Form */}
      <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-8 p-4 border rounded-lg">
        <div className="md:col-span-1">
          <Label htmlFor="brandName">Brand Name</Label>
          <Input id="brandName" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} placeholder="Enter brand name" />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="brandIcon">Icon (optional)</Label>
          <select id="brandIcon" value={newBrandIcon} onChange={(e) => setNewBrandIcon(e.target.value)} className="w-full h-10 border rounded px-2 py-1">
            <option value="">None</option>
            {Object.keys(LucideIcons).filter(key => /^[A-Z]/.test(key) && key.endsWith("Icon")).map((iconName) => (
              <option key={iconName} value={iconName}>{iconName}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="brandLogo">Logo Image</Label>
          <Input id="brandLogo" type="file" accept="image/*" onChange={(e) => setNewBrandLogo(e.target.files[0])} />
        </div>
        <Button type="submit" className="md:col-span-1">Create Brand</Button>
      </form>

      {/* Brand List */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brandList && brandList.map((brand) => {
          const IconComp = LucideIcons[brand.icon];
          return (
            <Card key={brand._id}>
              <CardContent className="flex flex-col items-center p-4">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="w-16 h-16 object-contain mb-2 border rounded bg-white" />
                ) : IconComp ? (
                  <IconComp className="w-10 h-10 text-primary mb-2" />
                ) : (
                  <span className="w-10 h-10 flex items-center justify-center border rounded-full mb-2">{brand.name[0]}</span>
                )}
                <span className="font-bold text-center">{brand.name}</span>
              </CardContent>
              <CardFooter className="p-2 flex gap-2">
                <Button variant="outline" className="w-1/2" onClick={() => openEditDialog(brand)}>
                  <LucideIcons.Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" className="w-1/2" onClick={() => handleDelete(brand._id)}>
                  <LucideIcons.Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Edit Brand Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              <div>
                  <Label htmlFor="editBrandName">Brand Name</Label>
                  <Input id="editBrandName" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div>
                  <Label htmlFor="editBrandIcon">Icon</Label>
                  <select id="editBrandIcon" value={editIcon} onChange={(e) => setEditIcon(e.target.value)} className="w-full h-10 border rounded px-2 py-1">
                      <option value="">None</option>
                      {Object.keys(LucideIcons).filter(key => /^[A-Z]/.test(key) && key.endsWith("Icon")).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
              </div>
              <div>
                  <Label htmlFor="editBrandLogo">New Logo (optional)</Label>
                  <Input id="editBrandLogo" type="file" accept="image/*" onChange={(e) => setEditLogo(e.target.files[0])} />
              </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default AdminBrandsPage;





