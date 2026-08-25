import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showToast } from "./Toast";
import { API_URL as API } from "../config";

const GOAL_ICONS = ["🎯", "🏠", "✈️", "🎓", "🚗", "💍", "🏖️", "💻", "📱", "🎮", "💪", "🌟"];
const GOAL_COLORS = [
  "#8b5cf6", "#10b981", "#3b82f6", "#f59e0b",
  "#ef4444", "#ec4899", "#06b6d4", "#f97316",
];

const formatCurrency = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const GoalsWidget = () => {
  const { token } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showContribute, setShowContribute] = useState(null);
  const [contributeAmount, setContributeAmount] = useState("");
  const [form, setForm] = useState({
    title: "", targetAmount: "", deadline: "",
    icon: "🎯", color: "#8b5cf6",
  });
  const [loading, setLoading] = useState(false);

  const authH = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const fetchGoals = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API}/goals`, authH());
      setGoals(data);
    } catch {}
  }, [token]);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/goals`, {
        ...form,
        targetAmount: Number(form.targetAmount),
      }, authH());
      setGoals([data, ...goals]);
      setShowForm(false);
      setForm({ title: "", targetAmount: "", deadline: "", icon: "🎯", color: "#8b5cf6" });
      showToast("Goal created! 🎯", "success");
    } catch {
      showToast("Failed to create goal", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async (goalId) => {
    if (!contributeAmount || Number(contributeAmount) <= 0) {
      showToast("Enter a valid amount", "error");
      return;
    }
    try {
      const { data } = await axios.put(`${API}/goals/${goalId}/contribute`, {
        amount: Number(contributeAmount),
      }, authH());
      setGoals(goals.map((g) => g._id === goalId ? data : g));
      setShowContribute(null);
      setContributeAmount("");
      showToast(data.isCompleted ? "🎉 Goal completed!" : "Contribution added!", "success");
    } catch {
      showToast("Failed to contribute", "error");
    }
  };

  const handleDelete = async (goalId) => {
    try {
      await axios.delete(`${API}/goals/${goalId}`, authH());
      setGoals(goals.filter((g) => g._id !== goalId));
      showToast("Goal deleted", "success");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontWeight: 700, fontSize: "1.8rem", color: "var(--text-primary)" }}>
          Savings Goals
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          style={{ padding: "10px 20px", fontSize: "0.875rem" }}
        >
          + New Goal
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 0",
          color: "var(--text-muted)",
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed var(--border-color)",
          borderRadius: 20,
        }}>
          <p style={{ fontSize: "3rem", marginBottom: 12 }}>🎯</p>
          <p style={{ fontSize: "1rem", marginBottom: 8 }}>No savings goals yet</p>
          <p style={{ fontSize: "0.875rem" }}>Set a goal and start saving towards it!</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
            style={{ marginTop: 20, padding: "10px 24px" }}
          >
            Create First Goal
          </button>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
        }}>
          {goals.map((goal, i) => {
            const pct = goal.targetAmount > 0
              ? Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)
              : 0;
            const remaining = goal.targetAmount - goal.savedAmount;
            const daysLeft = goal.deadline
              ? Math.max(0, Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
              : null;

            return (
              <div
                key={goal._id}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${goal.isCompleted ? "rgba(16,185,129,0.3)" : "var(--border-color)"}`,
                  borderRadius: 20,
                  padding: 24,
                  position: "relative",
                  overflow: "hidden",
                  animation: `fadeInUp 0.4s ease ${i * 0.08}s both`,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 30px ${goal.color}22`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Completed badge */}
                {goal.isCompleted && (
                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    background: "rgba(16,185,129,0.15)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    color: "#34d399", fontSize: "0.7rem", fontWeight: 700,
                    padding: "3px 10px", borderRadius: 20,
                  }}>
                    ✓ COMPLETED
                  </div>
                )}

                {/* Glow orb */}
                <div style={{
                  position: "absolute", top: -20, right: -20,
                  width: 80, height: 80, borderRadius: "50%",
                  background: goal.color, opacity: 0.08,
                  pointerEvents: "none",
                }} />

                {/* Icon + title */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: `${goal.color}22`,
                    border: `1px solid ${goal.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem",
                  }}>
                    {goal.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>{goal.title}</p>
                    {daysLeft !== null && (
                      <p style={{ fontSize: "0.72rem", color: daysLeft < 30 ? "var(--yellow)" : "var(--text-muted)" }}>
                        {daysLeft === 0 ? "🚨 Due today!" : `${daysLeft} days left`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Amounts */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 2 }}>Saved</p>
                    <p style={{ fontWeight: 700, color: goal.color, fontSize: "1.1rem" }}>
                      {formatCurrency(goal.savedAmount)}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 2 }}>Target</p>
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.1rem" }}>
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${goal.color}, ${goal.color}cc)`,
                    borderRadius: 4,
                    transition: "width 0.8s ease",
                    boxShadow: `0 0 8px ${goal.color}66`,
                  }} />
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 16 }}>
                  {pct.toFixed(0)}% complete · {formatCurrency(remaining)} remaining
                </p>

                {/* Actions */}
                {!goal.isCompleted && (
                  <div style={{ display: "flex", gap: 8 }}>
                    {showContribute === goal._id ? (
                      <div style={{ display: "flex", gap: 6, flex: 1 }}>
                        <input
                          type="number"
                          className="input-field"
                          placeholder="Amount ₹"
                          value={contributeAmount}
                          onChange={(e) => setContributeAmount(e.target.value)}
                          style={{ flex: 1, padding: "8px 12px", fontSize: "0.85rem" }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleContribute(goal._id)}
                          style={{
                            background: `${goal.color}22`,
                            border: `1px solid ${goal.color}55`,
                            color: goal.color,
                            borderRadius: 8, padding: "8px 14px",
                            cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", flexShrink: 0,
                          }}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setShowContribute(null)}
                          className="btn-secondary"
                          style={{ padding: "8px 10px", fontSize: "0.8rem", flexShrink: 0 }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => { setShowContribute(goal._id); setContributeAmount(""); }}
                          style={{
                            flex: 1, background: `${goal.color}18`,
                            border: `1px solid ${goal.color}44`,
                            color: goal.color, borderRadius: 10,
                            padding: "9px", cursor: "pointer",
                            fontWeight: 600, fontSize: "0.82rem",
                          }}
                        >
                          + Contribute
                        </button>
                        <button
                          onClick={() => handleDelete(goal._id)}
                          className="btn-danger"
                          style={{ padding: "9px 14px" }}
                        >
                          🗑
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      {showForm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 300, backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div style={{
            background: "#14142a",
            border: "1px solid var(--border-color)",
            borderRadius: 24, padding: 32,
            width: "100%", maxWidth: 500,
            animation: "fadeInUp 0.3s ease",
          }}>
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: 24 }}>
              Create Savings Goal
            </h2>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Icon picker */}
              <div>
                <label className="form-label">Choose Icon</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {GOAL_ICONS.map((ic) => (
                    <button
                      key={ic} type="button"
                      onClick={() => setForm({ ...form, icon: ic })}
                      style={{
                        width: 40, height: 40, borderRadius: 10, fontSize: "1.2rem",
                        border: `2px solid ${form.icon === ic ? "var(--accent)" : "var(--border-color)"}`,
                        background: form.icon === ic ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
                        cursor: "pointer", transition: "all 0.15s ease",
                      }}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="form-label">Color</label>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  {GOAL_COLORS.map((c) => (
                    <button
                      key={c} type="button"
                      onClick={() => setForm({ ...form, color: c })}
                      style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: c, border: `3px solid ${form.color === c ? "white" : "transparent"}`,
                        cursor: "pointer", transition: "all 0.15s ease",
                        outline: form.color === c ? `2px solid ${c}` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Goal Title *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Europe Trip, Emergency Fund..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Target Amount (₹) *</label>
                  <input
                    type="number" min="1" className="input-field"
                    placeholder="50000"
                    value={form.targetAmount}
                    onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Deadline (optional)</label>
                  <input
                    type="date" className="input-field"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              {/* Preview */}
              {form.title && form.targetAmount && (
                <div style={{
                  background: `${form.color}10`,
                  border: `1px solid ${form.color}33`,
                  borderRadius: 12, padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: "1.5rem" }}>{form.icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>{form.title}</p>
                    <p style={{ color: form.color, fontSize: "0.8rem" }}>Target: {formatCurrency(Number(form.targetAmount) || 0)}</p>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <button
                  type="button" onClick={() => setShowForm(false)}
                  className="btn-secondary" style={{ flex: 1, padding: "12px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={loading}
                  className="btn-primary" style={{ flex: 2, padding: "12px" }}
                >
                  {loading ? "Creating..." : "🎯 Create Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsWidget;
