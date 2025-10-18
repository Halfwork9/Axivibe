import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster.jsx";

//  Load Google Client ID safely from .env
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.error("❌ Missing Google Client ID. Please add VITE_GOOGLE_CLIENT_ID in your .env file.");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/*  Wrap the entire app with GoogleOAuthProvider so GoogleLogin works everywhere */}
    <GoogleOAuthProvider clientId={googleClientId}>
      {/* Redux store provider */}
      <Provider store={store}>
        {/* React Helmet for dynamic titles and meta tags */}
        <HelmetProvider>
          {/* Your main App (should include Router inside) */}
          <App />

          {/*  Keep toaster here so it renders at root level */}
          <Toaster />
        </HelmetProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
