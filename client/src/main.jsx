import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <ExpenseProvider>
          <App />
        </ExpenseProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
