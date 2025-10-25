import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";
import { Provider } from "react-redux";
import store from "@/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster.jsx";
import axios from "axios";

// ✅ Configure axios globally
axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://axivibe.onrender.com";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let rootContent;

if (googleClientId && typeof googleClientId === "string" && googleClientId.length > 0) {
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
  rootContent = (
    <Provider store={store}>
      <HelmetProvider>
        <App />
        <Toaster />
        <div className="fixed top-0 left-0 w-full bg-yellow-200 text-center py-2 text-sm">
          Google Login disabled - Missing Client ID. Using email/password only.
        </div>
      </HelmetProvider>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{rootContent}</React.StrictMode>
);
