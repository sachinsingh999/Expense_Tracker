import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, Sparkles, RefreshCw, Zap } from "lucide-react";

const initialTransactions = [
  { id: 1, name: "Monthly Salary", amount: 65000, type: "income", category: "Salary", date: "Today" },
  { id: 2, name: "Grocery Shopping", amount: 3450, type: "expense", category: "Food & Grocery", date: "Today" },
  { id: 3, name: "Electricity Bill", amount: 1820, type: "expense", category: "Utilities", date: "Yesterday" },
  { id: 4, name: "Freelance Design", amount: 12000, type: "income", category: "Freelance", date: "2 days ago" },
];

const presets = [
  { name: "Coffee with Team", amount: 350, type: "expense", category: "Food & Dining" },
  { name: "Quarterly Bonus", amount: 15000, type: "income", category: "Bonus" },
  { name: "Weekend Shopping", amount: 4200, type: "expense", category: "Shopping" },
  { name: "Gym Membership", amount: 1500, type: "expense", category: "Health & Fitness" }
];

export const ExpenseSimulator = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [nameInput, setNameInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [typeInput, setTypeInput] = useState("expense");
  const [categoryInput, setCategoryInput] = useState("Food & Dining");

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  const handleAdd = (e) => {
    e?.preventDefault();
    if (!nameInput || !amountInput || isNaN(amountInput) || Number(amountInput) <= 0) return;

    const newTx = {
      id: Date.now(),
      name: nameInput,
      amount: parseFloat(amountInput),
      type: typeInput,
      category: categoryInput,
      date: "Just now"
    };

    setTransactions([newTx, ...transactions]);
    setNameInput("");
    setAmountInput("");
  };

  const handleQuickAdd = (preset) => {
    const newTx = {
      id: Date.now(),
      name: preset.name,
      amount: preset.amount,
      type: preset.type,
      category: preset.category,
      date: "Just now"
    };
    setTransactions([newTx, ...transactions]);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleReset = () => {
    setTransactions(initialTransactions);
  };

  return (
    <section className="py-20 px-6 sm:px-12 lg:px-24 bg-slate-950/60 border-y border-slate-900 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Try It Live • No Signup Needed</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight"
          >
            Interactive Financial Sandbox
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed"
          >
            Add sample transactions below or click quick presets to test how Finora updates your balance, calculations, and budget metrics in real-time.
          </motion.p>
        </div>

        {/* Sandbox Simulator Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form & Quick Add Presets (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-lg p-6 sm:p-8 flex flex-col gap-6 shadow-2xl"
          >
            <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Add Live Test Entry
              </h3>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-violet-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset to default sample items"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Sandbox
              </button>
            </div>

            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Transaction Title</label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy Food Order, Freelance Payment"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1250"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-md bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Type</label>
                  <select
                    value={typeInput}
                    onChange={(e) => setTypeInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-md bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                  >
                    <option value="expense">Expense (-)</option>
                    <option value="income">Income (+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Salary">Salary</option>
                  <option value="Utilities">Utilities & Bills</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Freelance">Freelance / Side Gig</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 border border-violet-400/30"
              >
                <Plus className="w-4 h-4" />
                Add To Sandbox
              </button>
            </form>

            {/* Quick Presets */}
            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 block mb-3">Quick Presets (Click to Add):</span>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAdd(preset)}
                    className="px-3 py-1.5 rounded-sm bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-violet-400" />
                    <span>{preset.name}</span>
                    <span className={`text-[10px] font-bold ${preset.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                      ({preset.type === "income" ? "+" : "-"}₹{preset.amount.toLocaleString("en-IN")})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Live Dashboard Preview Output (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-md bg-slate-900/60 border border-slate-800/80 flex flex-col">
                <span className="text-xs font-semibold text-slate-400 mb-1">Total Net Balance</span>
                <motion.span
                  key={netBalance}
                  initial={{ scale: 1.1, color: "#a78bfa" }}
                  animate={{ scale: 1, color: netBalance >= 0 ? "#f8fafc" : "#f43f5e" }}
                  className="text-2xl font-extrabold"
                >
                  ₹{netBalance.toLocaleString("en-IN")}
                </motion.span>
                <span className="text-[10px] text-slate-400 mt-2">Calculated in real-time</span>
              </div>

              <div className="p-5 rounded-md bg-slate-900/60 border border-slate-800/80 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-400">Total Income</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-2xl font-extrabold text-emerald-400">
                  ₹{totalIncome.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-slate-400 mt-2">{transactions.filter(t => t.type === 'income').length} income source(s)</span>
              </div>

              <div className="p-5 rounded-md bg-slate-900/60 border border-slate-800/80 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-400">Total Expenses</span>
                  <ArrowDownRight className="w-4 h-4 text-rose-400" />
                </div>
                <span className="text-2xl font-extrabold text-rose-400">
                  ₹{totalExpense.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-slate-400 mt-2">Savings Rate: <strong className="text-indigo-400">{savingsRate}%</strong></span>
              </div>
            </div>

            {/* Income vs Expense Ratio Progress Bar */}
            <div className="p-5 rounded-md bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-300">Income vs Expense Usage</span>
                <span className="text-slate-400">
                  {totalIncome > 0 ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : 0}% Spent
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-sm h-3 overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${totalIncome > 0 ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : 0}%`
                  }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-sm bg-gradient-to-r from-violet-500 via-indigo-500 to-rose-500"
                />
              </div>
            </div>

            {/* Live Feed List */}
            <div className="p-6 rounded-lg bg-slate-900/60 border border-slate-800/80 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Live Feed ({transactions.length} items)
                </h4>
                <span className="text-xs text-slate-400">Click icon to delete item</span>
              </div>

              <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {transactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="p-3.5 rounded-md bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 ${
                          tx.type === "income" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {tx.type === "income" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-100">{tx.name}</p>
                          <p className="text-xs text-slate-400">{tx.category} • <span className="text-slate-500">{tx.date}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-bold ${tx.type === "income" ? "text-emerald-400" : "text-slate-200"}`}>
                          {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-sm hover:bg-rose-500/10 cursor-pointer"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
