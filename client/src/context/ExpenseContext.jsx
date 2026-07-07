import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext();

const API = "http://localhost:4000/api";

export const ExpenseProvider = ({ children }) => {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(false);

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  // ─── EXPENSES ───────────────────────────────────────────────
  const fetchExpenses = useCallback(async (filters = {}) => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`${API}/expenses?${params}`, authHeaders());
      setExpenses(data);
    } catch (err) {
      console.error("Fetch expenses error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addExpense = async (expenseData) => {
    const { data } = await axios.post(`${API}/expenses`, expenseData, authHeaders());
    setExpenses((prev) => [data, ...prev]);
    return data;
  };

  const updateExpense = async (id, updatedData) => {
    const { data } = await axios.put(`${API}/expenses/${id}`, updatedData, authHeaders());
    setExpenses((prev) => prev.map((e) => (e._id === id ? data : e)));
    return data;
  };

  const deleteExpense = async (id) => {
    await axios.delete(`${API}/expenses/${id}`, authHeaders());
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  };

  // ─── INCOME ─────────────────────────────────────────────────
  const fetchIncome = useCallback(async (filters = {}) => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`${API}/income?${params}`, authHeaders());
      setIncome(data);
    } catch (err) {
      console.error("Fetch income error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addIncome = async (incomeData) => {
    const { data } = await axios.post(`${API}/income`, incomeData, authHeaders());
    setIncome((prev) => [data, ...prev]);
    return data;
  };

  const deleteIncome = async (id) => {
    await axios.delete(`${API}/income/${id}`, authHeaders());
    setIncome((prev) => prev.filter((i) => i._id !== id));
  };

  // ─── COMPUTED ────────────────────────────────────────────────
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((s, e) => s + e.amount, 0);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        income,
        loading,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        fetchIncome,
        addIncome,
        deleteIncome,
        totalExpenses,
        totalIncome,
        netSavings,
        monthlyExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => useContext(ExpenseContext);
