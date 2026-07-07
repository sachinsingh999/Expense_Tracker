import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: "📊", title: "Smart Analytics", desc: "Visual charts that show where your money goes — by category, month, and trend." },
  { icon: "💳", title: "Track Every Expense", desc: "Log cash, card, and UPI payments with notes. Never forget a transaction." },
  { icon: "💰", title: "Income Management", desc: "Track salary, freelance, and other income sources separately." },
  { icon: "🎯", title: "Budget Goals", desc: "Set monthly budgets and get a real-time progress bar showing your spending." },
  { icon: "📥", title: "CSV Export", desc: "Download your expense history anytime for tax or personal records." },
  { icon: "🔒", title: "Secure & Private", desc: "JWT-authenticated, your data is always protected and only yours." },
];

const stats = [
  { value: "10K+", label: "Users Tracking" },
  { value: "₹2Cr+", label: "Expenses Tracked" },
  { value: "99.9%", label: "Uptime" },
  { value: "100%", label: "Free to Use" },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heroRef = useRef(null);

  // Parallax effect on hero
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${window.scrollY * 0.4}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* HERO */}
      <section
        ref={heroRef}
        style={{
          padding: "100px 24px 120px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "20%", left: "10%",
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(139, 92, 246, 0.12)",
            border: "1px solid rgba(139, 92, 246, 0.25)",
            borderRadius: 20,
            padding: "6px 16px",
            marginBottom: 24,
            fontSize: "0.85rem",
            color: "var(--accent-light)",
            fontWeight: 500,
          }}>
            ✨ Advanced Expense Management
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "var(--text-primary)",
          }}>
            Take Control of Your{" "}
            <span className="gradient-text">Finances</span>
          </h1>

          <p style={{
            fontSize: "1.15rem",
            color: "var(--text-secondary)",
            maxWidth: 560,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}>
            Track expenses, manage income, analyze spending patterns — all in one beautiful, powerful dashboard.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="btn-primary"
              onClick={() => navigate(user ? "/dashboard" : "/register")}
              style={{ padding: "14px 32px", fontSize: "1rem" }}
            >
              {user ? "Go to Dashboard →" : "Get Started Free →"}
            </button>
            {!user && (
              <button
                className="btn-secondary"
                onClick={() => navigate("/login")}
                style={{ padding: "14px 32px", fontSize: "1rem" }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{
        padding: "40px 24px",
        borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
        background: "rgba(255,255,255,0.02)",
      }}>
        <div style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 24,
          textAlign: "center",
        }}>
          {stats.map((s, i) => (
            <div key={i}>
              <p style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-light)" }}>{s.value}</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: 12,
            color: "var(--text-primary)",
          }}>
            Everything You Need
          </h2>
          <p style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            marginBottom: 56,
            fontSize: "1rem",
          }}>
            A complete financial toolkit, beautifully designed.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: 28,
                  animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
                }}
              >
                <div style={{
                  fontSize: "2rem",
                  marginBottom: 16,
                  width: 56,
                  height: 56,
                  background: "rgba(139,92,246,0.1)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 600, fontSize: "1.05rem", marginBottom: 8, color: "var(--text-primary)" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{
        padding: "80px 24px",
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid var(--border-color)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: 56,
            color: "var(--text-primary)",
          }}>
            Get Started in 3 Steps
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 32,
            textAlign: "center",
          }}>
            {[
              { step: "01", title: "Create Account", desc: "Sign up for free — no credit card required." },
              { step: "02", title: "Log Your Spending", desc: "Add expenses with category, payment mode, and notes." },
              { step: "03", title: "Analyze & Save", desc: "See charts, track budgets, and identify spending patterns." },
            ].map((s, i) => (
              <div key={i} style={{ animation: `fadeInUp 0.5s ease ${i * 0.15}s both` }}>
                <div style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, var(--accent), #6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 16,
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontWeight: 600, fontSize: "1.05rem", marginBottom: 8, color: "var(--text-primary)" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.08))",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: 24,
          padding: "60px 40px",
        }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>
            Ready to take control?
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
            Join thousands managing their finances smarter.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate(user ? "/dashboard" : "/register")}
            style={{ padding: "14px 40px", fontSize: "1rem" }}
          >
            {user ? "Open Dashboard →" : "Start for Free →"}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid var(--border-color)",
        padding: "24px",
        textAlign: "center",
        color: "var(--text-muted)",
        fontSize: "0.85rem",
      }}>
        © 2026 ExpensePro · Built with React & Node.js
      </footer>
    </div>
  );
};

export default Home;
