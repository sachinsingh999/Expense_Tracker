import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  Target,
  Sparkles
} from "lucide-react";

export const InteractiveHeroMockup = () => {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'analytics' | 'goals'

  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      {/* Ambient Backlight behind mockup */}
      <div className="absolute -inset-3 rounded-lg bg-gradient-to-tr from-violet-600/40 via-indigo-500/30 to-emerald-500/30 opacity-40 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="w-full bg-slate-950/85 backdrop-blur-2xl border border-slate-800/80 rounded-lg p-5 shadow-[0_30px_100px_rgba(0,0,0,0.85)] flex flex-col gap-4 text-left"
        >
          {/* Browser Top bar mock & Interactive Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-850/60 gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-[11px] font-mono text-slate-400 hidden sm:inline-block">expensepro.io</span>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-md border border-slate-800/80 text-[11px] font-medium text-slate-400 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-violet-600 text-white font-semibold shadow-sm"
                    : "hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <PieIcon className="w-3 h-3" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-violet-600 text-white font-semibold shadow-sm"
                    : "hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("goals")}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === "goals"
                    ? "bg-violet-600 text-white font-semibold shadow-sm"
                    : "hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Target className="w-3 h-3" />
                Budgets
              </button>
            </div>
          </div>

          {/* TAB CONTENTS */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                {/* Stats Header */}
                <div className="flex items-center justify-between px-1">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Monthly Spending</span>
                    <h3 className="text-2xl font-bold text-slate-100 mt-0.5">₹18,450</h3>
                  </div>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +12% vs last mo
                  </span>
                </div>

                {/* Donut Chart & Progress Split Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-3.5 rounded-md bg-slate-900/40 border border-slate-900/60">
                  {/* SVG Donut */}
                  <div className="relative flex items-center justify-center py-2 w-full h-full">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-800/60" strokeWidth="3.2" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-violet-500" strokeWidth="3.8" strokeDasharray="45, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-emerald-400" strokeWidth="3.8" strokeDasharray="25, 100" strokeDashoffset="-45" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-pink-500" strokeWidth="3.8" strokeDasharray="18, 100" strokeDashoffset="-70" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-300">Spent</span>
                      <span className="text-xs font-black text-slate-100">₹18.4K</span>
                    </div>
                  </div>

                  {/* Legend & Budget Bar */}
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm bg-violet-500" />
                        <span>Food: 45%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm bg-emerald-400" />
                        <span>Bills: 25%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm bg-pink-500" />
                        <span>Shop: 18%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm bg-slate-600" />
                        <span>Other: 12%</span>
                      </div>
                    </div>

                    <div className="mt-1 pt-2 border-t border-slate-800/60">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Limit Usage</span>
                        <span className="text-amber-400 font-semibold">92.2%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-sm h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "92.2%" }}
                          transition={{ duration: 1 }}
                          className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Line graph of trend */}
                <div className="p-3 rounded-md bg-slate-900/40 border border-slate-900/60">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-semibold text-slate-400">Weekly Spending Trend</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                      <TrendingDown className="w-2.5 h-2.5" /> -4.2%
                    </span>
                  </div>
                  <div className="h-14 w-full relative">
                    <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>
                      <path
                        d="M 5 65 C 25 55, 45 45, 65 55 C 85 65, 105 25, 125 35 C 145 45, 165 15, 195 10 L 195 80 L 5 80 Z"
                        fill="url(#heroChartGrad)"
                      />
                      <path
                        d="M 5 65 C 25 55, 45 45, 65 55 C 85 65, 105 25, 125 35 C 145 45, 165 15, 195 10"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2.5"
                      />
                      <circle cx="125" cy="35" r="3" fill="#a78bfa" />
                      <circle cx="195" cy="10" r="3" fill="#a78bfa" />
                    </svg>
                  </div>
                </div>

                {/* Recent activity list */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider px-1">Recent Activity</span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { logo: "🎬", name: "Netflix Subscription", category: "Entertainment", amount: "-₹1,249" },
                      { logo: "🚗", name: "Uber Rides", category: "Transport", amount: "-₹350" },
                    ].map((tx, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-md bg-slate-900/30 border border-slate-900/40 hover:border-slate-800/60 transition-all">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-sm bg-slate-800/80 flex items-center justify-center text-xs">{tx.logo}</span>
                          <div>
                            <p className="text-[11px] font-semibold text-slate-200">{tx.name}</p>
                            <p className="text-[9px] text-slate-400">{tx.category}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-300">{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4 py-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Category Analytics</span>
                    <h3 className="text-xl font-bold text-slate-100 mt-0.5">Top Expenses Breakdown</h3>
                  </div>
                  <span className="text-xs text-violet-400 font-medium bg-violet-500/10 px-2.5 py-1 rounded-md border border-violet-500/20">
                    This Month
                  </span>
                </div>

                {/* Animated Category Bars */}
                <div className="flex flex-col gap-3 p-4 rounded-md bg-slate-900/40 border border-slate-900/60">
                  {[
                    { name: "Food & Dining", amount: "₹8,300", pct: 45, color: "from-violet-500 to-indigo-500" },
                    { name: "Bills & Utilities", amount: "₹4,612", pct: 25, color: "from-emerald-400 to-teal-500" },
                    { name: "Shopping", amount: "₹3,320", pct: 18, color: "from-pink-500 to-rose-500" },
                    { name: "Transport & Fuel", amount: "₹2,218", pct: 12, color: "from-amber-400 to-orange-500" },
                  ].map((cat, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-200">{cat.name}</span>
                        <span className="text-slate-400">{cat.amount} ({cat.pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-800/80 rounded-sm h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.pct}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className={`h-full rounded-sm bg-gradient-to-r ${cat.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Insight Box */}
                <div className="p-3 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 leading-snug">
                    <strong className="text-violet-300">Smart Tip:</strong> You spent 15% less on Food & Dining compared to last week. Great discipline!
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "goals" && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-3 py-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Budget Limits</span>
                    <h3 className="text-xl font-bold text-slate-100 mt-0.5">Active Monthly Goals</h3>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    3 Active
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {[
                    { goal: "Monthly Food Cap", current: "₹8,300", target: "₹10,000", pct: 83, status: "On Track", color: "bg-emerald-500" },
                    { goal: "Shopping & Fashion", current: "₹3,320", target: "₹3,500", pct: 95, status: "Near Limit", color: "bg-amber-500" },
                    { goal: "Entertainment & Movies", current: "₹1,249", target: "₹2,000", pct: 62, status: "Healthy", color: "bg-indigo-500" },
                  ].map((g, idx) => (
                    <div key={idx} className="p-3 rounded-md bg-slate-900/40 border border-slate-900/60 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">{g.goal}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          g.status === "On Track" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          g.status === "Near Limit" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        }`}>
                          {g.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>{g.current} spent</span>
                        <span>Cap: {g.target}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-sm h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${g.pct}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className={`h-full rounded-sm ${g.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating Badges surrounding mockup */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute -top-8 -left-8 lg:-left-20 lg:-top-10 z-20 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="p-2.5 sm:p-3 bg-slate-900/90 border border-emerald-500/30 rounded-md flex items-center gap-2.5 shadow-xl backdrop-blur-md"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block font-bold leading-none mb-0.5">Weekly Saving</span>
              <span className="text-xs font-extrabold text-emerald-400 leading-none">+₹2,500 Saved</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="absolute top-24 -right-6 lg:-right-16 z-20 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
            className="p-2.5 sm:p-3 bg-slate-900/90 border border-violet-500/30 rounded-md flex items-center gap-2.5 shadow-xl backdrop-blur-md"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-violet-500/15 flex items-center justify-center text-violet-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block font-bold leading-none mb-0.5">Budget Status</span>
              <span className="text-xs font-extrabold text-violet-300 leading-none">Goal Achieved 🎉</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-20 -left-8 lg:-left-20 z-20 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="p-2.5 sm:p-3 bg-slate-900/90 border border-indigo-500/30 rounded-md flex items-center gap-2.5 shadow-xl backdrop-blur-md"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block font-bold leading-none mb-0.5">Income Logged</span>
              <span className="text-xs font-extrabold text-indigo-300 leading-none">+₹75,000 Salary</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
