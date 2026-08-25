import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  ReceiptText,
  TrendingUp,
  BarChart3,
  Target,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  User,
  Wallet,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  Zap
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = user
    ? [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/add-expenses", label: "Add Expense", icon: PlusCircle },
        { to: "/my-expenses", label: "Expenses", icon: ReceiptText },
        { to: "/income", label: "Income", icon: TrendingUp },
        { to: "/analytics", label: "Analytics", icon: BarChart3 },
        { to: "/goals", label: "Goals", icon: Target },
      ]
    : [];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const isDark = theme === "dark";

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/90 transition-all duration-300">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          
          {/* BRAND LOGO */}
          <div
            onClick={() => navigate(user ? "/dashboard" : "/")}
            className="brand-logo-container flex items-center cursor-pointer group shrink-0 select-none bg-slate-900 px-3 py-1.5 rounded-md shadow-md transition-all border border-violet-500/20 hover:border-violet-500/40"
          >
            <img
              src="/logo.png"
              alt="Finora"
              className="h-6 sm:h-7 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* DESKTOP NAVIGATION LINKS */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-900 p-1 rounded-md">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "text-slate-100 font-bold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute inset-0 bg-violet-600/20 rounded-md"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-3.5 h-3.5 relative z-10 shrink-0 ${isActive ? "text-violet-400" : "text-slate-400"}`} />
                    <span className="relative z-10 whitespace-nowrap">{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          )}

          {/* RIGHT ACTION CONTROLS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Quick Add Expense Button (Desktop / Tablet) */}
            {user && (
              <button
                onClick={() => navigate("/add-expenses")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md shadow-violet-600/30 transition-all cursor-pointer whitespace-nowrap transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Expense</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="p-2 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer flex items-center justify-center"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            </button>

            {/* USER PROFILE OR LOG IN BUTTONS (Desktop / Tablet) */}
            {user ? (
              <div ref={dropdownRef} className="relative hidden sm:block">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 rounded-md p-1 pr-2 cursor-pointer text-slate-100 transition-all"
                >
                  <div className="relative">
                    <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
                      {initials}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                  </div>
                  <span className="text-xs font-semibold max-w-[90px] truncate">
                    {user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-violet-400" : ""}`} />
                </button>

                {/* USER PROFILE DROPDOWN MENU */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-60 bg-slate-900 rounded-md shadow-2xl p-2 z-50 text-left"
                    >
                      {/* User Header */}
                      <div className="p-2.5 mb-1 bg-slate-950 rounded-md">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-100 truncate">{user.name}</p>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Pro
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                      </div>

                      {/* Dropdown Menu Items */}
                      <div className="flex flex-col gap-0.5">
                        {[
                          { label: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
                          { label: "Add Expense", route: "/add-expenses", icon: PlusCircle },
                          { label: "My Expenses", route: "/my-expenses", icon: ReceiptText },
                          { label: "Income Tracker", route: "/income", icon: TrendingUp },
                          { label: "Analytics", route: "/analytics", icon: BarChart3 },
                          { label: "Budget Goals", route: "/goals", icon: Target },
                          { label: "Settings", route: "/settings", icon: Settings },
                        ].map((item) => {
                          const MenuItemIcon = item.icon;
                          return (
                            <button
                              key={item.route}
                              onClick={() => {
                                navigate(item.route);
                                setDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors text-left cursor-pointer"
                            >
                              <MenuItemIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Logout option */}
                      <div className="pt-1 mt-1 border-t border-slate-800/50">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-3.5 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* HAMBURGER MOBILE MENU BUTTON */}
            {user && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-md bg-slate-900 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-4 h-4 text-violet-400" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE MENU FLOATING OVERLAY DRAWER (OVERLAPS PAGE CONTENT) */}
      <AnimatePresence>
        {mobileOpen && user && (
          <div
            className="fixed inset-0 top-16 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden flex flex-col justify-start"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-slate-900 p-4 sm:p-5 shadow-2xl flex flex-col gap-3 max-h-[calc(100vh-64px)] overflow-y-auto border-b border-slate-800"
            >
              {/* User Profile Card inside Mobile Drawer */}
              <div className="p-3 bg-slate-950 rounded-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-violet-600 flex items-center justify-center text-xs font-extrabold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-100 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold shrink-0">
                  PRO
                </span>
              </div>

              {/* Quick Add Expense Mobile CTA */}
              <button
                onClick={() => {
                  navigate("/add-expenses");
                  setMobileOpen(false);
                }}
                className="w-full py-2.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>+ Add Expense</span>
              </button>

              {/* Nav Links Grid */}
              <div className="flex flex-col gap-1.5 pt-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs transition-all ${
                        isActive
                          ? "bg-violet-600 text-white font-bold shadow-md"
                          : "text-slate-300 dark:text-slate-200 hover:bg-slate-950 font-semibold"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-violet-400"}`} />
                      <span>{link.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="pt-2 mt-1 border-t border-slate-800/40 flex flex-col gap-1">
                <button
                  onClick={() => {
                    navigate("/settings");
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-semibold text-slate-300 hover:bg-slate-950 text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings & Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-semibold text-rose-400 hover:bg-rose-500/10 text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out Account</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
