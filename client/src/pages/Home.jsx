import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  PieChart as PieIcon,
  ShieldCheck,
  Zap,
  Layers,
  ArrowUpRight,
  Lock,
  Download,
  Target,
  BarChart3,
  CreditCard
} from "lucide-react";

import { InteractiveHeroMockup } from "../components/landing/InteractiveHeroMockup";
import { ExpenseSimulator } from "../components/landing/ExpenseSimulator";
import { SavingsCalculator } from "../components/landing/SavingsCalculator";
import { FaqAccordion } from "../components/landing/FaqAccordion";

const allFeatures = [
  { icon: BarChart3, category: "Analytics", title: "Smart Analytics", desc: "Visual interactive charts that show where your money goes — by category, month, and trend." },
  { icon: CreditCard, category: "Tracking", title: "Track Every Expense", desc: "Log cash, card, and UPI payments with notes. Never miss or forget a transaction." },
  { icon: Layers, category: "Tracking", title: "Income Management", desc: "Track salary, freelance, and passive income sources separately from your expenses." },
  { icon: Target, category: "Budgeting", title: "Budget Goals", desc: "Set monthly category spending caps and get real-time progress bar alerts." },
  { icon: Download, category: "Analytics", title: "CSV Data Export", desc: "Download your expense history anytime with one click for tax or accounting records." },
  { icon: Lock, category: "Security", title: "Secure & Private", desc: "JWT-authenticated with encrypted sessions. Your financial data is strictly yours." },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "₹2Cr+", label: "Expenses Tracked" },
  { value: "99.9%", label: "Platform Uptime" },
  { value: "100%", label: "Free Forever" },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heroRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFeatureTab, setActiveFeatureTab] = useState("All");
  const [activeStep, setActiveStep] = useState(0);

  const [particles] = useState(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * -20,
    }))
  );

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const filteredFeatures = activeFeatureTab === "All"
    ? allFeatures
    : allFeatures.filter((f) => f.category === activeFeatureTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-500 selection:text-white">
      {/* 1. HERO SECTION */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-20 px-6 sm:px-12 lg:px-24 bg-slate-950"
      >
        {/* Dark background */}
        <div className="absolute inset-0 bg-slate-950" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
            backgroundSize: "44px 44px"
          }}
        />

        {/* Large blurred glowing background circles */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/30 blur-[140px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[140px] pointer-events-none"
        />

        {/* Floating background particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute bg-indigo-400/20 rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: ["0vh", "-100vh"],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}

        {/* Mouse-follow radial glow spotlight */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-100"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.09), transparent 75%)`,
          }}
        />

        {/* Hero Content Grid */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN (Headline & CTAs) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold backdrop-blur-md mb-6 hover:bg-violet-500/20 hover:border-violet-500/50 transition-all cursor-default"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Next-Gen Personal Expense Manager</span>
            </motion.div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-100 mb-6">
              <motion.span
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="block"
              >
                Track Every Rupee.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 25, backgroundPosition: "0% 50%" }}
                animate={{
                  opacity: 1,
                  y: 0,
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.2 },
                  y: { duration: 0.6, delay: 0.2 },
                  backgroundPosition: {
                    duration: 8,
                    ease: "linear",
                    repeat: Infinity
                  }
                }}
                className="block mt-2 bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400 bg-[length:200%_auto] bg-clip-text text-transparent"
              >
                Grow Every Savings Goal.
              </motion.span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-slate-400 max-w-xl mb-8 leading-relaxed font-normal"
            >
              Master your money with instant expense logging, separate income tracking, intelligent category budgets, and real-time interactive financial analytics.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-10 w-full sm:w-auto"
            >
              {user ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer border border-violet-400/30"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/register")}
                    className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer border border-violet-400/30"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-500 text-slate-200 hover:text-white font-semibold text-sm transition-all transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md"
                  >
                    Sign In
                  </button>
                </>
              )}
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl"
            >
              {[
                { label: "Free Forever", desc: "No trial limits" },
                { label: "Secure JWT", desc: "Encrypted sessions" },
                { label: "No Card Needed", desc: "Instant registration" },
                { label: "Fast & Offline", desc: "Ultra-fast response" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, borderColor: "rgba(139, 92, 246, 0.4)" }}
                  className="flex flex-col p-3 rounded-md bg-slate-900/60 border border-slate-800 backdrop-blur-sm transition-all"
                >
                  <div className="flex items-center gap-1.5 text-indigo-400 font-semibold text-xs mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-200">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{item.desc}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT COLUMN (Interactive Hero Mockup Component) */}
          <div className="lg:col-span-5 flex justify-center items-center relative w-full">
            <InteractiveHeroMockup />
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-14 border-y border-slate-900 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE EXPENSE SIMULATOR / SANDBOX */}
      <ExpenseSimulator />

      {/* 4. INTERACTIVE SAVINGS CALCULATOR */}
      <SavingsCalculator />

      {/* 5. FEATURE SPOTLIGHT WITH CATEGORY FILTERING */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-slate-950 relative">
        <div className="w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>Full Toolkit</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
              Designed For Total Financial Control
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              Explore the features built to make managing income and expenses effortless.
            </p>

            {/* Feature Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {["All", "Analytics", "Tracking", "Budgeting", "Security"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFeatureTab(tab)}
                  className={`px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeFeatureTab === tab
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                      : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((f, i) => {
              const IconComp = f.icon;
              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -6, borderColor: "rgba(139, 92, 246, 0.4)" }}
                  className="p-8 rounded-md bg-slate-900/40 border border-slate-800 backdrop-blur-xl flex flex-col items-start transition-all shadow-xl hover:shadow-2xl hover:shadow-violet-600/10 group"
                >
                  <div className="w-14 h-14 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all">
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-violet-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE 3-STEP GUIDE */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-slate-950/70 border-t border-slate-900 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Get Started in 3 Simple Steps
            </h2>
            <p className="mt-3 text-slate-400 text-base">
              Start managing your expenses smarter in less than 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Your Free Account", desc: "Sign up in 30 seconds with email and password — no credit card needed." },
              { step: "02", title: "Log Income & Expenses", desc: "Quickly record transactions with category, payment method, and custom notes." },
              { step: "03", title: "Analyze & Build Wealth", desc: "View real-time category breakdown charts and stay inside your monthly budget caps." },
            ].map((s, idx) => (
              <motion.div
                key={idx}
                onClick={() => setActiveStep(idx)}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-md border transition-all cursor-pointer ${
                  activeStep === idx
                    ? "bg-slate-900/90 border-violet-500/50 shadow-xl shadow-violet-600/15"
                    : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="text-4xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <FaqAccordion />

      {/* 8. RADIANT CALL TO ACTION BANNER */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto p-10 sm:p-16 rounded-lg bg-gradient-to-tr from-violet-950/80 via-slate-900 to-indigo-950/80 border border-violet-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 tracking-tight mb-4">
            Ready to Take Control of Your Money?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of smart individuals managing their daily finances effortlessly.
          </p>

          <button
            onClick={() => navigate(user ? "/dashboard" : "/register")}
            className="group px-10 py-5 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:shadow-[0_0_45px_rgba(139,92,246,0.7)] transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-3 border border-violet-400/30"
          >
            <span>{user ? "Open Dashboard Now" : "Start Tracking For Free"}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-violet-400 font-bold text-sm">Finora</span>
            <span>© 2026 • All rights reserved</span>
          </div>
          <p className="text-slate-400">
            Built with React, Node.js & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
