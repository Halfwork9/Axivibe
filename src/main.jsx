import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";
import { Provider } from "react-redux";
import store from "@/store/index.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster.jsx";

// This line reads your Google Client ID from your .env file
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <HelmetProvider>
          <App />
          <Toaster />
        </HelmetProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

