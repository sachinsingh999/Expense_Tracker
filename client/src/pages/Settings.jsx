import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/Toast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [budget, setBudget] = useState(user?.monthlyBudget || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingBudget, setLoadingBudget] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const authHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  // Update profile name
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoadingProfile(true);
    try {
      const { data } = await axios.put("http://localhost:4000/api/auth/profile", { name }, authHeaders());
      updateUser({ ...user, name: data.name });
      showToast("Profile updated! ✅", "success");
    } catch {
      showToast("Failed to update profile", "error");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Update budget
  const handleBudgetUpdate = async (e) => {
    e.preventDefault();
    setLoadingBudget(true);
    try {
      const { data } = await axios.put("http://localhost:4000/api/auth/budget", { monthlyBudget: Number(budget) }, authHeaders());
      updateUser({ ...user, monthlyBudget: data.monthlyBudget });
      showToast("Budget updated! 🎯", "success");
    } catch {
      showToast("Failed to update budget", "error");
    } finally {
      setLoadingBudget(false);
    }
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast("New passwords don't match", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    setLoadingPassword(true);
    try {
      await axios.put("http://localhost:4000/api/auth/profile", { currentPassword, newPassword }, authHeaders());
      showToast("Password changed successfully! 🔒", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to change password", "error");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const sections = [
    {
      title: "Profile",
      icon: "👤",
      content: (
        <form onSubmit={handleProfileUpdate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{
              width: 64, height: 64,
              background: "linear-gradient(135deg, var(--accent), #6366f1)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.3rem", fontWeight: 700, color: "white",
              boxShadow: "0 4px 16px var(--accent-glow)",
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{user?.name}</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{user?.email}</p>
            </div>
          </div>
          <div>
            <label className="form-label">Full Name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input className="input-field" value={user?.email || ""} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Email cannot be changed</p>
          </div>
          <button type="submit" className="btn-primary" disabled={loadingProfile} style={{ alignSelf: "flex-start", padding: "10px 24px" }}>
            {loadingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )
    },
    {
      title: "Monthly Budget",
      icon: "🎯",
      content: (
        <form onSubmit={handleBudgetUpdate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Set a monthly spending limit. You'll see a budget progress bar on your dashboard.
          </p>
          <div>
            <label className="form-label">Monthly Budget (₹)</label>
            <input
              type="number" min="0" className="input-field"
              placeholder="e.g. 30000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          {budget > 0 && (
            <div style={{
              background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: 10, padding: "12px 16px", fontSize: "0.875rem", color: "var(--accent-light)",
            }}>
              Daily budget: ₹{Math.round(Number(budget) / 30).toLocaleString("en-IN")}
            </div>
          )}
          <button type="submit" className="btn-primary" disabled={loadingBudget} style={{ alignSelf: "flex-start", padding: "10px 24px" }}>
            {loadingBudget ? "Saving..." : "Update Budget"}
          </button>
        </form>
      )
    },
    {
      title: "Change Password",
      icon: "🔒",
      content: (
        <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="form-label">Current Password</label>
            <input type="password" className="input-field" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div>
            <label className="form-label">New Password</label>
            <input type="password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" />
          </div>
          <div>
            <label className="form-label">Confirm New Password</label>
            <input
              type="password" className="input-field"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Repeat new password"
              style={{ borderColor: confirmNewPassword && confirmNewPassword !== newPassword ? "var(--red)" : undefined }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loadingPassword} style={{ alignSelf: "flex-start", padding: "10px 24px" }}>
            {loadingPassword ? "Changing..." : "Change Password"}
          </button>
        </form>
      )
    },
  ];

  return (
    <div className="page-wrapper" style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: 28, animation: "fadeInUp 0.4s ease" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Settings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Manage your account preferences</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map((section, i) => (
          <div
            key={i}
            className="glass-card"
            style={{ padding: 28, animation: `fadeInUp 0.4s ease ${i * 0.1}s both` }}
          >
            <h2 style={{
              fontWeight: 600, fontSize: "1rem", color: "var(--text-primary)",
              marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>{section.icon}</span> {section.title}
            </h2>
            {section.content}
          </div>
        ))}

        {/* Danger zone */}
        <div style={{
          background: "rgba(239,68,68,0.05)",
          border: "1px solid rgba(239,68,68,0.15)",
          borderRadius: 20, padding: 28,
          animation: "fadeInUp 0.4s ease 0.3s both",
        }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem", color: "var(--red)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            ⚠️ Danger Zone
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: 16 }}>
            Sign out from all devices. You'll need to log back in.
          </p>
          <button
            onClick={handleLogout}
            style={{
              background: "var(--red-light)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "var(--red)",
              borderRadius: 10,
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--red-light)"}
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
