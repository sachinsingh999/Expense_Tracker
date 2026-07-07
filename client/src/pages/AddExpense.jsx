import React, { useState, useEffect } from "react";
import { useExpense } from "../context/ExpenseContext";
import { showToast } from "../components/Toast";

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Travel", "Other"];
const PAYMENT_MODES = ["Cash", "Card", "UPI", "NetBanking", "Other"];

const CATEGORY_ICONS = {
  Food: "🍽️", Transport: "🚗", Shopping: "🛍️", Bills: "📄",
  Entertainment: "🎭", Health: "💊", Education: "📚", Travel: "✈️", Other: "📦",
};

const AddExpense = () => {
  const { addExpense } = useExpense();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
    paymentMode: "Cash",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category) {
      showToast("Please fill all required fields", "error");
      return;
    }
    setLoading(true);
    try {
      await addExpense({
        ...form,
        amount: Number(form.amount),
      });
      setSuccess(true);
      showToast("Expense added successfully! 💸", "success");
      setForm({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        note: "",
        paymentMode: "Cash",
      });
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add expense", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "40px 24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 580,
        animation: "fadeInUp 0.5s ease",
      }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
            Add Expense
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Record a new spending transaction
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border-color)",
          borderRadius: 24,
          padding: "36px",
          backdropFilter: "blur(20px)",
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

              {/* Title */}
              <div>
                <label className="form-label">Title <span style={{ color: "var(--red)" }}>*</span></label>
                <input
                  name="title"
                  className="input-field"
                  placeholder="e.g. Groceries, Uber, Netflix..."
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Amount + Payment Mode */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="form-label">Amount (₹) <span style={{ color: "var(--red)" }}>*</span></label>
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-field"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Payment Mode</label>
                  <select name="paymentMode" className="input-field" value={form.paymentMode} onChange={handleChange}>
                    {PAYMENT_MODES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category — visual selector */}
              <div>
                <label className="form-label">Category <span style={{ color: "var(--red)" }}>*</span></label>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                  gap: 8,
                  marginTop: 4,
                }}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat })}
                      style={{
                        padding: "10px 8px",
                        borderRadius: 10,
                        border: `1px solid ${form.category === cat ? "var(--accent)" : "var(--border-color)"}`,
                        background: form.category === cat ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
                        cursor: "pointer",
                        color: form.category === cat ? "var(--accent-light)" : "var(--text-secondary)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>{CATEGORY_ICONS[cat]}</span>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="form-label">Date</label>
                <input
                  name="date"
                  type="date"
                  className="input-field"
                  value={form.date}
                  onChange={handleChange}
                  style={{ colorScheme: "dark" }}
                />
              </div>

              {/* Note */}
              <div>
                <label className="form-label">Note <span style={{ color: "var(--text-muted)" }}>(optional)</span></label>
                <textarea
                  name="note"
                  className="input-field"
                  placeholder="Any additional details..."
                  value={form.note}
                  onChange={handleChange}
                  rows={3}
                  style={{ resize: "vertical", fontFamily: "inherit" }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ padding: "14px", fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {loading ? (
                  <>
                    <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                    Saving...
                  </>
                ) : success ? "✓ Added!" : "Add Expense →"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AddExpense;
