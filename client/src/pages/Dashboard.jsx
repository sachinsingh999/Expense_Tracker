import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
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

const CATEGORY_CLASSES = {
  Food: "cat-food", Transport: "cat-transport", Shopping: "cat-shopping",
  Bills: "cat-bills", Entertainment: "cat-entertainment", Health: "cat-health",
  Education: "cat-education", Travel: "cat-travel", Other: "cat-other",
};

const formatCurrency = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1a1a2e", border: "1px solid var(--border-color)",
        borderRadius: 10, padding: "10px 14px", fontSize: "0.85rem",
      }}>
        <p style={{ color: "var(--text-secondary)", marginBottom: 4 }}>{payload[0].name}</p>
        <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>
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

  // Budget
  const budget = user?.monthlyBudget || 0;
  const budgetUsed = budget > 0 ? Math.min((monthlyExpenses / budget) * 100, 100) : 0;
  const budgetColor = budgetUsed > 85 ? "var(--red)" : budgetUsed > 60 ? "var(--yellow)" : "var(--green)";

  const currentMonthIncome = income
    .filter((i) => {
      const d = new Date(i.date);
      return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
    })
    .reduce((s, i) => s + i.amount, 0);

  const statCards = [
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: "💸",
      color: "red",
      sub: `${expenses.length} transactions`,
    },
    {
      label: "This Month",
      value: formatCurrency(monthlyExpenses),
      icon: "📅",
      color: "purple",
      sub: budget > 0 ? `Budget: ${formatCurrency(budget)}` : "No budget set",
    },
    {
      label: "Total Income",
      value: formatCurrency(totalIncome),
      icon: "💰",
      color: "green",
      sub: `Monthly: ${formatCurrency(currentMonthIncome)}`,
    },
    {
      label: "Net Savings",
      value: formatCurrency(Math.abs(netSavings)),
      icon: netSavings >= 0 ? "📈" : "📉",
      color: netSavings >= 0 ? "green" : "red",
      sub: netSavings >= 0 ? "Positive balance" : "Spending over income",
    },
  ];

  return (
    <div className="page-wrapper" style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32, animation: "fadeInUp 0.4s ease" }}>
        <h1 className="section-title" style={{ marginBottom: 4 }}>
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},{" "}
          <span className="gradient-text">{user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20,
        marginBottom: 28,
      }}>
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`stat-card ${card.color}`}
            style={{ animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {card.label}
              </p>
              <span style={{ fontSize: "1.4rem" }}>{card.icon}</span>
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
              {card.value}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Budget bar */}
      {budget > 0 && (
        <div
          className="glass-card"
          style={{ padding: 20, marginBottom: 28, animation: "fadeInUp 0.4s ease 0.3s both" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>Monthly Budget</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                {formatCurrency(monthlyExpenses)} spent of {formatCurrency(budget)}
              </p>
            </div>
            <span style={{
              fontSize: "1.1rem", fontWeight: 700,
              color: budgetColor,
            }}>
              {budgetUsed.toFixed(0)}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${budgetUsed}%`, background: budgetColor }}
            />
          </div>
          {budgetUsed > 85 && (
            <p style={{ color: "var(--red)", fontSize: "0.8rem", marginTop: 8 }}>
              ⚠️ You're nearing your monthly budget limit!
            </p>
          )}
        </div>
      )}

      {/* Charts row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.6fr",
        gap: 20,
        marginBottom: 28,
      }}>
        {/* Pie chart */}
        <div className="chart-container" style={{ animation: "fadeInUp 0.4s ease 0.35s both" }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 20, color: "var(--text-primary)" }}>
            Spending by Category
          </h2>
          {categoryData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "2rem", marginBottom: 8 }}>📊</p>
              <p>No expenses yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={CATEGORY_COLORS[entry.name] || "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 12 }}>
                {categoryData.map((entry, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_COLORS[entry.name] || "#94a3b8", flexShrink: 0 }} />
                    <span style={{ color: "var(--text-secondary)" }}>{entry.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Area chart — 7 day trend */}
        <div className="chart-container" style={{ animation: "fadeInUp 0.4s ease 0.4s both" }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 20, color: "var(--text-primary)" }}>
            Last 7 Days Spending
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={last7Days} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={50}
                tickFormatter={(v) => v > 0 ? `₹${v >= 1000 ? (v/1000).toFixed(0)+"k" : v}` : "₹0"} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                name="Spending"
                stroke="#8b5cf6"
                fill="url(#areaGrad)"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card" style={{ padding: 24, animation: "fadeInUp 0.4s ease 0.45s both" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text-primary)" }}>
            Recent Transactions
          </h2>
          <button
            onClick={() => navigate("/my-expenses")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--accent-light)", fontSize: "0.85rem", fontWeight: 500,
            }}
          >
            View all →
          </button>
        </div>

        {recentExpenses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
            <p style={{ fontSize: "2rem", marginBottom: 8 }}>💳</p>
            <p style={{ marginBottom: 12 }}>No expenses yet</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/add-expenses")}
              style={{ padding: "10px 20px", fontSize: "0.875rem" }}
            >
              Add First Expense
            </button>
          </div>
        ) : (
          <div>
            {recentExpenses.map((e, i) => (
              <div
                key={e._id || i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i < recentExpenses.length - 1 ? "1px solid var(--border-color)" : "none",
                  animation: `fadeInUp 0.3s ease ${i * 0.06}s both`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 38, height: 38,
                    borderRadius: 10,
                    background: "rgba(139,92,246,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem",
                  }}>
                    {e.category === "Food" ? "🍽️" : e.category === "Transport" ? "🚗" :
                     e.category === "Shopping" ? "🛍️" : e.category === "Bills" ? "📄" :
                     e.category === "Entertainment" ? "🎭" : e.category === "Health" ? "💊" :
                     e.category === "Education" ? "📚" : e.category === "Travel" ? "✈️" : "📦"}
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>{e.title}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {e.paymentMode ? ` · ${e.paymentMode}` : ""}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 600, color: "var(--red)", fontSize: "0.95rem" }}>
                    -{formatCurrency(e.amount)}
                  </p>
                  <span className={`badge ${CATEGORY_CLASSES[e.category] || "cat-other"}`} style={{ fontSize: "0.7rem" }}>
                    {e.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
        marginTop: 24,
        animation: "fadeInUp 0.4s ease 0.5s both",
      }}>
        {[
          { label: "Add Expense", icon: "➕", route: "/add-expenses", color: "rgba(139,92,246,0.12)" },
          { label: "Add Income", icon: "💵", route: "/income", color: "rgba(16,185,129,0.12)" },
          { label: "View Analytics", icon: "📊", route: "/analytics", color: "rgba(59,130,246,0.12)" },
          { label: "Settings", icon: "⚙️", route: "/settings", color: "rgba(245,158,11,0.12)" },
        ].map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.route)}
            style={{
              background: action.color,
              border: "1px solid var(--border-color)",
              borderRadius: 12,
              padding: "16px",
              cursor: "pointer",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <span style={{ fontSize: "1.2rem" }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
