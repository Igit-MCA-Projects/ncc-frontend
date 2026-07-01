import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{ style: { borderRadius: "12px", fontSize: "14px" } }}
          />
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
