import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "./components/Toast";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected pages
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import MyExpense from "./pages/MyExpense";
import Income from "./pages/Income";
import Analytics from "./pages/Analytics";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <>
      <Navbar />
      <ToastContainer />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add-expenses" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
        <Route path="/my-expenses" element={<ProtectedRoute><MyExpense /></ProtectedRoute>} />
        <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div style={{
            minHeight: "80vh", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            color: "var(--text-muted)", textAlign: "center",
          }}>
            <p style={{ fontSize: "4rem", marginBottom: 16 }}>🔍</p>
            <h1 style={{ fontSize: "1.5rem", color: "var(--text-primary)", marginBottom: 8 }}>Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
          </div>
        } />
      </Routes>
    </>
  );
};

export default App;
