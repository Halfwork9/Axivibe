import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";
import { Provider } from "react-redux";
// ✅ FIX: Corrected the import path to match your file name
import store from "@/store/store.js"; 
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster.jsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <Provider store={store}>
          <HelmetProvider>
            <App />
            <Toaster />
          </HelmetProvider>
        </Provider>
      </GoogleOAuthProvider>
    ) : (
      <div className="flex items-center justify-center h-screen text-center text-red-600">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Configuration Error
          </h2>
          <p>
            Google Client ID is missing. Please set it in your environment variables.
          </p>
        </div>
      </div>
    )}
  </React.StrictMode>
);

