import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/Toast";
import { API_URL } from "../config";
import { Wallet, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      login(
        { _id: data._id, name: data.name, email: data.email, monthlyBudget: data.monthlyBudget },
        data.token
      );
      showToast(`Account created! Welcome, ${data.name}! 🎉`, "success");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["bg-transparent", "bg-rose-500", "bg-amber-500", "bg-emerald-400"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* 2-PART SPLIT CONTAINER */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl relative z-10">
        
        {/* PART 1: LEFT SHOWCASE PANEL (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative">
          <div>
            {/* Brand Header */}
            <div className="mb-10">
              <img src="/logo.png" alt="Finora" className="h-12 w-auto object-contain" />
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight mb-5">
              Start Your Financial Freedom Journey.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-10">
              Create a free account in 30 seconds to track every rupee, analyze income, and achieve your budget goals.
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-4">
              {[
                { title: "Free Forever • No Credit Card Required" },
                { title: "Instant Setup & Automated Metrics" },
                { title: "Custom Category Budget Caps & Progress Bars" },
                { title: "1-Click CSV Transactions Data Export" },
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">{feat.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Badge */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Join 10,000+ Smart Savers</span>
            <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-md border border-violet-500">
              JWT Secured
            </span>
          </div>
        </div>

        {/* PART 2: RIGHT AUTH FORM PANEL (7 Columns) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-slate-950">
          <div className="mb-8 text-left">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-1.5">Create Free Account</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Fill in your details below to get started immediately.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-md bg-rose-500/10 border border-rose-500 text-rose-400 text-xs font-medium mb-6 flex items-center gap-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="input-field pr-10"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-sm overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strengthColors[strength]}`}
                      style={{ width: `${(strength / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md border border-violet-500 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
