import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";
import { Provider } from "react-redux";
import store from "@/store"; // Or "@/store/index.js"
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster.jsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Debug log to confirm value (remove after fixing)
console.log('Google Client ID:', googleClientId || 'MISSING');

let rootContent;

if (googleClientId && typeof googleClientId === 'string' && googleClientId.length > 0) {
  rootContent = (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <HelmetProvider>
          <App />
          <Toaster />
        </HelmetProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
} else {
  // Fallback without Google OAuth (use email/password login only)
  rootContent = (
    <Provider store={store}>
      <HelmetProvider>
        <App />
        <Toaster />
        {/* Optional warning banner */}
        <div className="fixed top-0 left-0 w-full bg-yellow-200 text-center py-2 text-sm">
          Google Login disabled - Missing Client ID. Using email/password only.
        </div>
      </HelmetProvider>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {rootContent}
  </React.StrictMode>
);
