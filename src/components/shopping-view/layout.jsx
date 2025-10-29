import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, Menu, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Badge } from "@/components/ui/badge";
import UserCartWrapper from "./cart-wrapper"; // Import the cart wrapper

function ShoppingLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  // Calculate total items in cart
  const totalItems = cartItems?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link to="/shop/home" className="flex items-center space-x-2">
            <img src="/AIXIVIBE.png" alt="Axivibe" className="h-8 w-8" />
            <span className="text-xl font-bold">Axivibe</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/shop/home" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/shop/listing" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
            <Link to="/shop/account" className="text-gray-700 hover:text-gray-900">
              Account
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Button
              variant="ghost"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <Link to="/shop/account" className="w-full">
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <UserCartWrapper
        cartItems={cartItems?.items || []}
        isOpen={isCartOpen}
        setOpenCartSheet={setIsCartOpen}
      />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Axivibe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ShoppingLayout;
