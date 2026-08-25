import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import { showToast } from "../components/Toast";
import { motion } from "framer-motion";
import {
  PlusCircle,
  ArrowLeft,
  ReceiptText,
  Utensils,
  Car,
  ShoppingBag,
  FileText,
  Film,
  Stethoscope,
  GraduationCap,
  Plane,
  Package,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  Calendar,
  Sparkles,
  CheckCircle2,
  Tag,
  Wallet
} from "lucide-react";

const CATEGORIES = [
  { id: "Food", label: "Food", icon: Utensils, color: "text-amber-400 bg-amber-500/10" },
  { id: "Transport", label: "Transport", icon: Car, color: "text-blue-400 bg-blue-500/10" },
  { id: "Shopping", label: "Shopping", icon: ShoppingBag, color: "text-pink-400 bg-pink-500/10" },
  { id: "Bills", label: "Bills", icon: FileText, color: "text-rose-400 bg-rose-500/10" },
  { id: "Entertainment", label: "Entertainment", icon: Film, color: "text-violet-400 bg-violet-500/10" },
  { id: "Health", label: "Health", icon: Stethoscope, color: "text-emerald-400 bg-emerald-500/10" },
  { id: "Education", label: "Education", icon: GraduationCap, color: "text-yellow-400 bg-yellow-500/10" },
  { id: "Travel", label: "Travel", icon: Plane, color: "text-cyan-400 bg-cyan-500/10" },
  { id: "Other", label: "Other", icon: Package, color: "text-slate-400 bg-slate-500/10" },
];

const PAYMENT_MODES = [
  { id: "Cash", label: "Cash", icon: Banknote },
  { id: "Card", label: "Card", icon: CreditCard },
  { id: "UPI", label: "UPI", icon: Smartphone },
  { id: "NetBanking", label: "Net Banking", icon: Landmark },
  { id: "Other", label: "Other", icon: Package },
];

const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000];

const AddExpense = () => {
  const navigate = useNavigate();
  const { addExpense } = useExpense();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    note: "",
    paymentMode: "UPI",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuickAddAmount = (preset) => {
    const current = parseFloat(form.amount) || 0;
    setForm({ ...form, amount: (current + preset).toString() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0 || !form.category) {
      showToast("Please fill in a valid title, amount, and category", "error");
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
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        note: "",
        paymentMode: "UPI",
      });
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add expense", "error");
    } finally {
      setLoading(false);
    }
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === form.category) || CATEGORIES[0];
  const activePaymentObj = PAYMENT_MODES.find((p) => p.id === form.paymentMode) || PAYMENT_MODES[0];
  const CategoryIcon = activeCategoryObj.icon;
  const PaymentIcon = activePaymentObj.icon;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 selection:bg-violet-500 selection:text-white flex flex-col items-center">
      <div className="w-full max-w-[1500px] mx-auto flex flex-col gap-4 sm:gap-5">

        {/* HEADER BAR (UNWRAPPED) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-violet-400 mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100">
              Record New <span className="text-violet-400">Expense</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Log transactions with live summary preview and category tagging.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-md text-xs font-mono text-slate-400 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span>Live Summary</span>
          </div>
        </div>

        {/* 2-COLUMN WIDE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* COLUMN 1: INTERACTIVE FORM (7 COLUMNS) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-md p-5 sm:p-6 shadow-2xl flex flex-col gap-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
              
              {/* Row 1: Title Input */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Expense Title <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-normal">e.g. Swiggy Lunch, Netflix, Uber</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    name="title"
                    type="text"
                    className="input-field input-field-icon"
                    placeholder="Enter what you spent on..."
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                  <Tag className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none z-10" />
                </div>
              </div>

              {/* Row 2: Amount & Quick Add Chips */}
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
                    className="input-field input-field-icon font-extrabold text-base text-violet-300"
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
                      +₹{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Category Selector (Interactive Pills Grid) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Category <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CATEGORIES.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = form.category === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setForm({ ...form, category: cat.id })}
                        className={`p-2.5 rounded-md flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                          isSelected
                            ? "bg-violet-600 text-white font-bold shadow-md"
                            : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-white/20 text-white" : cat.color
                        }`}>
                          <CatIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Payment Mode & Date Picker (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Payment Mode
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                    {PAYMENT_MODES.map((pm) => {
                      const PmIcon = pm.icon;
                      const isSelected = form.paymentMode === pm.id;

                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setForm({ ...form, paymentMode: pm.id })}
                          className={`p-2.5 rounded-md flex items-center gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-violet-600 text-white font-bold shadow-md"
                              : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                          }`}
                        >
                          <PmIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-violet-400"}`} />
                          <span className="text-xs font-semibold truncate">{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Transaction Date
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
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Notes / Description <span className="text-slate-500 font-normal lowercase">(Optional)</span>
                    </label>
                    <textarea
                      name="note"
                      className="input-field"
                      placeholder="Add transaction notes or tags..."
                      value={form.note}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-md flex items-center justify-center gap-2 cursor-pointer font-bold text-sm shadow-xl transition-all mt-1"
              >
                {loading ? (
                  <span>Recording Expense...</span>
                ) : success ? (
                  <span className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Recorded Successfully!
                  </span>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Save & Record Expense</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* COLUMN 2: CLEAN MINIMAL EXPENSE SUMMARY CARD (5 COLUMNS) */}
          <div className="lg:col-span-5 bg-slate-900 rounded-md p-5 sm:p-6 shadow-2xl flex flex-col gap-4 sticky top-20 text-left">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
              <div className="flex items-center gap-2">
                <ReceiptText className="w-4 h-4 text-violet-400" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Expense Summary
                </h3>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
                LIVE
              </span>
            </div>

            {/* Total Amount Box */}
            <div className="p-5 rounded-md bg-slate-950 flex flex-col items-center justify-center text-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                TRANSACTION AMOUNT
              </span>
              <motion.div
                key={form.amount}
                initial={{ scale: 1.03 }}
                animate={{ scale: 1 }}
                className="text-3xl font-extrabold text-rose-400 tracking-tight"
              >
                ₹{form.amount ? Number(form.amount).toLocaleString("en-IN") : "0.00"}
              </motion.div>
            </div>

            {/* Line Items Details */}
            <div className="flex flex-col gap-2 text-xs">
              <div className="p-3 rounded-md bg-slate-950 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Title</span>
                <span className="text-slate-100 font-bold truncate max-w-[190px]">
                  {form.title || "Untitled Expense"}
                </span>
              </div>

              <div className="p-3 rounded-md bg-slate-950 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Category</span>
                <div className="flex items-center gap-2">
                  <CategoryIcon className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-violet-300 font-bold text-xs">{activeCategoryObj.label}</span>
                </div>
              </div>

              <div className="p-3 rounded-md bg-slate-950 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Payment Method</span>
                <div className="flex items-center gap-2">
                  <PaymentIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-slate-200 font-semibold text-xs">{activePaymentObj.label}</span>
                </div>
              </div>

              <div className="p-3 rounded-md bg-slate-950 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Date</span>
                <span className="text-slate-200 font-mono text-xs">
                  {form.date ? new Date(form.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Today"}
                </span>
              </div>

              {form.note && (
                <div className="p-3 rounded-md bg-slate-950 flex flex-col gap-1 text-xs">
                  <span className="text-slate-400 font-medium">Notes</span>
                  <p className="text-slate-300 italic text-xs">"{form.note}"</p>
                </div>
              )}
            </div>

            {/* Smart System Sync Pill */}
            <div className="p-3 rounded-md bg-violet-500/10 text-[11px] text-slate-300 leading-snug flex items-start gap-2.5 mt-1">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
              <span>
                <strong>Instant Sync:</strong> Saving this expense updates your Dashboard totals, category breakdowns, and monthly budget progress in real-time.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AddExpense;
