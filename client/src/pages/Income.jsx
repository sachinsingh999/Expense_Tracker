import React, { useState, useEffect } from "react";
import { useExpense } from "../context/ExpenseContext";
import { showToast } from "../components/Toast";
import {
  TrendingUp,
  PlusCircle,
  Trash2,
  Briefcase,
  Laptop,
  Building,
  LineChart,
  Gift,
  Home as HomeIcon,
  Banknote,
  Calendar,
  Tag,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const INCOME_SOURCES = [
  { id: "Salary", label: "Salary", icon: Briefcase, color: "text-emerald-400 bg-emerald-500/10" },
  { id: "Freelance", label: "Freelance", icon: Laptop, color: "text-blue-400 bg-blue-500/10" },
  { id: "Business", label: "Business", icon: Building, color: "text-violet-400 bg-violet-500/10" },
  { id: "Investment", label: "Investment", icon: LineChart, color: "text-amber-400 bg-amber-500/10" },
  { id: "Gift", label: "Gift", icon: Gift, color: "text-pink-400 bg-pink-500/10" },
  { id: "Rental", label: "Rental", icon: HomeIcon, color: "text-cyan-400 bg-cyan-500/10" },
  { id: "Other", label: "Other", icon: Banknote, color: "text-slate-400 bg-slate-500/10" },
];

const SOURCE_ICONS = {
  Salary: Briefcase,
  Freelance: Laptop,
  Business: Building,
  Investment: LineChart,
  Gift: Gift,
  Rental: HomeIcon,
  Other: Banknote,
};

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

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

  const handleQuickAddAmount = (preset) => {
    const current = parseFloat(form.amount) || 0;
    setForm({ ...form, amount: (current + preset).toString() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0) {
      showToast("Please enter a valid title and amount", "error");
      return;
    }
    setFormLoading(true);
    try {
      await addIncome({ ...form, amount: Number(form.amount) });
      showToast("Income added successfully! 💵", "success");
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
      showToast("Income record deleted", "success");
    } catch {
      showToast("Failed to delete income record", "error");
    }
  };

  // Source breakdown
  const sourceBreakdown = income.reduce((acc, i) => {
    acc[i.source] = (acc[i.source] || 0) + i.amount;
    return acc;
  }, {});

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 selection:bg-emerald-500 selection:text-white flex flex-col items-center">
      <div className="w-full max-w-[1500px] mx-auto flex flex-col gap-5">
        
        {/* Page Header Bar (UNWRAPPED) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-1">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Income & Cashflow</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100">
              Income <span className="text-emerald-400">Tracker</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Track salary, freelance payouts, investments, and passive cashflow with precision.
            </p>
          </div>

          {/* Total & Breakdown Chips */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="bg-slate-950 rounded-md p-4 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Income Recorded</span>
              <span className="text-2xl font-extrabold text-emerald-400 tracking-tight">{formatCurrency(totalIncome)}</span>
            </div>

            {Object.keys(sourceBreakdown).length > 0 && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-950 p-3 rounded-md overflow-x-auto max-w-md">
                {Object.entries(sourceBreakdown).slice(0, 3).map(([source, amt]) => {
                  const SrcIcon = SOURCE_ICONS[source] || Banknote;
                  return (
                    <div key={source} className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 shrink-0">
                      <SrcIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 block leading-tight">{source}</span>
                        <span className="text-xs font-bold text-slate-200">{formatCurrency(amt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Column 1: Add Income Form (5 Columns) */}
          <div className="lg:col-span-5 bg-slate-900 rounded-lg p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <h2 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800/40 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                Record New Income
              </span>
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Income Title <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">e.g. March Salary, Client Payout</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    name="title"
                    className="input-field input-field-icon"
                    placeholder="Enter income title..."
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                  <Tag className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none z-10" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Amount (₹) <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Click quick presets below</span>
                </div>
                <div className="relative mb-2.5 flex items-center">
                  <span className="absolute left-3.5 text-slate-400 font-extrabold text-base pointer-events-none z-10">₹</span>
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-field input-field-icon font-extrabold text-base text-emerald-400"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Quick Add Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Add:</span>
                  {QUICK_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleQuickAddAmount(preset)}
                      className="px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      +₹{preset.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Income Source
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INCOME_SOURCES.map((src) => {
                    const SrcIcon = src.icon;
                    const isSelected = form.source === src.id;

                    return (
                      <button
                        key={src.id}
                        type="button"
                        onClick={() => setForm({ ...form, source: src.id })}
                        className={`p-2.5 rounded-md flex items-center gap-2 transition-all cursor-pointer text-left ${
                          isSelected
                            ? "bg-emerald-600 text-white font-bold shadow-md"
                            : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-white/20 text-white" : src.color
                        }`}>
                          <SrcIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold truncate">{src.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Date Received
                </label>
                <div className="relative flex items-center">
                  <input
                    name="date"
                    type="date"
                    className="input-field input-field-icon"
                    value={form.date}
                    onChange={handleChange}
                    style={{ colorScheme: "dark" }}
                  />
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none z-10" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Notes / Description <span className="text-slate-500 font-normal lowercase">(Optional)</span>
                </label>
                <textarea
                  name="note"
                  className="input-field"
                  placeholder="e.g. Received via bank transfer..."
                  value={form.note}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
              >
                {formLoading ? (
                  <span>Saving Income...</span>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Save & Record Income</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Column 2: Income History List (7 Columns) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-lg p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Income History</span>
                <span className="text-xs text-slate-400 font-normal">({income.length} records)</span>
              </h2>
              <span className="text-xs font-mono text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-md">
                LATEST CASHFLOW
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500 text-xs font-semibold">Loading income records...</div>
            ) : income.length === 0 ? (
              <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <Banknote className="w-10 h-10 text-slate-700" />
                <p className="text-sm font-semibold text-slate-400">No income records found</p>
                <p className="text-xs text-slate-500">Log your salary or freelance income to start tracking.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {income.map((item, i) => {
                  const SrcIcon = SOURCE_ICONS[item.source] || Banknote;
                  return (
                    <div
                      key={item._id || i}
                      className="p-4 rounded-md bg-slate-950 flex items-center justify-between transition-all gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                          <SrcIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-100 truncate">{item.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                            <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 font-semibold text-[11px]">
                              {item.source}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[11px]">
                              {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          {item.note && (
                            <p className="text-xs text-slate-500 italic mt-1 truncate">"{item.note}"</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-extrabold text-emerald-400">
                          +{formatCurrency(item.amount)}
                        </span>
                        <button
                          onClick={() => setDeleteConfirm(item._id)}
                          className="p-2 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete income"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Delete Modal */}
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
              <h3 className="text-base font-bold text-slate-100">Delete Income Record?</h3>
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

export default Income;
