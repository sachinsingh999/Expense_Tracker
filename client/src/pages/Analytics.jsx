import React, { useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from "recharts";
import { useExpense } from "../context/ExpenseContext";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Calendar,
  Zap,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Wallet
} from "lucide-react";

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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 rounded-md p-3 text-xs shadow-2xl text-left border-none">
        {label && <p className="text-slate-400 font-bold mb-1.5">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} className="font-semibold flex items-center justify-between gap-4" style={{ color: p.fill || p.stroke }}>
            <span>{p.name}:</span>
            <span>{formatCurrency(p.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { expenses, income, fetchExpenses, fetchIncome } = useExpense();

  useEffect(() => {
    fetchExpenses();
    fetchIncome();
  }, [fetchExpenses, fetchIncome]);

  // Monthly expense data (last 6 months)
  const monthlyData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth();
      const y = d.getFullYear();
      const monthExp = expenses
        .filter((e) => { const ed = new Date(e.date); return ed.getMonth() === m && ed.getFullYear() === y; })
        .reduce((s, e) => s + e.amount, 0);
      const monthInc = income
        .filter((e) => { const ed = new Date(e.date); return ed.getMonth() === m && ed.getFullYear() === y; })
        .reduce((s, e) => s + e.amount, 0);
      data.push({ label: MONTHS[m], expenses: monthExp, income: monthInc, savings: Math.max(0, monthInc - monthExp) });
    }
    return data;
  }, [expenses, income]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Top spending days of the week
  const weekdayData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const totals = Array(7).fill(0);
    expenses.forEach((e) => {
      totals[new Date(e.date).getDay()] += e.amount;
    });
    return days.map((label, i) => ({ label, total: totals[i] }));
  }, [expenses]);

  // Key metrics
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const totalInc = income.reduce((s, i) => s + i.amount, 0);
  const avgPerTransaction = expenses.length > 0 ? totalExp / expenses.length : 0;
  const highestExpense = expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0;
  const topCategory = categoryData[0]?.name || "N/A";
  const savingsRate = totalInc > 0 ? ((totalInc - totalExp) / totalInc) * 100 : 0;

  const metrics = [
    { label: "Total Expenses", value: formatCurrency(totalExp), icon: TrendingDown, color: "text-rose-400 bg-rose-500/10" },
    { label: "Total Income", value: formatCurrency(totalInc), icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Net Savings", value: formatCurrency(Math.max(0, totalInc - totalExp)), icon: Wallet, color: "text-violet-400 bg-violet-500/10" },
    { label: "Avg / Transaction", value: formatCurrency(avgPerTransaction.toFixed(0)), icon: Zap, color: "text-amber-400 bg-amber-500/10" },
    { label: "Highest Expense", value: formatCurrency(highestExpense), icon: ArrowUpRight, color: "text-pink-400 bg-pink-500/10" },
    { label: "Savings Rate", value: `${savingsRate.toFixed(1)}%`, icon: Percent, color: "text-cyan-400 bg-cyan-500/10" },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 selection:bg-violet-500 selection:text-white flex flex-col items-center">
      <div className="w-full max-w-[1500px] mx-auto flex flex-col gap-5">
        
        {/* Page Header Bar (UNWRAPPED) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-violet-500/10 text-violet-400 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Financial Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100">
              Financial <span className="text-violet-400">Analytics</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Comprehensive velocity metrics, category distributions, and monthly trends.
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="bg-slate-900 rounded-md p-4 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{m.label}</span>
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center ${m.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-lg font-extrabold text-slate-100 tracking-tight">{m.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Monthly Comparison Bar Chart (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-md p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center justify-between pb-3 border-b border-slate-800/40">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                Monthly Cashflow (Last 6 Months)
              </span>
            </h2>
            {expenses.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs font-semibold">No transaction data logged yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "0.75rem" }} />
                  <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Spending Category Donut Chart (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 rounded-md p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center justify-between pb-3 border-b border-slate-800/40">
              <span className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-violet-400" />
                Category Distribution
              </span>
            </h2>
            {categoryData.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs font-semibold">No category data logged yet</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={CATEGORY_COLORS[entry.name] || "#94a3b8"} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/40 text-xs">
                  {categoryData.slice(0, 4).map((entry, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CATEGORY_COLORS[entry.name] || "#94a3b8" }} />
                        <span className="text-slate-300 font-medium">{entry.name}</span>
                      </div>
                      <span className="text-slate-100 font-bold">{formatCurrency(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Income vs Expense Velocity Area Chart (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-md p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center justify-between pb-3 border-b border-slate-800/40">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Income vs Expense Velocity Trend
              </span>
            </h2>
            {expenses.length === 0 && income.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs font-semibold">No data logged yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={monthlyData} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "0.75rem" }} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" fillOpacity={1} fill="url(#incGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" fillOpacity={1} fill="url(#expGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Weekday Spending Distribution (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 rounded-md p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center justify-between pb-3 border-b border-slate-800/40">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                Spending by Day of Week
              </span>
            </h2>
            {expenses.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs font-semibold">No weekday data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={weekdayData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" name="Spending" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Spending Insight Banner */}
        {categoryData.length > 0 && (
          <div className="bg-slate-900 rounded-md p-5 shadow-xl flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-md bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">Smart Spending Insight</p>
              <p className="text-xs text-slate-300 mt-0.5">
                Your highest expense category is <strong className="text-slate-100 font-bold">{topCategory}</strong> at{" "}
                <strong className="text-rose-400 font-bold">{formatCurrency(categoryData[0]?.value || 0)}</strong> — accounting for{" "}
                <strong className="text-slate-100">{((categoryData[0]?.value / totalExp) * 100).toFixed(0)}%</strong> of your total logged expenses.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Analytics;
