import React, { useEffect, useState } from "react";
import { useExpense } from "../context/ExpenseContext";
import { showToast } from "../components/Toast";

const CATEGORIES = ["All", "Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Travel", "Other"];
const PAYMENT_MODES_EDIT = ["Cash", "Card", "UPI", "NetBanking", "Other"];
const CATEGORIES_EDIT = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Travel", "Other"];

const CATEGORY_CLASSES = {
  Food: "cat-food", Transport: "cat-transport", Shopping: "cat-shopping",
  Bills: "cat-bills", Entertainment: "cat-entertainment", Health: "cat-health",
  Education: "cat-education", Travel: "cat-travel", Other: "cat-other",
};

const CATEGORY_ICONS = {
  Food: "🍽️", Transport: "🚗", Shopping: "🛍️", Bills: "📄",
  Entertainment: "🎭", Health: "💊", Education: "📚", Travel: "✈️", Other: "📦",
};

const formatCurrency = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const MyExpense = () => {
  const { expenses, fetchExpenses, updateExpense, deleteExpense, loading } = useExpense();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date_desc");
  const [editExpense, setEditExpense] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Filter + sort
  const filtered = expenses
    .filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase()) ||
        (e.note || "").toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === "All" || e.category === filterCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date_asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount_desc") return b.amount - a.amount;
      if (sortBy === "amount_asc") return a.amount - b.amount;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  // CSV Export
  const exportCSV = () => {
    const headers = ["Title", "Amount", "Category", "Date", "Payment Mode", "Note"];
    const rows = filtered.map((e) => [
      `"${e.title}"`,
      e.amount,
      e.category,
      new Date(e.date).toLocaleDateString("en-IN"),
      e.paymentMode || "",
      `"${e.note || ""}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Expenses exported as CSV! 📥", "success");
  };

  // Edit
  const handleEdit = (expense) => {
    setEditExpense(expense);
    setEditForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date?.split("T")[0] || "",
      note: expense.note || "",
      paymentMode: expense.paymentMode || "Cash",
    });
  };

  const handleUpdate = async () => {
    try {
      await updateExpense(editExpense._id, { ...editForm, amount: Number(editForm.amount) });
      setEditExpense(null);
      showToast("Expense updated!", "success");
    } catch {
      showToast("Failed to update expense", "error");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setDeleteConfirm(null);
      showToast("Expense deleted", "success");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16, animation: "fadeInUp 0.4s ease" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>My Expenses</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            {filtered.length} records · Total: <span style={{ color: "var(--red)", fontWeight: 600 }}>{formatCurrency(totalFiltered)}</span>
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="btn-secondary"
          style={{ padding: "10px 18px", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 6 }}
        >
          📥 Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--border-color)",
        borderRadius: 14,
        padding: "16px 20px",
        marginBottom: 20,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
        animation: "fadeInUp 0.4s ease 0.08s both",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.9rem" }}>🔍</span>
          <input
            className="input-field"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: 36 }}
          />
        </div>

        {/* Category filter */}
        <select
          className="input-field"
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
          style={{ flex: "0 0 auto", width: "auto", minWidth: 140 }}
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        {/* Sort */}
        <select
          className="input-field"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ flex: "0 0 auto", width: "auto", minWidth: 160 }}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amount_desc">Highest Amount</option>
          <option value="amount_asc">Lowest Amount</option>
        </select>
      </div>

      {/* Expense List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--border-color)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          Loading expenses...
        </div>
      ) : paginated.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)", animation: "fadeIn 0.4s ease" }}>
          <p style={{ fontSize: "3rem", marginBottom: 12 }}>🔍</p>
          <p style={{ fontSize: "1rem" }}>{search || filterCategory !== "All" ? "No expenses match your filters" : "No expenses yet"}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {paginated.map((e, i) => (
            <div
              key={e._id || i}
              className="glass-card"
              style={{
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                animation: `fadeInUp 0.3s ease ${i * 0.04}s both`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: "rgba(139,92,246,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem", flexShrink: 0,
                }}>
                  {CATEGORY_ICONS[e.category] || "📦"}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {e.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
                    <span className={`badge ${CATEGORY_CLASSES[e.category] || "cat-other"}`}>{e.category}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                      {new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {e.paymentMode && (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>· {e.paymentMode}</span>
                    )}
                  </div>
                  {e.note && (
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>💬 {e.note}</p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <p style={{ fontWeight: 700, color: "var(--red)", fontSize: "1rem" }}>
                  -{formatCurrency(e.amount)}
                </p>
                <button
                  onClick={() => handleEdit(e)}
                  style={{
                    background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                    color: "#60a5fa", borderRadius: 8, padding: "6px 12px",
                    fontSize: "0.8rem", cursor: "pointer", fontWeight: 500,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(e._id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "0.85rem", opacity: page === 1 ? 0.4 : 1 }}
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: `1px solid ${p === page ? "var(--accent)" : "var(--border-color)"}`,
                background: p === page ? "rgba(139,92,246,0.15)" : "var(--bg-card)",
                color: p === page ? "var(--accent-light)" : "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: p === page ? 600 : 400,
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "0.85rem", opacity: page === totalPages ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editExpense && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 200, backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setEditExpense(null); }}
        >
          <div style={{
            background: "#1a1a2e", border: "1px solid var(--border-color)",
            borderRadius: 20, padding: 32, width: "100%", maxWidth: 480,
            animation: "fadeInUp 0.3s ease",
          }}>
            <h2 style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: 24, color: "var(--text-primary)" }}>Edit Expense</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="form-label">Title</label>
                <input className="input-field" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Amount (₹)</label>
                  <input type="number" className="input-field" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Payment Mode</label>
                  <select className="input-field" value={editForm.paymentMode} onChange={(e) => setEditForm({ ...editForm, paymentMode: e.target.value })}>
                    {PAYMENT_MODES_EDIT.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Category</label>
                <select className="input-field" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                  {CATEGORIES_EDIT.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Date</label>
                <input type="date" className="input-field" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} style={{ colorScheme: "dark" }} />
              </div>
              <div>
                <label className="form-label">Note</label>
                <textarea className="input-field" value={editForm.note} rows={2} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })} style={{ resize: "none", fontFamily: "inherit" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
              <button onClick={() => setEditExpense(null)} className="btn-secondary" style={{ padding: "10px 20px" }}>Cancel</button>
              <button onClick={handleUpdate} className="btn-primary" style={{ padding: "10px 20px" }}>Update Expense</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 200, backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}
        >
          <div style={{
            background: "#1a1a2e", border: "1px solid var(--border-color)",
            borderRadius: 20, padding: "32px 32px 24px", width: "100%", maxWidth: 380,
            textAlign: "center", animation: "fadeInUp 0.3s ease",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🗑️</div>
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8, color: "var(--text-primary)" }}>Delete Expense?</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary" style={{ padding: "10px 20px" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger" style={{ padding: "10px 20px" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default MyExpense;
