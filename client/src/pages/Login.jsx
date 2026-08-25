import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/Toast";
import { API_URL } from "../config";
import { Wallet, TrendingUp, PieChart, ShieldCheck, Zap, ArrowRight, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      login(
        { _id: data._id, name: data.name, email: data.email, monthlyBudget: data.monthlyBudget },
        data.token
      );
      showToast(`Welcome back, ${data.name}! 👋`, "success");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* 2-PART SPLIT CONTAINER */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-slate-900 border border-slate-800 rounded-md overflow-hidden shadow-2xl relative z-10">
        
        {/* PART 1: LEFT SHOWCASE PANEL (Desktop / Tablet Only: 5 Columns) */}
        <div className="hidden lg:flex lg:col-span-5 bg-slate-900 p-8 sm:p-12 flex-col justify-between border-r border-slate-800 relative">
          <div>
            {/* Brand Header */}
            <div className="mb-10">
              <img src="/logo.png" alt="Finora" className="h-10 w-auto object-contain" />
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight mb-5">
              Master Your Money with Intelligence.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-10">
              Sign in to access your interactive dashboard, real-time analytics, category budgets, and income tracker.
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-4">
              {[
                { icon: TrendingUp, title: "Real-Time Income & Expense Feed" },
                { icon: PieChart, title: "Interactive Category Analytics" },
                { icon: ShieldCheck, title: "JWT-Encrypted Private Vault" },
                { icon: Zap, title: "Budget Goal Alerts & Limits" },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div key={i} className="flex items-center gap-3.5">
                    <div className="w-7 h-7 rounded-md bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">{feat.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Trusted by 10,000+ users</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
              100% Free
            </span>
          </div>
        </div>

        {/* PART 2: RIGHT AUTH FORM PANEL (7 Columns) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-slate-950">
          
          {/* Mobile Logo Header */}
          <div className="lg:hidden mb-6 flex justify-center">
            <img src="/logo.png" alt="Finora" className="h-10 w-auto object-contain" />
          </div>

          <div className="mb-6 sm:mb-8 text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mb-1.5">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Enter your email and password to log in to your account.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-md bg-rose-500/10 border border-rose-500 text-rose-400 text-xs font-medium mb-6 flex items-center gap-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="form-label mb-0">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
                  title={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md border border-violet-500 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-10">
            Don't have an account?{" "}
            <Link to="/register" className="text-violet-400 font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
