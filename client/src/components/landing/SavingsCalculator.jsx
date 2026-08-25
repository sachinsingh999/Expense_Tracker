import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, ShieldCheck, PiggyBank, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SavingsCalculator = () => {
  const navigate = useNavigate();
  const [monthlyIncome, setMonthlyIncome] = useState(75000);
  const [savingsRate, setSavingsRate] = useState(30); // percentage

  const monthlySavings = Math.round((monthlyIncome * savingsRate) / 100);
  const yearlySavings = monthlySavings * 12;

  // 5 Year Compound return assuming conservative 10% annual return
  const calculate5YearGrowth = () => {
    const annualContrib = yearlySavings;
    let total = 0;
    const rate = 0.10;
    for (let i = 0; i < 5; i++) {
      total = (total + annualContrib) * (1 + rate);
    }
    return Math.round(total);
  };

  const fiveYearProjections = calculate5YearGrowth();

  // 50-30-20 Rule Adaptation
  const needsPct = Math.min(60, Math.max(30, 100 - savingsRate - 20));
  const wantsPct = Math.max(10, 100 - savingsRate - needsPct);

  return (
    <section className="py-20 px-6 sm:px-12 lg:px-24 bg-slate-950 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Financial Projection</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight"
          >
            Calculate Your Future Savings
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed"
          >
            Adjust your monthly income and target savings percentage to visualize how small consistent savings compound into financial freedom.
          </motion.p>
        </div>

        {/* Calculator Widget Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-lg p-6 sm:p-10 shadow-2xl">
          {/* Sliders Side (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            {/* Slider 1: Monthly Income */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <PiggyBank className="w-4 h-4 text-violet-400" />
                  Monthly Income
                </label>
                <span className="text-xl font-extrabold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-md border border-violet-500/20">
                  ₹{monthlyIncome.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="500000"
                step="5000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-sm appearance-none cursor-pointer accent-violet-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>₹20,000</span>
                <span>₹2,50,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* Slider 2: Savings Target % */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Target Savings Rate
                </label>
                <span className="text-xl font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                  {savingsRate}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={savingsRate}
                onChange={(e) => setSavingsRate(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-sm appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>5% (Basic)</span>
                <span>30% (Recommended)</span>
                <span>60% (Aggressive)</span>
              </div>
            </div>

            {/* Recommended Budget Allocation Breakdown */}
            <div className="p-5 rounded-md bg-slate-950/60 border border-slate-800/80 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Smart Allocation Formula
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Essentials (Housing, Groceries, Bills)</span>
                  <span className="font-semibold text-slate-200">{needsPct}% (₹{Math.round((monthlyIncome * needsPct) / 100).toLocaleString("en-IN")})</span>
                </div>
                <div className="w-full bg-slate-800 rounded-sm h-2 overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${needsPct}%` }} />
                </div>

                <div className="flex justify-between text-xs text-slate-300 mt-1">
                  <span>Lifestyle & Wants (Dining, Fun)</span>
                  <span className="font-semibold text-slate-200">{wantsPct}% (₹{Math.round((monthlyIncome * wantsPct) / 100).toLocaleString("en-IN")})</span>
                </div>
                <div className="w-full bg-slate-800 rounded-sm h-2 overflow-hidden">
                  <div className="h-full bg-pink-500 transition-all duration-300" style={{ width: `${wantsPct}%` }} />
                </div>

                <div className="flex justify-between text-xs text-slate-300 mt-1">
                  <span>Savings & Investments</span>
                  <span className="font-semibold text-emerald-400">{savingsRate}% (₹{monthlySavings.toLocaleString("en-IN")})</span>
                </div>
                <div className="w-full bg-slate-800 rounded-sm h-2 overflow-hidden">
                  <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${savingsRate}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Results Display Side (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="p-8 rounded-lg bg-gradient-to-br from-violet-950/60 via-slate-900 to-slate-950 border border-violet-500/30 flex flex-col gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Sparkles className="w-32 h-32 text-violet-400" />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Savings Potential</span>
                <div className="text-4xl sm:text-5xl font-black text-slate-100 mt-1">
                  ₹{monthlySavings.toLocaleString("en-IN")}
                  <span className="text-xs font-normal text-slate-400 ml-2">/ month</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="p-4 rounded-md bg-slate-900/60 border border-slate-800 flex flex-col">
                  <span className="text-xs text-slate-400 font-medium">1-Year Savings</span>
                  <span className="text-2xl font-bold text-emerald-400 mt-1">
                    ₹{yearlySavings.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="p-4 rounded-md bg-slate-900/60 border border-slate-800 flex flex-col">
                  <span className="text-xs text-slate-400 font-medium">5-Year Growth (10% CAGR)</span>
                  <span className="text-2xl font-bold text-violet-400 mt-1">
                    ₹{fiveYearProjections.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Tracking your expenses with Finora helps users save an average of <strong className="text-emerald-400">18% more</strong> each month.
                </span>
              </div>

              <button
                onClick={() => navigate("/register")}
                className="w-full py-4 px-6 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 border border-violet-400/30"
              >
                <span>Start Saving Now Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
