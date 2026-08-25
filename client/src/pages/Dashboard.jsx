import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  ReceiptText,
  PlusCircle,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  CreditCard,
  Utensils,
  Car,
  ShoppingBag,
  FileText,
  Film,
  Stethoscope,
  GraduationCap,
  Plane,
  Package,
  ShieldCheck,
  CheckCircle2,
  Lightbulb
} from "lucide-react";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";

const CATEGORY_COLORS = {
  Food: "#fb923c",
  Transport: "#60a5fa",
  Shopping: "#f472b6",
  Bills: "#f87171",
  Entertainment: "#a78bfa",
  Health: "#34d399",
  Education: "#fbbf24",
  Travel: "#22d3ee",
  Other: "#94a3b8",
};

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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 rounded-md p-3 text-xs shadow-2xl border-none">
        <p className="text-slate-400 mb-1 font-semibold">{payload[0].name}</p>
        <p className="text-slate-100 font-extrabold text-sm">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { expenses, income, fetchExpenses, fetchIncome, totalExpenses, totalIncome, netSavings, monthlyExpenses } = useExpense();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
    fetchIncome();
  }, [fetchExpenses, fetchIncome]);

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  // Last 7 days trend
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-IN", { weekday: "short" });
      const dateStr = d.toDateString();
      const total = expenses
        .filter((e) => new Date(e.date).toDateString() === dateStr)
        .reduce((s, e) => s + e.amount, 0);
      days.push({ label, total });
    }
    return days;
  }, [expenses]);

  const recentExpenses = [...expenses].slice(0, 5);

  // Budget calculations
  const budget = user?.monthlyBudget || 0;
  const budgetUsed = budget > 0 ? Math.min((monthlyExpenses / budget) * 100, 100) : 0;
  const remainingBudget = Math.max(0, budget - monthlyExpenses);

  const budgetColor =
    budgetUsed > 85
      ? "text-rose-400 bg-rose-500/10"
      : budgetUsed > 60
      ? "text-amber-400 bg-amber-500/10"
      : "text-emerald-400 bg-emerald-500/10";

  const currentMonthIncome = income
    .filter((i) => {
      const d = new Date(i.date);
      return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
    })
    .reduce((s, i) => s + i.amount, 0);

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 selection:bg-violet-500 selection:text-white flex flex-col items-center">
      <div className="w-full max-w-[1500px] mx-auto flex flex-col gap-5 sm:gap-6">

        {/* UNIFIED MASTER CARD (HEADER & 4 METRICS COMBINED) */}
        <div className="bg-slate-900 rounded-md p-5 sm:p-7 shadow-xl flex flex-col gap-6">
          
          {/* Top Row: Greeting & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider bg-violet-500/10 px-2.5 py-0.5 rounded">
                  Dashboard Overview
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100">
                {greetingTime()}, <span className="text-violet-400">{user?.name?.split(" ")[0]}</span> 👋
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Here is your real-time financial summary and cashflow velocity.
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={() => navigate("/income")}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Log Income</span>
              </button>
              <button
                onClick={() => navigate("/add-expenses")}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Add Expense</span>
              </button>
            </div>
          </div>

          {/* Divider line */}
          <div className="border-t border-slate-800/40" />

          {/* 4 STAT METRICS GRID INSIDE UNIFIED MASTER CARD */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            {/* Stat 1: Total Expenses */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="p-4 rounded-md bg-slate-950 flex flex-col justify-between shadow-sm relative group transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Expenses</span>
                <div className="w-7 h-7 rounded-md bg-rose-500/10 flex items-center justify-center text-rose-400">
                  <ReceiptText className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 tracking-tight">
                  {formatCurrency(totalExpenses)}
                </h2>
                <p className="text-[10px] text-slate-400 mt-1 font-medium truncate">
                  {expenses.length} transaction(s) logged
                </p>
              </div>
            </motion.div>

            {/* Stat 2: Monthly Expenses */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="p-4 rounded-md bg-slate-950 flex flex-col justify-between shadow-sm relative group transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">This Month</span>
                <div className="w-7 h-7 rounded-md bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 tracking-tight">
                  {formatCurrency(monthlyExpenses)}
                </h2>
                <p className="text-[10px] text-slate-400 mt-1 font-medium truncate">
                  {budget > 0 ? `Cap: ${formatCurrency(budget)}` : "No budget set"}
                </p>
              </div>
            </motion.div>

            {/* Stat 3: Total Income */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className="p-4 rounded-md bg-slate-950 flex flex-col justify-between shadow-sm relative group transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Income</span>
                <div className="w-7 h-7 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-emerald-400 tracking-tight">
                  {formatCurrency(totalIncome)}
                </h2>
                <p className="text-[10px] text-slate-400 mt-1 font-medium truncate">
                  Monthly: {formatCurrency(currentMonthIncome)}
                </p>
              </div>
            </motion.div>

            {/* Stat 4: Net Cashflow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
              className="p-4 rounded-md bg-slate-950 flex flex-col justify-between shadow-sm relative group transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Cashflow</span>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                  netSavings >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                }`}>
                  <Wallet className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h2 className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                  netSavings >= 0 ? "text-slate-100" : "text-rose-400"
                }`}>
                  {formatCurrency(Math.abs(netSavings))}
                </h2>
                <p className={`text-[10px] font-semibold mt-1 truncate ${
                  netSavings >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {netSavings >= 0 ? "✓ Positive Cashflow" : "⚠️ Deficit: High Expenses"}
                </p>
              </div>
            </motion.div>

          </div>

        </div>

        {/* 2. BUDGET PROGRESS BAR (If user set budget) */}
        {budget > 0 && (
          <div className="p-5 sm:p-6 rounded-md bg-slate-900 flex flex-col gap-3 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-violet-400" />
                <span className="text-xs sm:text-sm font-bold text-slate-100">Monthly Budget Cap</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${budgetColor}`}>
                  {budgetUsed.toFixed(1)}% Spent
                </span>
                <button
                  onClick={() => navigate("/settings")}
                  className="text-xs text-slate-400 hover:text-violet-400 cursor-pointer underline transition-colors"
                >
                  Edit Cap
                </button>
              </div>
            </div>

            <div className="w-full bg-slate-950 rounded-sm h-2.5 overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${budgetUsed}%` }}
                transition={{ duration: 0.8 }}
                className={`h-full rounded-sm ${
                  budgetUsed > 85 ? "bg-rose-500" : budgetUsed > 60 ? "bg-amber-500" : "bg-violet-600"
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{formatCurrency(monthlyExpenses)} spent</span>
              <span>Remaining: <strong className="text-emerald-400">{formatCurrency(remainingBudget)}</strong></span>
            </div>

            {budgetUsed > 85 && (
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mt-1 p-2.5 rounded bg-rose-500/10">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Alert: You have consumed over 85% of your monthly budget limit!</span>
              </div>
            )}
          </div>
        )}

        {/* 3. CHARTS SECTION (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Category Donut Chart (5 Columns) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-md bg-slate-900 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/40">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                Spending by Category
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">{categoryData.length} categories</span>
            </div>

            {categoryData.length === 0 ? (
              <div className="py-14 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <ReceiptText className="w-8 h-8 text-slate-700" />
                <p className="text-xs font-semibold text-slate-400">No expenses recorded yet</p>
                <p className="text-[11px] text-slate-500">Log an expense to see category breakdown.</p>
              </div>
            ) : (
              <>
                <div className="relative flex items-center justify-center my-2 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={78}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={index} fill={CATEGORY_COLORS[entry.name] || "#94a3b8"} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Total Spent</span>
                    <span className="text-sm font-extrabold text-slate-100">{formatCurrency(totalExpenses)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/40 text-xs">
                  {categoryData.slice(0, 6).map((entry, i) => (
                    <div key={i} className="flex items-center justify-between p-1.5 rounded bg-slate-950">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[entry.name] || "#94a3b8" }}
                        />
                        <span className="text-slate-300 font-medium truncate text-[11px]">{entry.name}</span>
                      </div>
                      <span className="text-slate-100 font-bold text-[11px] ml-1">{formatCurrency(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 7-Day Spending Area Chart (7 Columns) */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-md bg-slate-900 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/40">
              <div>
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  7-Day Spending Velocity
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Daily expense totals over the past week</p>
              </div>
              <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded">
                Weekly Trend
              </span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7Days} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={45}
                    tickFormatter={(v) => (v > 0 ? `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}` : "₹0")}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Spending"
                    stroke="#8b5cf6"
                    fill="url(#areaGrad)"
                    strokeWidth={2}
                    dot={{ fill: "#a78bfa", r: 3.5, stroke: "#020617", strokeWidth: 1.5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* 4. RECENT TRANSACTIONS & QUICK SHORTCUTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Recent Transactions List (8 Columns) */}
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-md bg-slate-900 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/40">
              <h2 className="text-sm font-bold text-slate-100">Recent Transactions</h2>
              <button
                onClick={() => navigate("/my-expenses")}
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentExpenses.length === 0 ? (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <CreditCard className="w-8 h-8 text-slate-700" />
                <p className="text-xs font-semibold text-slate-400">No recent transactions logged</p>
                <button
                  onClick={() => navigate("/add-expenses")}
                  className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all cursor-pointer mt-1"
                >
                  Log First Expense
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {recentExpenses.map((e, i) => {
                  const IconComp = CATEGORY_ICONS[e.category] || Package;
                  return (
                    <div
                      key={e._id || i}
                      className="p-3 rounded-md bg-slate-950 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-md bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-100 truncate">{e.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            {e.paymentMode ? ` • ${e.paymentMode}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right shrink-0">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-400 hidden sm:inline-block">
                          {e.category}
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-rose-400">
                          -{formatCurrency(e.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Shortcuts (4 Columns) */}
          <div className="lg:col-span-4 p-5 sm:p-6 rounded-md bg-slate-900 flex flex-col justify-between shadow-xl">
            <h2 className="text-sm font-bold text-slate-100 mb-4 pb-3 border-b border-slate-800/40">
              Quick Shortcuts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {[
                { label: "Log New Expense", desc: "Add cash/card transaction", icon: PlusCircle, route: "/add-expenses", color: "text-violet-400 bg-violet-500/10" },
                { label: "Track Income", desc: "Record salary/freelance", icon: TrendingUp, route: "/income", color: "text-emerald-400 bg-emerald-500/10" },
                { label: "Analytics Hub", desc: "View category distributions", icon: BarChart3, route: "/analytics", color: "text-indigo-400 bg-indigo-500/10" },
                { label: "Set Monthly Budget", desc: "Manage spending caps", icon: Target, route: "/settings", color: "text-amber-400 bg-amber-500/10" },
              ].map((shortcut, i) => {
                const IconComp = shortcut.icon;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(shortcut.route)}
                    className="p-3 rounded-md bg-slate-950 hover:bg-slate-800 flex items-center gap-3 transition-all text-left cursor-pointer group"
                  >
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${shortcut.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-violet-300 transition-colors truncate">
                        {shortcut.label}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{shortcut.desc}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
