import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";
import { Provider } from "react-redux";
import store from "@/store/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster.jsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.error(
    "❌ Missing VITE_GOOGLE_CLIENT_ID in environment. Add it to your .env and Vercel settings."
  );
}

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
            Missing Google Client ID
          </h2>
          <p>
            Please set <strong>VITE_GOOGLE_CLIENT_ID</strong> in your environment
            configuration and redeploy.
          </p>
        </div>
      </div>
    )}
  </React.StrictMode>
);
