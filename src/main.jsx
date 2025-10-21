import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";
import { Provider } from "react-redux";
import store from "@/store";  // See fix #2 below
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster.jsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <App />
            <Toaster />
          </GoogleOAuthProvider>
        ) : (
          <>
            <App />
            <Toaster />
            {/* Optional: Show warning in dev */}
            {import.meta.env.DEV && (
              <div className="fixed top-4 right-4 bg-yellow-200 p-2 text-xs rounded">
                Google OAuth disabled - using email/password only
              </div>
            )}
          </>
        )}
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
