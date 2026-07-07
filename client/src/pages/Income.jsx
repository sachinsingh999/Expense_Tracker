import React, { useState, useEffect } from "react";
import { useExpense } from "../context/ExpenseContext";
import { showToast } from "../components/Toast";

const INCOME_SOURCES = ["Salary", "Freelance", "Business", "Investment", "Gift", "Rental", "Other"];

const SOURCE_ICONS = {
  Salary: "💼", Freelance: "💻", Business: "🏢",
  Investment: "📈", Gift: "🎁", Rental: "🏠", Other: "💵",
};

const SOURCE_COLORS = {
  Salary: "rgba(16,185,129,0.15)", Freelance: "rgba(59,130,246,0.15)",
  Business: "rgba(139,92,246,0.15)", Investment: "rgba(245,158,11,0.15)",
  Gift: "rgba(236,72,153,0.15)", Rental: "rgba(6,182,212,0.15)", Other: "rgba(148,163,184,0.15)",
};

const formatCurrency = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const Income = () => {
  const { income, fetchIncome, addIncome, deleteIncome, loading, totalIncome } = useExpense();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    source: "Salary",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) {
      showToast("Title and amount are required", "error");
      return;
    }
    setFormLoading(true);
    try {
      await addIncome({ ...form, amount: Number(form.amount) });
      showToast("Income added! 💵", "success");
      setForm({ title: "", amount: "", source: "Salary", date: new Date().toISOString().split("T")[0], note: "" });
    } catch {
      showToast("Failed to add income", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteIncome(id);
      setDeleteConfirm(null);
      showToast("Income deleted", "success");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  // Source breakdown
  const sourceBreakdown = income.reduce((acc, i) => {
    acc[i.source] = (acc[i.source] || 0) + i.amount;
    return acc;
  }, {});

  return (
    <div className="page-wrapper" style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, animation: "fadeInUp 0.4s ease" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Income</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Track all your income sources</p>
      </div>

      {/* Total banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
        border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: 16,
        padding: "20px 24px",
        marginBottom: 28,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        animation: "fadeInUp 0.4s ease 0.08s both",
      }}>
        <div>
          <p style={{ color: "#34d399", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Total Income</p>
          <p style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>{formatCurrency(totalIncome)}</p>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {Object.entries(sourceBreakdown).map(([source, amount]) => (
            <div key={source} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1rem", marginBottom: 2 }}>{SOURCE_ICONS[source]}</p>
              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{source}</p>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#34d399" }}>{formatCurrency(amount)}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24 }}>
        {/* Add income form */}
        <div style={{ animation: "fadeInUp 0.4s ease 0.15s both" }}>
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-color)",
            borderRadius: 20, padding: 28, backdropFilter: "blur(20px)",
          }}>
            <h2 style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text-primary)", marginBottom: 20 }}>Add Income</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="form-label">Title *</label>
                <input name="title" className="input-field" placeholder="e.g. Monthly Salary" value={form.title} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label">Amount (₹) *</label>
                <input name="amount" type="number" min="0" className="input-field" placeholder="0" value={form.amount} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label">Source</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  {INCOME_SOURCES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, source: s })}
                      style={{
                        padding: "8px 4px",
                        borderRadius: 8,
                        border: `1px solid ${form.source === s ? "var(--green)" : "var(--border-color)"}`,
                        background: form.source === s ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.02)",
                        cursor: "pointer",
                        color: form.source === s ? "#34d399" : "var(--text-secondary)",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span>{SOURCE_ICONS[s]}</span>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label">Date</label>
                <input name="date" type="date" className="input-field" value={form.date} onChange={handleChange} style={{ colorScheme: "dark" }} />
              </div>
              <div>
                <label className="form-label">Note (optional)</label>
                <textarea name="note" className="input-field" placeholder="Additional details..." value={form.note} onChange={handleChange} rows={2} style={{ resize: "none", fontFamily: "inherit" }} />
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className="btn-primary"
                style={{ padding: "12px", fontSize: "0.9rem", background: "linear-gradient(135deg, #10b981, #059669)" }}
              >
                {formLoading ? "Saving..." : "Add Income →"}
              </button>
            </form>
          </div>
        </div>

        {/* Income list */}
        <div style={{ animation: "fadeInUp 0.4s ease 0.2s both" }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text-primary)", marginBottom: 16 }}>
            Income History <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({income.length})</span>
          </h2>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>Loading...</div>
          ) : income.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "2.5rem", marginBottom: 10 }}>💵</p>
              <p>No income recorded yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {income.map((item, i) => (
                <div
                  key={item._id || i}
                  className="glass-card"
                  style={{
                    padding: "14px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    animation: `fadeInUp 0.3s ease ${i * 0.04}s both`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: SOURCE_COLORS[item.source] || "rgba(148,163,184,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.1rem", flexShrink: 0,
                    }}>
                      {SOURCE_ICONS[item.source] || "💵"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.title}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {item.source} · {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <p style={{ fontWeight: 700, color: "var(--green)", fontSize: "0.95rem" }}>+{formatCurrency(item.amount)}</p>
                    <button onClick={() => setDeleteConfirm(item._id)} className="btn-danger">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 200, backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}
        >
          <div style={{ background: "#1a1a2e", border: "1px solid var(--border-color)", borderRadius: 20, padding: "32px", width: "100%", maxWidth: 360, textAlign: "center", animation: "fadeInUp 0.3s ease" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🗑️</div>
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8, color: "var(--text-primary)" }}>Delete Income?</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: 24 }}>This cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary" style={{ padding: "10px 20px" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger" style={{ padding: "10px 20px" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
