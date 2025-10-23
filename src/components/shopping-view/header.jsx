// src/components/shopping-view/header.jsx
import { LogOut, Menu, ShoppingCart, UserCog, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.png";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllCategories } from "@/store/admin/category-slice";

function CategoryDropdown() {
  const dispatch = useDispatch();
  const { categoryList = [] } = useSelector((state) => state.adminCategories || {});
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  function handleNavigate(category) {
    sessionStorage.setItem("filters", JSON.stringify({ category: [category._id] }));
    navigate(`/shop/listing?category=${encodeURIComponent(category.name)}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-sm font-medium">
          Shop by Category
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Categories</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {categoryList.length > 0 ? (
          categoryList.map((cat) => (
            <DropdownMenuItem key={cat._id} onClick={() => handleNavigate(cat)}>
              {cat.name}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>Loading categories...</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth || {});
  const { cartItems = [] } = useSelector((state) => state.shopCart || {});
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      navigate('/auth/login'); // Redirect to login after logout
    }).catch((error) => console.error('Logout failed:', error));
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems.length}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItems} />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName || 'Guest'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user ? (
            <>
              <DropdownMenuItem onClick={() => navigate("/shop/account")}>
                <UserCog className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/shop/distributor")}>
                <Store className="mr-2 h-4 w-4" />
                Distributor
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={() => navigate("/auth/login")}>
              <LogOut className="mr-2 h-4 w-4" />
              Login
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-8 w-auto" />
          <span className="font-bold">Axivibe</span>
        </Link>

        <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs flex flex-col gap-4">
            <Link to="/shop/home" className="text-sm font-medium" onClick={() => setOpenSidebar(false)}>Home</Link>
            <Link to="/shop/listing" className="text-sm font-medium" onClick={() => setOpenSidebar(false)}>Products</Link>
            <Link to="/shop/search" className="text-sm font-medium" onClick={() => setOpenSidebar(false)}>Search</Link>
            <Link to="/shop/distributor" className="text-sm font-medium" onClick={() => setOpenSidebar(false)}>Distributor</Link>
            <CategoryDropdown />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        <div className="hidden lg:flex gap-6 items-center">
          <Link to="/shop/home" className="text-sm font-medium">Home</Link>
          <Link to="/shop/listing" className="text-sm font-medium">Products</Link>
          <Link to="/shop/search" className="text-sm font-medium">Search</Link>
          <Link to="/shop/distributor" className="text-sm font-medium">Distributor</Link>
          <CategoryDropdown />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
