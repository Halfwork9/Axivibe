import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";
import { Provider } from "react-redux";
import store from "@/store"; // Adjust to "@/store/index.js" if needed (per previous fix)
import { GoogleOAuthProvider } from "@react-oauth/google"; // Ensure this is present
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
      <Provider store={store}>
        <HelmetProvider>
          <App />
          <Toaster />
          {import.meta.env.DEV && (
            <div className="fixed top-4 right-4 bg-yellow-200 p-2 text-xs rounded">
              Google OAuth disabled - using email/password only
            </div>
          )}
        </HelmetProvider>
      </Provider>
    )}
  </React.StrictMode>
);
