import React, { useState, useEffect } from "react";
import { useExpense } from "../context/ExpenseContext";
import { showToast } from "../components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  PlusCircle,
  TrendingUp,
  Award,
  CheckCircle2,
  Trash2,
  Edit3,
  DollarSign,
  Calendar,
  Sparkles,
  Shield,
  Plane,
  Car,
  Home,
  Laptop,
  PiggyBank,
  X
} from "lucide-react";

const PRESET_GOALS = [
  { title: "Emergency Fund", target: 100000, current: 45000, icon: Shield, category: "Emergency" },
  { title: "MacBook Pro M3", target: 200000, current: 120000, icon: Laptop, category: "Gadgets" },
  { title: "Europe Summer Trip", target: 150000, current: 65000, icon: Plane, category: "Travel" },
  { title: "New EV Car Downpayment", target: 300000, current: 180000, icon: Car, category: "Vehicle" },
];

const GOAL_ICONS = {
  Emergency: Shield,
  Gadgets: Laptop,
  Travel: Plane,
  Vehicle: Car,
  Housing: Home,
  Savings: PiggyBank,
};

const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const Goals = () => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("user_financial_goals");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return PRESET_GOALS;
      }
    }
    return PRESET_GOALS;
  });

  const [showModal, setShowModal] = useState(false);
  const [addFundsModal, setAddFundsModal] = useState(null);
  const [fundAmount, setFundAmount] = useState("");
  const [form, setForm] = useState({
    title: "",
    target: "",
    current: "",
    category: "Savings",
    targetDate: "",
  });

  useEffect(() => {
    localStorage.setItem("user_financial_goals", JSON.stringify(goals));
  }, [goals]);

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.target || Number(form.target) <= 0) {
      showToast("Please enter a valid goal title and target amount", "error");
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      title: form.title,
      target: Number(form.target),
      current: Number(form.current) || 0,
      category: form.category || "Savings",
      targetDate: form.targetDate || "",
    };

    setGoals([newGoal, ...goals]);
    setShowModal(false);
    setForm({ title: "", target: "", current: "", category: "Savings", targetDate: "" });
    showToast("Financial Goal created! 🎯", "success");
  };

  const handleAddFunds = (e) => {
    e.preventDefault();
    if (!fundAmount || Number(fundAmount) <= 0) {
      showToast("Enter a valid deposit amount", "error");
      return;
    }

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === addFundsModal.id || g.title === addFundsModal.title) {
          return { ...g, current: Math.min(g.target, g.current + Number(fundAmount)) };
        }
        return g;
      })
    );

    setAddFundsModal(null);
    setFundAmount("");
    showToast("Funds added to goal! 💰", "success");
  };

  const handleDeleteGoal = (targetGoal) => {
    setGoals((prev) => prev.filter((g) => (g.id ? g.id !== targetGoal.id : g.title !== targetGoal.title)));
    showToast("Goal removed", "success");
  };

  const totalTargetAmount = goals.reduce((s, g) => s + g.target, 0);
  const totalSavedAmount = goals.reduce((s, g) => s + g.current, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalSavedAmount / totalTargetAmount) * 100 : 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 selection:bg-violet-500 selection:text-white flex flex-col items-center">
      <div className="w-full max-w-[1500px] mx-auto flex flex-col gap-5">
        
        {/* Page Header Bar (UNWRAPPED) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-1">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-violet-500/10 text-violet-400 text-xs font-semibold mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>Savings Targets</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100">
              Financial <span className="text-violet-400">Goals</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Set milestones for emergency funds, dream vacations, and major investments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="bg-slate-950 rounded-md p-4 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Savings Progress</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-extrabold text-violet-400 tracking-tight">{formatCurrency(totalSavedAmount)}</span>
                <span className="text-xs text-slate-400 font-mono">/ {formatCurrency(totalTargetAmount)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Goal</span>
            </button>
          </div>
        </div>

        {/* Master Overall Progress Bar */}
        <div className="bg-slate-900 rounded-md p-4 shadow-xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-violet-400" />
              Total Portfolio Goal Completion
            </span>
            <span className="text-violet-400 font-mono font-bold text-sm">
              {overallProgress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, overallProgress)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-violet-600 rounded-full"
            />
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {goals.map((g, i) => {
            const IconComp = GOAL_ICONS[g.category] || Target;
            const pct = g.target > 0 ? (g.current / g.target) * 100 : 0;
            const remaining = Math.max(0, g.target - g.current);
            const isCompleted = g.current >= g.target;

            return (
              <motion.div
                key={g.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-slate-900 rounded-md p-5 shadow-xl flex flex-col justify-between gap-4 relative overflow-hidden border-none"
              >
                {/* Top Row: Icon + Title + Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                      isCompleted ? "bg-emerald-500/10 text-emerald-400" : "bg-violet-500/10 text-violet-400"
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <span>{g.title}</span>
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-semibold text-[10px] uppercase tracking-wider inline-block mt-0.5">
                        {g.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteGoal(g)}
                    className="p-1.5 rounded-md bg-slate-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove Goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Amount Details */}
                <div className="flex items-baseline justify-between pt-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Current Savings</span>
                    <span className="text-lg font-extrabold text-slate-100">{formatCurrency(g.current)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Target Goal</span>
                    <span className="text-sm font-bold text-violet-400">{formatCurrency(g.target)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">
                      {isCompleted ? "Goal Reached! 🎉" : `${formatCurrency(remaining)} remaining`}
                    </span>
                    <span className="font-mono font-bold text-violet-400">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, pct)}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${
                        isCompleted
                          ? "bg-emerald-400"
                          : "bg-violet-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Add Funds CTA */}
                <button
                  onClick={() => setAddFundsModal(g)}
                  disabled={isCompleted}
                  className={`w-full py-2.5 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1 ${
                    isCompleted
                      ? "bg-emerald-500/10 text-emerald-400 cursor-default"
                      : "bg-violet-600 hover:bg-violet-500 text-white shadow-md"
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Target Goal Completed</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-3.5 h-3.5 text-white" />
                      <span>+ Add Funds to Goal</span>
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Create Goal Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-slate-900 rounded-lg p-6 w-full max-w-md shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-violet-400" />
                <span>Create New Financial Goal</span>
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded bg-slate-950 text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="flex flex-col gap-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Goal Title *</label>
                <input
                  className="input-field"
                  placeholder="e.g. New Macbook, House Deposit"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    className="input-field font-bold text-violet-300"
                    placeholder="100000"
                    value={form.target}
                    onChange={(e) => setForm({ ...form, target: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Initial Saved (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="0"
                    value={form.current}
                    onChange={(e) => setForm({ ...form, current: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  className="input-field"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="Savings">Savings</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Gadgets">Gadgets</option>
                  <option value="Travel">Travel</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Housing">Housing</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {addFundsModal && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setAddFundsModal(null); }}
        >
          <div className="bg-slate-900 rounded-lg p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-emerald-400" />
                <span>Add Funds: {addFundsModal.title}</span>
              </h3>
              <button onClick={() => setAddFundsModal(null)} className="p-1 rounded bg-slate-950 text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFunds} className="flex flex-col gap-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Deposit Amount (₹) *</label>
                <input
                  type="number"
                  min="1"
                  className="input-field font-extrabold text-emerald-400 text-base"
                  placeholder="5000"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddFundsModal(null)}
                  className="px-4 py-2 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Deposit Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
