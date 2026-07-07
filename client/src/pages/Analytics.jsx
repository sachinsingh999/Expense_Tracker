import React, { useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { useExpense } from "../context/ExpenseContext";

const CATEGORY_COLORS = {
  Food: "#fb923c", Transport: "#60a5fa", Shopping: "#f472b6",
  Bills: "#f87171", Entertainment: "#a78bfa", Health: "#34d399",
  Education: "#fbbf24", Travel: "#22d3ee", Other: "#94a3b8",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatCurrency = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a2e", border: "1px solid var(--border-color)", borderRadius: 10, padding: "10px 14px", fontSize: "0.85rem" }}>
        {label && <p style={{ color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.fill || p.stroke, margin: "2px 0" }}>
            {p.name}: {formatCurrency(p.value)}
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
      data.push({ label: MONTHS[m], expenses: monthExp, income: monthInc, savings: monthInc - monthExp });
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
    { label: "Total Expenses", value: formatCurrency(totalExp), icon: "💸", color: "var(--red)" },
    { label: "Total Income", value: formatCurrency(totalInc), icon: "💰", color: "var(--green)" },
    { label: "Net Savings", value: formatCurrency(Math.max(0, totalInc - totalExp)), icon: "🏦", color: "var(--accent-light)" },
    { label: "Avg/Transaction", value: formatCurrency(avgPerTransaction.toFixed(0)), icon: "📊", color: "var(--yellow)" },
    { label: "Highest Expense", value: formatCurrency(highestExpense), icon: "🔝", color: "var(--red)" },
    { label: "Savings Rate", value: `${savingsRate.toFixed(1)}%`, icon: "📈", color: "var(--green)" },
  ];

  return (
    <div className="page-wrapper" style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, animation: "fadeInUp 0.4s ease" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Analytics</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Deep insights into your financial patterns</p>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 16,
        marginBottom: 28,
        animation: "fadeInUp 0.4s ease 0.08s both",
      }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border-color)",
            borderRadius: 14, padding: "16px 18px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.label}</p>
              <span>{m.icon}</span>
            </div>
            <p style={{ fontSize: "1.3rem", fontWeight: 700, color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Monthly Bar Chart */}
        <div className="chart-container" style={{ animation: "fadeInUp 0.4s ease 0.15s both" }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 20, color: "var(--text-primary)" }}>
            Monthly Overview (Last 6 Months)
          </h2>
          {expenses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 0", color: "var(--text-muted)" }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "var(--text-secondary)", fontSize: "0.8rem" }} />
                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" fillOpacity={0.8} radius={[4,4,0,0]} />
                <Bar dataKey="income" name="Income" fill="#10b981" fillOpacity={0.8} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Pie */}
        <div className="chart-container" style={{ animation: "fadeInUp 0.4s ease 0.2s both" }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 20, color: "var(--text-primary)" }}>
            Spending by Category
          </h2>
          {categoryData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 0", color: "var(--text-muted)" }}>No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={70} paddingAngle={2} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={CATEGORY_COLORS[entry.name] || "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                {categoryData.slice(0, 5).map((entry, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_COLORS[entry.name] || "#94a3b8" }} />
                      <span style={{ color: "var(--text-secondary)" }}>{entry.name}</span>
                    </div>
                    <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{formatCurrency(entry.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
        {/* Savings Line Chart */}
        <div className="chart-container" style={{ animation: "fadeInUp 0.4s ease 0.25s both" }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 20, color: "var(--text-primary)" }}>
            Income vs Expenses Trend
          </h2>
          {expenses.length === 0 && income.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 0", color: "var(--text-muted)" }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "var(--text-secondary)", fontSize: "0.8rem" }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Day of week spending */}
        <div className="chart-container" style={{ animation: "fadeInUp 0.4s ease 0.3s both" }}>
          <h2 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 20, color: "var(--text-primary)" }}>
            Spending by Day of Week
          </h2>
          {expenses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 0", color: "var(--text-muted)" }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weekdayData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Spending" fill="#8b5cf6" fillOpacity={0.8} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top category highlight */}
      {categoryData.length > 0 && (
        <div style={{
          marginTop: 20,
          background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.06))",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: 16, padding: "20px 24px",
          display: "flex", alignItems: "center", gap: 16,
          animation: "fadeInUp 0.4s ease 0.35s both",
        }}>
          <span style={{ fontSize: "2rem" }}>💡</span>
          <div>
            <p style={{ color: "var(--accent-light)", fontWeight: 600, fontSize: "0.875rem" }}>Top Spending Insight</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: 2 }}>
              Your highest expense category is <strong style={{ color: "var(--text-primary)" }}>{topCategory}</strong> at{" "}
              <strong style={{ color: "var(--red)" }}>{formatCurrency(categoryData[0]?.value || 0)}</strong> —{" "}
              {((categoryData[0]?.value / totalExp) * 100).toFixed(0)}% of total spending.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
