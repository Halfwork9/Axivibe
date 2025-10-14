import {
  BadgeCheck,
  ChartNoAxesCombined,
  Images,
  LayoutDashboard,
  ShirtIcon,
  ShoppingBasket,
  Users,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

// ✅ Sidebar Items
const adminSidebarMenuItems = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard /> },
  { id: "products", label: "Products", path: "/admin/products", icon: <ShoppingBasket /> },
  { id: "orders", label: "Orders", path: "/admin/orders", icon: <BadgeCheck /> },
  { id: "brands", label: "Brands", path: "/admin/brands", icon: <Images /> },
  { id: "categories", label: "Categories", path: "/admin/categories", icon: <ShirtIcon /> },
  { id: "distributors", label: "Distributors", path: "/admin/distributor", icon: <Users /> },
];

// ✅ Subcomponent for menu list
function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname.startsWith(menuItem.path);

        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-lg cursor-pointer transition-all duration-300
              ${
                isActive
                  ? "bg-primary text-white font-semibold shadow-md scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            <div
              className={`transition-transform duration-300 ${
                isActive ? "scale-110 text-white drop-shadow-glow" : "text-muted-foreground"
              }`}
            >
              {menuItem.icon}
            </div>
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

MenuItems.propTypes = {
  setOpen: PropTypes.func,
};

// ✅ Main Sidebar Component
function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5 items-center">
                <ChartNoAxesCombined size={28} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2 mb-6"
        >
          <ChartNoAxesCombined size={28} className="text-primary" />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

AdminSideBar.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default AdminSideBar;
