import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import "./i18n";
import "./index.css";

axios.interceptors.request.use(
  config => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    {/* To enable Strict mode, change the upper tag to <React.StrictMode>*/}
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </>
);
