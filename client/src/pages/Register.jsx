import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/Toast";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:4000/api/auth/register", {
        name,
        email,
        password,
      });
      login(
        { _id: data._id, name: data.name, email: data.email, monthlyBudget: data.monthlyBudget },
        data.token
      );
      showToast(`Account created! Welcome, ${data.name}! 🎉`, "success");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["transparent", "#ef4444", "#f59e0b", "#10b981"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "var(--bg-primary)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: 460,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid var(--border-color)",
        borderRadius: 24,
        padding: "40px 36px",
        backdropFilter: "blur(20px)",
        animation: "fadeInUp 0.5s ease",
        position: "relative",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56,
            background: "linear-gradient(135deg, var(--accent), #6366f1)",
            borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", margin: "0 auto 16px",
            boxShadow: "0 8px 24px var(--accent-glow)",
          }}>
            ✨
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
            Create Account
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Start tracking your expenses for free
          </p>
        </div>

        {error && (
          <div style={{
            background: "var(--red-light)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 20,
            color: "var(--red)", fontSize: "0.875rem",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                className="input-field"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", color: "var(--text-muted)", fontSize: "1rem",
                }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            {/* Password strength */}
            {password.length > 0 && (
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 4, background: "var(--border-color)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    width: `${(strength / 3) * 100}%`,
                    height: "100%",
                    background: strengthColors[strength],
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                  }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                borderColor: confirmPassword && confirmPassword !== password ? "var(--red)" : undefined,
              }}
            />
            {confirmPassword && confirmPassword !== password && (
              <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: 4 }}>Passwords don't match</p>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "13px", fontSize: "0.95rem", marginTop: 4 }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                Creating account...
              </span>
            ) : "Create Account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent-light)", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Register;
