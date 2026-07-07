import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

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

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate("/login"); };

  const navLinks = user ? [
    { to: "/dashboard",    label: "Dashboard",   icon: "📊" },
    { to: "/add-expenses", label: "Add Expense", icon: "➕" },
    { to: "/my-expenses",  label: "My Expenses", icon: "📋" },
    { to: "/income",       label: "Income",      icon: "💰" },
    { to: "/analytics",    label: "Analytics",   icon: "📈" },
    { to: "/goals",        label: "Goals",       icon: "🎯" },
  ] : [];

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const isDark = theme === "dark";

  return (
    <>
      {/* NAV BAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "var(--bg-nav)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-color)",
        padding: "0 20px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}>

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", flexShrink: 0 }}
        >
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg, var(--accent), #6366f1)",
            borderRadius: 9, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1.05rem",
            boxShadow: "0 4px 12px var(--accent-glow)",
          }}>
            💰
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Expense<span className="gradient-text">Pro</span>
          </span>
        </div>

        {/* DESKTOP LINKS */}
        {user && (
          <div className="desktop-nav" style={{ display: "flex", gap: 2, alignItems: "center", flex: 1, justifyContent: "center" }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  padding: "6px 13px",
                  borderRadius: 9,
                  fontSize: "0.84rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive ? "var(--accent-light)" : "var(--text-secondary)",
                  background: isActive ? "rgba(139,92,246,0.12)" : "transparent",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* RIGHT CONTROLS */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {/* THEME TOGGLE */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: "0.85rem" }}>{isDark ? "🌙" : "☀️"}</span>
            <button
              className={`theme-toggle ${!isDark ? "active" : ""}`}
              onClick={toggleTheme}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            />
          </div>

          {user ? (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 10, padding: "5px 10px 5px 5px",
                  cursor: "pointer", color: "var(--text-primary)",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{
                  width: 28, height: 28,
                  background: "linear-gradient(135deg, var(--accent), #6366f1)",
                  borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 800, color: "white", flexShrink: 0,
                }}>
                  {initials}
                </div>
                <span style={{ fontSize: "0.82rem", fontWeight: 500, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name?.split(" ")[0]}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>▼</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  minWidth: 200,
                  background: "var(--bg-dropdown)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 14, padding: 8,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  animation: "fadeInUp 0.2s ease",
                  zIndex: 200,
                }}>
                  <div style={{ padding: "10px 12px 10px", borderBottom: "1px solid var(--border-color)", marginBottom: 4 }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{user.name}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{user.email}</p>
                  </div>
                  {[
                    { label: "⚙️ Settings", route: "/settings" },
                    { label: "🎯 My Goals", route: "/goals" },
                    { label: "📊 Analytics", route: "/analytics" },
                  ].map((item) => (
                    <button
                      key={item.route}
                      onClick={() => { navigate(item.route); setDropdownOpen(false); }}
                      style={{
                        width: "100%", textAlign: "left", padding: "9px 12px",
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--text-secondary)", fontSize: "0.875rem", borderRadius: 8,
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => { e.target.style.background = "var(--bg-card)"; e.target.style.color = "var(--text-primary)"; }}
                      onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "var(--text-secondary)"; }}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid var(--border-color)", marginTop: 4, paddingTop: 4 }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%", textAlign: "left", padding: "9px 12px",
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--red)", fontSize: "0.875rem", borderRadius: 8,
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => { e.target.style.background = "var(--red-light)"; }}
                      onMouseLeave={(e) => { e.target.style.background = "none"; }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => navigate("/login")} className="btn-secondary" style={{ padding: "7px 16px", fontSize: "0.85rem" }}>
                Login
              </button>
              <button onClick={() => navigate("/register")} className="btn-primary" style={{ padding: "7px 16px", fontSize: "0.85rem" }}>
                Sign Up
              </button>
            </div>
          )}

          {/* Hamburger */}
          {user && (
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: 9, width: 38, height: 38,
                cursor: "pointer", color: "var(--text-primary)",
                fontSize: "1rem", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && user && (
        <div style={{
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-color)",
          padding: "12px 16px 16px",
          display: "flex", flexDirection: "column", gap: 4,
          animation: "fadeInUp 0.2s ease",
        }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                padding: "12px 16px",
                borderRadius: 10,
                fontSize: "0.9rem",
                fontWeight: 500,
                textDecoration: "none",
                color: isActive ? "var(--accent-light)" : "var(--text-secondary)",
                background: isActive ? "rgba(139,92,246,0.1)" : "transparent",
                display: "flex", alignItems: "center", gap: 10,
              })}
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
          <div style={{ borderTop: "1px solid var(--border-color)", marginTop: 8, paddingTop: 8 }}>
            <button
              onClick={() => { navigate("/settings"); setMobileOpen(false); }}
              style={{
                width: "100%", textAlign: "left", padding: "12px 16px",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-secondary)", fontSize: "0.9rem", borderRadius: 10,
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              ⚙️ Settings
            </button>
            <button
              onClick={handleLogout}
              style={{
                width: "100%", textAlign: "left", padding: "12px 16px",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--red)", fontSize: "0.9rem", borderRadius: 10,
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
