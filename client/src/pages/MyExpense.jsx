import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import { showToast } from "../components/Toast";
import {
  ReceiptText,
  PlusCircle,
  Download,
  Search,
  Filter,
  ArrowUpDown,
  Edit3,
  Trash2,
  Utensils,
  Car,
  ShoppingBag,
  FileText,
  Film,
  Stethoscope,
  GraduationCap,
  Plane,
  Package,
  Calendar,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  X
} from "lucide-react";

const CATEGORIES = ["All", "Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Travel", "Other"];
const PAYMENT_MODES = ["All Modes", "Cash", "Card", "UPI", "NetBanking", "Other"];
const PAYMENT_MODES_EDIT = ["Cash", "Card", "UPI", "NetBanking", "Other"];
const CATEGORIES_EDIT = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Travel", "Other"];

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: FileText,
  Entertainment: Film,
  Health: Stethoscope,
  Education: GraduationCap,
  Travel: Plane,
  Other: Package,
};

const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const MyExpense = () => {
  const { expenses, fetchExpenses, updateExpense, deleteExpense, loading } = useExpense();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPaymentMode, setFilterPaymentMode] = useState("All Modes");
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [editExpense, setEditExpense] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Filter + sort logic
  const filtered = expenses
    .filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase()) ||
        (e.note || "").toLowerCase().includes(search.toLowerCase());
      
      const matchCat = filterCategory === "All" || e.category === filterCategory;
      
      const matchPm = filterPaymentMode === "All Modes" || (e.paymentMode || "Cash") === filterPaymentMode;

      let matchDate = true;
      if (filterDateRange !== "all") {
        const itemDate = new Date(e.date);
        const now = new Date();
        if (filterDateRange === "this_month") {
          matchDate = itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
        } else if (filterDateRange === "last_30") {
          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
          matchDate = itemDate >= thirtyDaysAgo;
        } else if (filterDateRange === "this_year") {
          matchDate = itemDate.getFullYear() === now.getFullYear();
        }
      }

      return matchSearch && matchCat && matchPm && matchDate;
    })
    .sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date_asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount_desc") return b.amount - a.amount;
      if (sortBy === "amount_asc") return a.amount - b.amount;
      return 0;
    });

  const totalFiltered = filtered.reduce((sum, e) => sum + e.amount, 0);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Export to CSV
  const exportCSV = () => {
    if (expenses.length === 0) {
      showToast("No expenses to export", "error");
      return;
    }
    const headers = ["Title,Amount,Category,PaymentMode,Date,Note"];
    const rows = expenses.map((e) =>
      `"${e.title}",${e.amount},"${e.category}","${e.paymentMode || "Cash"}","${e.date}","${e.note || ""}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported to CSV! 📄", "success");
  };

  // Edit modal setup
  const handleEdit = (expense) => {
    setEditExpense(expense);
    setEditForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      paymentMode: expense.paymentMode || "Cash",
      date: expense.date ? new Date(expense.date).toISOString().split("T")[0] : "",
      note: expense.note || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateExpense(editExpense._id, { ...editForm, amount: Number(editForm.amount) });
      setEditExpense(null);
      showToast("Expense updated successfully! ✏️", "success");
    } catch {
      showToast("Failed to update expense", "error");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setDeleteConfirm(null);
      showToast("Expense deleted successfully", "success");
    } catch {
      showToast("Failed to delete expense", "error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 selection:bg-violet-500 selection:text-white flex flex-col items-center">
      <div className="w-full max-w-[1500px] mx-auto flex flex-col gap-4 sm:gap-5">
        
        {/* UNWRAPPED TOP HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[11px] font-semibold mb-1">
              <ReceiptText className="w-3.5 h-3.5" />
              <span>Expense History</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100">
              My <span className="text-violet-400">Expenses</span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-violet-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => navigate("/add-expenses")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add Expense</span>
            </button>
          </div>
        </div>

        {/* INTEGRATED FILTER CONTROLS CARD */}
        <div className="bg-slate-900 rounded-md p-4 sm:p-5 shadow-xl flex flex-col gap-3.5 w-full">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Box */}
            <div className="relative sm:col-span-5 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                className="input-field input-field-icon"
                placeholder="Search expenses by title, category, or note..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-2">
              <select
                className="input-field cursor-pointer"
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
                ))}
              </select>
            </div>

            {/* Payment Mode Filter */}
            <div className="sm:col-span-2">
              <select
                className="input-field cursor-pointer"
                value={filterPaymentMode}
                onChange={(e) => { setFilterPaymentMode(e.target.value); setPage(1); }}
              >
                {PAYMENT_MODES.map((pm) => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="sm:col-span-3">
              <select
                className="input-field cursor-pointer"
                value={filterDateRange}
                onChange={(e) => { setFilterDateRange(e.target.value); setPage(1); }}
              >
                <option value="all">All Time</option>
                <option value="this_month">This Month</option>
                <option value="last_30">Last 30 Days</option>
                <option value="this_year">This Year</option>
              </select>
            </div>
          </div>

          {/* Quick Category Filter Pills Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-violet-400" />
              <span>Quick Filter:</span>
            </span>
            {CATEGORIES.map((cat) => {
              const isSelected = filterCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setFilterCategory(cat); setPage(1); }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-violet-600 text-white font-bold shadow-sm"
                      : "bg-slate-950 text-slate-700 dark:text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* EXPENSES LIST CARD */}
        <div className="bg-slate-900 rounded-md p-5 sm:p-6 shadow-2xl flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/40 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider">
              Showing {filtered.length} expense(s)
            </span>
            <span className="text-slate-400 font-semibold">
              Total Filtered: <strong className="text-rose-400 font-extrabold">{formatCurrency(totalFiltered)}</strong>
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs font-semibold">Loading expenses...</div>
          ) : paginated.length === 0 ? (
            <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <ReceiptText className="w-10 h-10 text-slate-700" />
              <p className="text-sm font-semibold text-slate-400">No expenses found</p>
              <p className="text-xs text-slate-500">
                {search || filterCategory !== "All" || filterPaymentMode !== "All Modes" || filterDateRange !== "all"
                  ? "Try adjusting your search or filter options."
                  : "Log an expense to start tracking."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((e, i) => {
                const IconComp = CATEGORY_ICONS[e.category] || Package;
                return (
                  <div
                    key={e._id || i}
                    className="p-4 rounded-md bg-slate-950 flex flex-col justify-between gap-3 shadow-sm transition-all text-left group"
                  >
                    {/* Top Row: Category Icon + Badges + Action Buttons */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="px-2 py-0.5 rounded bg-violet-500/15 text-violet-600 dark:text-violet-300 font-bold text-[10px] uppercase tracking-wider">
                          {e.category}
                        </span>
                        {e.paymentMode && (
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold text-[10px]">
                            {e.paymentMode}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(e)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-violet-600 text-violet-500 dark:text-violet-400 hover:text-white transition-colors cursor-pointer"
                          title="Edit expense"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(e._id)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-rose-600 text-rose-500 dark:text-rose-400 hover:text-white transition-colors cursor-pointer"
                          title="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Middle Row: Title & Amount */}
                    <div className="flex items-baseline justify-between gap-2 pt-1">
                      <h3 className="text-sm font-bold text-slate-100 truncate flex-1">{e.title}</h3>
                      <span className="text-base font-extrabold text-rose-400 shrink-0">
                        -{formatCurrency(e.amount)}
                      </span>
                    </div>

                    {/* Bottom Row: Date & Notes */}
                    <div className="flex flex-col gap-1 pt-2 border-t border-slate-800/40 text-[11px] text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="font-mono">
                          {new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Logged</span>
                      </div>
                      {e.note && (
                        <p className="text-xs text-slate-400 italic truncate mt-0.5">"{e.note}"</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/40 text-xs">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3.5 py-2 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Previous
              </button>
              <span className="text-slate-400 font-mono">
                Page <strong className="text-slate-100">{page}</strong> of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3.5 py-2 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Edit Modal */}
      {editExpense && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setEditExpense(null); }}
        >
          <div className="bg-slate-900 rounded-lg p-6 w-full max-w-md shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-violet-400" />
                Edit Expense Record
              </h2>
              <button
                onClick={() => setEditExpense(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4 text-left">
              <div>
                <label className="form-label">Expense Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-field font-bold text-rose-400"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="input-field cursor-pointer"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    {CATEGORIES_EDIT.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Payment Mode</label>
                  <select
                    className="input-field cursor-pointer"
                    value={editForm.paymentMode}
                    onChange={(e) => setEditForm({ ...editForm, paymentMode: e.target.value })}
                  >
                    {PAYMENT_MODES_EDIT.map((pm) => (
                      <option key={pm} value={pm}>{pm}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Note / Remark</label>
                <input
                  type="text"
                  className="input-field"
                  value={editForm.note}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditExpense(null)}
                  className="flex-1 py-2.5 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}
        >
          <div className="bg-slate-900 rounded-lg p-6 w-full max-w-sm text-center shadow-2xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Delete Expense Record?</h3>
              <p className="text-xs text-slate-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyExpense;
