import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full font-sans">
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-4">
        <Outlet />
      </div>
      <div className="hidden lg:flex relative w-1/2 items-center justify-center bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop"
          alt="E-commerce items on display"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative z-10 max-w-md space-y-6 text-center text-white px-12">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Discover Your Next Favorite Thing
          </h1>
          <p className="text-lg text-gray-300">
            Join thousands of shoppers and find exclusive products from the best brands.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

