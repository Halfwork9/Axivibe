import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, deleteCategory, fetchAllCategories } from "@/store/admin/category-slice";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as LucideIcons from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function AdminCategoriesPage() {
  const dispatch = useDispatch();
  const { categoryList } = useSelector((state) => state.adminCategories);
  const { toast } = useToast();

  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName) {
      toast({ title: "Category name is required", variant: "destructive" });
      return;
    }
    dispatch(createCategory({ name: categoryName, icon: categoryIcon })).then((res) => {
      if (res?.payload?.success) {
        toast({ title: "Category created successfully!" });
        setCategoryName("");
        setCategoryIcon("");
      }
    });
  };

  const handleDelete = (id) => {
 dispatch(deleteCategory(id))
      .unwrap()
      .then(() => {
        // This code now only runs on success
        toast({ title: "Category Deleted Successfully!" });
      })
      .catch((error) => {
        // This code now only runs on failure
        toast({
            title: "Deletion Failed",
            description: error.message || "An error occurred.",
            variant: "destructive"
        });
      });
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      {/* Create Category Form */}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
        <div>
          <Label htmlFor="categoryName">Category Name</Label>
          <Input
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>
        <div>
          <Label htmlFor="categoryIcon">Category Icon (optional)</Label>
          <select
            id="categoryIcon"
            value={categoryIcon}
            onChange={(e) => setCategoryIcon(e.target.value)}
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
        <Button type="submit" className="self-end">
          Create Category
        </Button>
      </form>

      {/* List Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categoryList.map((category) => {
          const IconComp = LucideIcons[category.icon];
          return (
            <Card key={category._id}>
              <CardContent className="flex flex-col items-center p-4">
                {IconComp ? (
                  <IconComp className="w-10 h-10 text-primary mb-2" />
                ) : (
                  <span className="w-10 h-10 flex items-center justify-center border rounded-full mb-2">
                    {category.name[0]}
                  </span>
                )}
                <span className="font-bold">{category.name}</span>
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="destructive" className="w-full" onClick={() => handleDelete(category._id)}>
                    <LucideIcons.Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default AdminCategoriesPage;
