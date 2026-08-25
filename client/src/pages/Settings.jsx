import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/Toast";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import {
  Settings as SettingsIcon,
  User,
  Target,
  Lock,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Save,
  Key
} from "lucide-react";

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
      const { data } = await axios.put(`${API_URL}/auth/profile`, { name }, authHeaders());
      updateUser({ ...user, name: data.name });
      showToast("Profile name updated! ✅", "success");
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
      const { data } = await axios.put(`${API_URL}/auth/budget`, { monthlyBudget: Number(budget) }, authHeaders());
      updateUser({ ...user, monthlyBudget: data.monthlyBudget });
      showToast("Monthly budget updated! 🎯", "success");
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
      await axios.put(`${API_URL}/auth/profile`, { currentPassword, newPassword }, authHeaders());
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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 selection:bg-violet-500 selection:text-white flex flex-col items-center">
      <div className="w-full max-w-[1500px] mx-auto flex flex-col gap-5 sm:gap-6">
        
        {/* Page Header Bar (UNWRAPPED) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-violet-500/10 text-violet-400 text-xs font-semibold mb-2">
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Account Preferences</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100">
              Account <span className="text-violet-400">Settings</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your personal profile, monthly budget caps, and security credentials.
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Column 1: Profile & Budget (6 Columns) */}
          <div className="lg:col-span-6 flex flex-col gap-5 sm:gap-6">
            
            {/* Section 1: Profile Details */}
            <div className="bg-slate-900 rounded-lg p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-violet-400" />
                  <span>Profile Information</span>
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  VERIFIED
                </span>
              </div>

              {/* Avatar + Info Banner */}
              <div className="p-4 rounded-md bg-slate-950 flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-violet-600 flex items-center justify-center text-base font-extrabold text-white shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-100 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-slate-500 font-normal lowercase">(Read-only)</span>
                  </label>
                  <input
                    className="input-field cursor-not-allowed opacity-60"
                    value={user?.email || ""}
                    disabled
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="px-5 py-2.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 self-start mt-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loadingProfile ? "Saving..." : "Save Profile Changes"}</span>
                </button>
              </form>
            </div>

            {/* Section 2: Monthly Budget Cap */}
            <div className="bg-slate-900 rounded-lg p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Target className="w-4 h-4 text-violet-400" />
                  <span>Monthly Budget Cap</span>
                </h2>
              </div>

              <form onSubmit={handleBudgetUpdate} className="flex flex-col gap-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Set a monthly spending limit. Real-time budget cap alerts will be shown on your Dashboard.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Monthly Limit (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input-field font-extrabold text-violet-300 text-base"
                    placeholder="e.g. 30000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>

                {budget > 0 && (
                  <div className="p-3.5 rounded-md bg-slate-950 text-xs flex items-center justify-between text-slate-300 font-mono">
                    <span className="text-slate-400">Daily Recommended Allowance:</span>
                    <strong className="text-emerald-400 font-bold text-sm">
                      ₹{Math.round(Number(budget) / 30).toLocaleString("en-IN")}/day
                    </strong>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingBudget}
                  className="px-5 py-2.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 self-start mt-1"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>{loadingBudget ? "Updating..." : "Update Budget Cap"}</span>
                </button>
              </form>
            </div>

          </div>

          {/* Column 2: Password Security & Danger Zone (6 Columns) */}
          <div className="lg:col-span-6 flex flex-col gap-5 sm:gap-6">
            
            {/* Section 3: Change Password */}
            <div className="bg-slate-900 rounded-lg p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-violet-400" />
                  <span>Password Security</span>
                </h2>
              </div>

              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Repeat new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="px-5 py-2.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 self-start mt-1"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{loadingPassword ? "Changing..." : "Change Password"}</span>
                </button>
              </form>
            </div>

            {/* Section 4: Account Actions / Danger Zone */}
            <div className="bg-slate-900 rounded-lg p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
                <h2 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Account Session</span>
                </h2>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Sign out from your active session on this browser. You can log back in at any time with your email and password.
              </p>

              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-md bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 self-start mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Account</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Settings;
