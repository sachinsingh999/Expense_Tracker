import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  PlusCircle,
  ReceiptText,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Edit3,
  Trash2,
  Search,
  X,
  ChevronDown,
  Sparkles,
  DollarSign,
  PieChart,
  Layers,
  AlertCircle,
  Filter,
  Check,
  UserCheck,
  UserPlus,
  Scale,
  SlidersHorizontal,
  Split,
  Percent,
  Calculator,
  Utensils,
  Car,
  ShoppingBag,
  FileText,
  Film,
  Stethoscope,
  GraduationCap,
  Plane,
  Package,
  CreditCard,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/Toast";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Travel",
  "Other",
];

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

const round2 = (val) => Math.round((Number(val) || 0) * 100) / 100;

const isValidObjectId = (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
const cleanUserId = (id) => (isValidObjectId(id) ? id : null);

const SplitExpenses = () => {
  const { user } = useAuth();
  const {
    splitExpenses,
    splitSummary,
    registeredUsers,
    fetchSplitExpenses,
    fetchSplitSummary,
    fetchRegisteredUsers,
    addSplitExpense,
    updateSplitExpense,
    deleteSplitExpense,
    updateSettlementStatus,
  } = useExpense();

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active view mode derived directly from URL route paths (/split-expenses/add, /split-expenses/edit/:id, /split-expenses/details/:id):
  const pathname = location.pathname;
  const isAddRoute = pathname.endsWith("/add");
  const isEditRoute = pathname.includes("/edit/");
  const isDetailsRoute = pathname.includes("/details/");
  
  const idParam = params.id || searchParams.get("id");

  const viewMode = (isAddRoute || isEditRoute)
    ? "form"
    : isDetailsRoute
    ? "details"
    : "list";

  // Active view tab: "expenses" or "settlements"
  const [activeTab, setActiveTab] = useState("expenses");

  // State control
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [detailsExpense, setDetailsExpense] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [settlementFilter, setSettlementFilter] = useState("All");

  // ─── FORM STATE ─────────────────────────────────────────────
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [splitType, setSplitType] = useState("equal"); // 'equal' | 'unequal' | 'percentage' | 'shares'

  // Payers: Array of { user, name, email, amount }
  const [isMultiPayer, setIsMultiPayer] = useState(false);
  const [singlePayerName, setSinglePayerName] = useState(user?.name || "");
  const [multiPayers, setMultiPayers] = useState([]);

  // Selected participants: Array of { user, name, email, shareAmount, percentage, shares }
  const [participants, setParticipants] = useState([]);
  const [customParticipantName, setCustomParticipantName] = useState("");

  useEffect(() => {
    fetchSplitExpenses();
    fetchSplitSummary();
    fetchRegisteredUsers();
  }, [fetchSplitExpenses, fetchSplitSummary, fetchRegisteredUsers]);

  // Populate form fields when editing an expense
  const populateFormForEdit = (expense) => {
    setEditingExpense(expense);
    setDescription(expense.description || "");
    setTotalAmount(expense.totalAmount ? expense.totalAmount.toString() : "");
    setCategory(expense.category || "Food");
    setDate(expense.date ? new Date(expense.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    setSplitType(expense.splitType || "equal");

    if (expense.payers && expense.payers.length > 1) {
      setIsMultiPayer(true);
      setMultiPayers(
        expense.payers.map((p) => ({
          user: p.user?._id || p.user || null,
          name: p.name,
          email: p.email || "",
          amount: p.amount,
        }))
      );
    } else {
      setIsMultiPayer(false);
      setSinglePayerName(expense.payers?.[0]?.name || user?.name || "");
    }

    if (expense.participants && expense.participants.length > 0) {
      setParticipants(
        expense.participants.map((p) => ({
          user: p.user?._id || p.user || null,
          name: p.name,
          email: p.email || "",
          shareAmount: p.shareAmount || 0,
          percentage: p.percentage || 0,
          shares: p.shares || 1,
        }))
      );
    }
    setIsFormOpen(true);
  };

  // Restore draft form state from sessionStorage if creating a new unsaved expense
  const restoreFormDraft = () => {
    try {
      const saved = sessionStorage.getItem("finora_split_form_draft");
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.description) setDescription(draft.description);
        if (draft.totalAmount) setTotalAmount(draft.totalAmount);
        if (draft.category) setCategory(draft.category);
        if (draft.date) setDate(draft.date);
        if (draft.splitType) setSplitType(draft.splitType);
        if (typeof draft.isMultiPayer === "boolean") setIsMultiPayer(draft.isMultiPayer);
        if (draft.singlePayerName) setSinglePayerName(draft.singlePayerName);
        if (Array.isArray(draft.multiPayers) && draft.multiPayers.length > 0) setMultiPayers(draft.multiPayers);
        if (Array.isArray(draft.participants) && draft.participants.length > 0) setParticipants(draft.participants);
      }
    } catch (err) {
      console.error("Error restoring form draft:", err);
    }
  };

  // Save new form draft to sessionStorage as the user types
  useEffect(() => {
    if (viewMode === "form" && !editingExpense) {
      const draft = {
        description,
        totalAmount,
        category,
        date,
        splitType,
        isMultiPayer,
        singlePayerName,
        multiPayers,
        participants,
      };
      sessionStorage.setItem("finora_split_form_draft", JSON.stringify(draft));
    }
  }, [
    viewMode,
    editingExpense,
    description,
    totalAmount,
    category,
    date,
    splitType,
    isMultiPayer,
    singlePayerName,
    multiPayers,
    participants,
  ]);

  // Synchronize object state (detailsExpense / editingExpense) with URL parameters / route params
  useEffect(() => {
    if (isDetailsRoute && idParam) {
      if (splitExpenses && splitExpenses.length > 0) {
        const found = splitExpenses.find((e) => e._id === idParam);
        if (found) setDetailsExpense(found);
      }
    } else if (isAddRoute || isEditRoute) {
      if (idParam) {
        if (splitExpenses && splitExpenses.length > 0) {
          const found = splitExpenses.find((e) => e._id === idParam);
          if (found && editingExpense?._id !== idParam) {
            populateFormForEdit(found);
          }
        }
      } else {
        restoreFormDraft();
      }
    } else {
      setIsFormOpen(false);
      setEditingExpense(null);
      setDetailsExpense(null);
    }
  }, [pathname, idParam, splitExpenses]);

  // Set default current user in participants list when form opens
  const resetForm = () => {
    setDescription("");
    setTotalAmount("");
    setCategory("Food");
    setDate(new Date().toISOString().split("T")[0]);
    setSplitType("equal");
    setIsMultiPayer(false);
    setSinglePayerName(user?.name || "");

    const currentUserPart = {
      user: user?._id || null,
      name: user?.name || "You",
      email: user?.email || "",
      shareAmount: 0,
      percentage: 0,
      shares: 1,
    };

    setParticipants([currentUserPart]);
    setMultiPayers([{ name: user?.name || "You", user: user?._id || null, amount: 0 }]);
    setEditingExpense(null);
  };

  const navigateToList = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
    setDetailsExpense(null);
    sessionStorage.removeItem("finora_split_form_draft");
    navigate("/split-expenses");
  };

  const handleBackToList = () => {
    navigateToList();
  };

  const handleOpenNewForm = () => {
    sessionStorage.removeItem("finora_split_form_draft");
    resetForm();
    setEditingExpense(null);
    setIsFormOpen(true);
    navigate("/split-expenses/add");
  };

  const handleViewDetails = (expense) => {
    setDetailsExpense(expense);
    navigate(`/split-expenses/details/${expense._id}`);
  };

  const handleEditExpense = (expense) => {
    populateFormForEdit(expense);
    navigate(`/split-expenses/edit/${expense._id}`);
  };

  // Toggle participant selection from registered users list
  const toggleRegisteredUserParticipant = (u) => {
    const exists = participants.some((p) => p.user === u._id || p.email === u.email);
    if (exists) {
      if (participants.length <= 1) {
        showToast("At least one participant is required!", "error");
        return;
      }
      setParticipants(participants.filter((p) => p.user !== u._id && p.email !== u.email));
    } else {
      setParticipants([
        ...participants,
        {
          user: u._id,
          name: u.name,
          email: u.email,
          shareAmount: 0,
          percentage: 0,
          shares: 1,
        },
      ]);
    }
  };

  // Add ad-hoc custom participant name
  const handleAddCustomParticipant = () => {
    const trimmed = customParticipantName.trim();
    if (!trimmed) return;
    if (participants.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast("Participant with this name already exists!", "error");
      return;
    }
    setParticipants([
      ...participants,
      {
        user: null,
        name: trimmed,
        email: "",
        shareAmount: 0,
        percentage: 0,
        shares: 1,
      },
    ]);
    setCustomParticipantName("");
  };

  // Remove participant
  const handleRemoveParticipant = (index) => {
    if (participants.length <= 1) {
      showToast("At least one participant is required", "error");
      return;
    }
    setParticipants(participants.filter((_, i) => i !== index));
  };

  // Update participant fields (shareAmount, percentage, shares)
  const updateParticipantField = (index, field, value) => {
    const next = [...participants];
    next[index][field] = value;
    setParticipants(next);
  };

  // Update multi-payer amount
  const updatePayerAmount = (participant, amount) => {
    setMultiPayers((prev) => {
      const pName = participant.name?.toLowerCase().trim();
      const pUser = participant.user;

      const existingIdx = prev.findIndex(
        (mp) =>
          (pUser && mp.user && mp.user === pUser) ||
          (mp.name && mp.name.toLowerCase().trim() === pName)
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], amount };
        return next;
      } else {
        return [
          ...prev,
          {
            user: participant.user || null,
            name: participant.name,
            email: participant.email || "",
            amount,
          },
        ];
      }
    });
  };

  // ─── LIVE CALCULATIONS FOR PREVIEW ──────────────────────────
  const liveCalculations = useMemo(() => {
    const numAmount = Number(totalAmount) || 0;
    const count = participants.length;

    if (numAmount <= 0 || count === 0) {
      return {
        eachShare: 0,
        participantsWithBalance: [],
        settlementsPreview: [],
        totalPaid: 0,
        isValid: false,
        error: "Enter a valid positive amount and participants.",
      };
    }

    // Payers construction
    let payersList = [];
    let totalPaid = 0;

    if (!isMultiPayer) {
      const targetPayerName = (singlePayerName || user?.name || "You").toLowerCase().trim();
      const matchingPart = participants.find((p) => {
        const pName = (p.name || "").toLowerCase().trim();
        return (
          pName === targetPayerName ||
          pName.startsWith(targetPayerName) ||
          targetPayerName.startsWith(pName) ||
          (p.user && user?._id && String(p.user) === String(user._id))
        );
      }) || participants[0];

      payersList = participants.map((p) => {
        const isPayer = matchingPart ? p.name === matchingPart.name : false;
        const amt = isPayer ? numAmount : 0;
        return { name: p.name, user: p.user, amount: amt };
      });
      totalPaid = numAmount;
    } else {
      payersList = participants.map((p) => {
        const found = multiPayers.find(
          (mp) => (mp.user && p.user && mp.user === p.user) || mp.name === p.name
        );
        const amt = found ? Number(found.amount) || 0 : 0;
        totalPaid += amt;
        return { name: p.name, user: p.user, amount: amt };
      });
    }

    // Share calculation per participant
    let shares = [];
    if (splitType === "equal") {
      const baseShare = Math.floor((numAmount * 100) / count) / 100;
      let remainder = round2(numAmount - baseShare * count);
      shares = participants.map((p) => {
        let s = baseShare;
        if (remainder > 0) {
          s = round2(s + 0.01);
          remainder = round2(remainder - 0.01);
        }
        return s;
      });
    } else if (splitType === "unequal") {
      shares = participants.map((p) => Number(p.shareAmount) || 0);
    } else if (splitType === "percentage") {
      let allocatedSum = 0;
      shares = participants.map((p, idx) => {
        const pct = Number(p.percentage) || 0;
        let s = Math.floor(((numAmount * pct) / 100) * 100) / 100;
        if (idx === count - 1) {
          s = round2(numAmount - allocatedSum);
        } else {
          allocatedSum = round2(allocatedSum + s);
        }
        return s;
      });
    } else if (splitType === "shares") {
      const totalSh = participants.reduce((sum, p) => sum + (Number(p.shares) || 0), 0);
      let allocatedSum = 0;
      shares = participants.map((p, idx) => {
        const sh = Number(p.shares) || 0;
        let s = totalSh > 0 ? Math.floor(((numAmount * sh) / totalSh) * 100) / 100 : 0;
        if (idx === count - 1) {
          s = round2(numAmount - allocatedSum);
        } else {
          allocatedSum = round2(allocatedSum + s);
        }
        return s;
      });
    }

    // Compute balances
    const participantsWithBalance = participants.map((p, idx) => {
      let paid = 0;
      payersList.forEach((payer) => {
        if (
          (payer.user && p.user && payer.user === p.user) ||
          payer.name.toLowerCase().trim() === p.name.toLowerCase().trim()
        ) {
          paid = round2(paid + payer.amount);
        }
      });
      const share = shares[idx] || 0;
      const balance = round2(paid - share);
      return {
        user: p.user,
        name: p.name,
        paid,
        share,
        balance,
      };
    });

    // Greedy min-flow settlement preview
    const debtors = [];
    const creditors = [];

    participantsWithBalance.forEach((p) => {
      if (p.balance < -0.005) {
        debtors.push({ name: p.name, balance: Math.abs(p.balance) });
      } else if (p.balance > 0.005) {
        creditors.push({ name: p.name, balance: p.balance });
      }
    });

    debtors.sort((a, b) => b.balance - a.balance);
    creditors.sort((a, b) => b.balance - a.balance);

    const settlementsPreview = [];
    let d = 0;
    let c = 0;

    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];
      const amt = round2(Math.min(debtor.balance, creditor.balance));

      if (amt > 0) {
        settlementsPreview.push({
          fromName: debtor.name,
          toName: creditor.name,
          amount: amt,
        });
        debtor.balance = round2(debtor.balance - amt);
        creditor.balance = round2(creditor.balance - amt);
      }

      if (debtor.balance < 0.005) d++;
      if (creditor.balance < 0.005) c++;
    }

    return {
      eachShare: count > 0 ? round2(numAmount / count) : 0,
      participantsWithBalance,
      settlementsPreview,
      totalPaid: round2(totalPaid),
      isValid: Math.abs(totalPaid - numAmount) < 0.01,
    };
  }, [totalAmount, splitType, participants, isMultiPayer, singlePayerName, multiPayers]);

  // ─── FORM SUBMIT ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting) return;

    if (!description.trim()) {
      showToast("Please enter an expense description", "error");
      return;
    }

    const numTotal = Number(totalAmount);
    if (!numTotal || numTotal <= 0) {
      showToast("Please enter a valid expense total amount", "error");
      return;
    }

    if (participants.length === 0) {
      showToast("Select at least one participant", "error");
      return;
    }

    // Validate live calculations total paid vs total amount
    if (!liveCalculations.isValid) {
      showToast(
        `Total paid (${formatCurrency(liveCalculations.totalPaid)}) does not equal total expense (${formatCurrency(numTotal)}). Please adjust amounts paid.`,
        "error"
      );
      return;
    }

    // Prepare Payers payload
    let payersPayload = [];
    if (!isMultiPayer) {
      const targetPayerName = (singlePayerName || user?.name || "You").toLowerCase().trim();
      const selectedPayerObj =
        participants.find((p) => {
          const pName = (p.name || "").toLowerCase().trim();
          return (
            pName === targetPayerName ||
            pName.startsWith(targetPayerName) ||
            targetPayerName.startsWith(pName) ||
            (p.user && user?._id && String(p.user) === String(user._id))
          );
        }) || participants[0];

      payersPayload = [
        {
          user: cleanUserId(selectedPayerObj?.user) || (singlePayerName === user?.name ? cleanUserId(user?._id) : null),
          name: selectedPayerObj?.name || singlePayerName || user?.name || "You",
          email: selectedPayerObj?.email || "",
          amount: numTotal,
        },
      ];
    } else {
      payersPayload = participants
        .map((p) => {
          const found = multiPayers.find(
            (mp) =>
              (mp.user && p.user && String(mp.user) === String(p.user)) ||
              (mp.name && p.name && mp.name.toLowerCase().trim() === p.name.toLowerCase().trim())
          );
          return {
            user: cleanUserId(p.user),
            name: p.name,
            email: p.email || "",
            amount: found ? Number(found.amount) || 0 : 0,
          };
        })
        .filter((p) => p.amount > 0);
    }

    const payload = {
      description: description.trim(),
      totalAmount: numTotal,
      category,
      date,
      splitType,
      payers: payersPayload,
      participants: participants.map((p) => ({
        user: cleanUserId(p.user),
        name: p.name,
        email: p.email || "",
        shareAmount: Number(p.shareAmount) || 0,
        percentage: Number(p.percentage) || 0,
        shares: Number(p.shares) || 1,
      })),
    };

    setIsSubmitting(true);
    try {
      if (editingExpense) {
        await updateSplitExpense(editingExpense._id, payload);
        showToast("Shared expense updated successfully! 🎉", "success");
      } else {
        await addSplitExpense(payload);
        showToast("Shared expense added & split calculated! 🚀", "success");
      }
      resetForm();
      navigateToList();
    } catch (err) {
      console.error("Save split expense error:", err);
      const serverMsg = err.response?.data?.message;
      const serverErrors = err.response?.data?.errors;
      const msg = serverMsg
        ? serverErrors && serverErrors.length > 0
          ? `${serverMsg}: ${serverErrors.join(", ")}`
          : serverMsg
        : "Failed to save shared expense";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (expense) => {
    setDeleteTarget(expense);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSplitExpense(deleteTarget._id);
      if (detailsExpense?._id === deleteTarget._id) {
        navigateToList();
      }
      showToast("Shared expense deleted successfully! 🗑️", "success");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete shared expense", "error");
    }
  };

  const handleToggleSettlement = async (expenseId, settlementId, currentStatus) => {
    const nextStatus = currentStatus === "Paid" ? "Pending" : "Paid";
    try {
      await updateSettlementStatus(expenseId, settlementId, nextStatus);
      showToast(`Settlement marked as ${nextStatus}!`, "success");
      if (detailsExpense?._id === expenseId) {
        // refresh details modal expense
        const updated = splitExpenses.find((e) => e._id === expenseId);
        if (updated) setDetailsExpense(updated);
      }
    } catch (err) {
      showToast("Failed to update settlement status", "error");
    }
  };

  // Filtered expenses list
  const filteredExpenses = useMemo(() => {
    return splitExpenses.filter((e) => {
      const matchSearch =
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.payers.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === "All" || e.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [splitExpenses, searchQuery, selectedCategory]);

  // Aggregate all settlements across all expenses for the Settlements View
  const allSettlements = useMemo(() => {
    const list = [];
    splitExpenses.forEach((exp) => {
      exp.settlements?.forEach((st) => {
        list.push({
          ...st,
          expenseId: exp._id,
          expenseDescription: exp.description,
          category: exp.category,
          date: exp.date,
        });
      });
    });
    return list.filter((s) => {
      if (settlementFilter === "Pending") return s.status === "Pending";
      if (settlementFilter === "Paid") return s.status === "Paid";
      if (settlementFilter === "You Owe") return s.fromName.toLowerCase() === user?.name?.toLowerCase();
      if (settlementFilter === "Owed to You") return s.toName.toLowerCase() === user?.name?.toLowerCase();
      return true;
    });
  }, [splitExpenses, settlementFilter, user]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center selection:bg-violet-500 selection:text-white">
      <div className="w-full max-w-[1500px] mx-auto flex flex-col gap-6">
        
        {/* ─── VIEW 1: SHARED EXPENSES LIST ─── */}
        {viewMode === "list" && (
          <div className="flex flex-col gap-6">
            {/* 1. MASTER COMPACT HEADER & TOOLBAR CONTAINER */}
            <div className="bg-slate-900 rounded-md p-4 sm:p-5 shadow-xl border border-slate-800 flex flex-col gap-4">
              
              {/* TOP ROW: Title & Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                        Expense Splitting & Settlements
                      </h1>
                      <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                        {splitExpenses.length} Expense(s)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      Split shared costs, track live balances, and auto-minimize debt settlements.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleOpenNewForm}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 transition-all cursor-pointer whitespace-nowrap transform hover:-translate-y-0.5 self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Shared Expense</span>
                </button>
              </div>

              {/* MIDDLE ROW: 4 COMPACT SUMMARY STATS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Owed to You */}
                <div className="p-3 rounded-md bg-slate-950/80 border border-slate-800/80 flex items-center justify-between shadow-sm">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">You Are Owed</span>
                    <h2 className="text-base sm:text-lg font-black text-emerald-400 tracking-tight mt-0.5">
                      {formatCurrency(splitSummary.totalOwedToYou)}
                    </h2>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>

                {/* You Owe */}
                <div className="p-3 rounded-md bg-slate-950/80 border border-slate-800/80 flex items-center justify-between shadow-sm">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">You Owe</span>
                    <h2 className="text-base sm:text-lg font-black text-rose-400 tracking-tight mt-0.5">
                      {formatCurrency(splitSummary.totalYouOwe)}
                    </h2>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>

                {/* Total You Paid */}
                <div className="p-3 rounded-md bg-slate-950/80 border border-slate-800/80 flex items-center justify-between shadow-sm">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total You Paid</span>
                    <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight mt-0.5">
                      {formatCurrency(splitSummary.totalPaid)}
                    </h2>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                    <ReceiptText className="w-4 h-4" />
                  </div>
                </div>

                {/* Pending Settlements */}
                <div className="p-3 rounded-md bg-slate-950/80 border border-slate-800/80 flex items-center justify-between shadow-sm">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pending Settlements</span>
                    <h2 className="text-base sm:text-lg font-black text-amber-400 tracking-tight mt-0.5">
                      {splitSummary.pendingCount}
                    </h2>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: UNIFIED CONTROLS TOOLBAR (TABS + SEARCH + FILTERS) */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Left: Tab Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-md border border-slate-800/80 w-full md:w-auto">
                  <button
                    onClick={() => setActiveTab("expenses")}
                    className={`flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-extrabold transition-all cursor-pointer flex-1 md:flex-initial ${
                      activeTab === "expenses"
                        ? "bg-violet-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <ReceiptText className="w-3.5 h-3.5" />
                    <span>Shared Expenses ({splitExpenses.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("settlements")}
                    className={`flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-extrabold transition-all cursor-pointer flex-1 md:flex-initial ${
                      activeTab === "settlements"
                        ? "bg-violet-600 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Settlements ({allSettlements.length})</span>
                  </button>
                </div>

                {/* Right: Search & Filters */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  {/* Search Bar */}
                  {activeTab === "expenses" && (
                    <div className="relative flex-1 md:w-72">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search description, payer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field !py-1.5 !pl-9 !pr-3 text-xs rounded-md bg-slate-950 text-slate-100 border-slate-800"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Category Filter */}
                  {activeTab === "expenses" && (
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input-field !py-1.5 !px-3 text-xs rounded-md bg-slate-950 text-slate-200 border-slate-800 cursor-pointer min-w-[130px]"
                    >
                      <option value="All">All Categories</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Settlement Filters */}
                  {activeTab === "settlements" && (
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {["All", "Pending", "Paid", "You Owe", "Owed to You"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setSettlementFilter(f)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                            settlementFilter === f
                              ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                              : "bg-slate-950 text-slate-400 hover:bg-slate-900 border border-slate-800/60"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* 2. MAIN TAB CONTENT */}

            {/* TAB 1: SHARED EXPENSES LIST */}
            {activeTab === "expenses" && (
              <div className="flex flex-col gap-4">

            {filteredExpenses.length === 0 ? (
              <div className="bg-slate-900 rounded-md p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3 shadow-xl">
                <Users className="w-10 h-10 text-slate-700" />
                <p className="text-sm font-bold text-slate-300">No shared expenses found</p>
                <p className="text-xs text-slate-500 max-w-sm">
                  Click "+ Add Shared Expense" to create a new shared bill and calculate split balances.
                </p>
                <button
                  onClick={handleOpenNewForm}
                  className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer mt-1"
                >
                  + Add First Shared Expense
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredExpenses.map((exp) => {
                  const pendingCount = exp.settlements?.filter((s) => s.status === "Pending").length || 0;
                  const IconComp = CATEGORY_ICONS[exp.category] || Package;

                  return (
                    <motion.div
                      key={exp._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -3 }}
                      className="bg-slate-900 rounded-md p-5 shadow-xl flex flex-col justify-between border border-slate-800/80 hover:border-violet-500/50 transition-all duration-300 group relative overflow-hidden text-left"
                    >
                      {/* Top Accent Line (Solid Accent) */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-violet-600 opacity-80 group-hover:opacity-100 transition-opacity" />

                      <div className="flex flex-col gap-3">
                        {/* Category Badge & Date */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-300 text-xs font-bold border border-violet-500/20">
                            <IconComp className="w-3.5 h-3.5 text-violet-400" />
                            <span>{exp.category}</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(exp.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Title & Total Amount */}
                        <div className="flex items-start justify-between gap-2 mt-1">
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-100 group-hover:text-violet-300 transition-colors line-clamp-1">
                            {exp.description}
                          </h3>
                          <span className="text-base sm:text-lg font-black text-emerald-400 tracking-tight shrink-0 bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800">
                            {formatCurrency(exp.totalAmount)}
                          </span>
                        </div>

                        {/* Payers Summary Pill Box */}
                        <div className="p-3 rounded-md bg-slate-950 border border-slate-800/80 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3 h-3 text-violet-400" />
                              Paid By ({exp.payers.length})
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {exp.payers.map((p, i) => {
                              const initial = p.name ? p.name.charAt(0).toUpperCase() : "U";
                              return (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 text-slate-200 text-xs font-semibold border border-slate-800"
                                >
                                  <span className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center text-[9px] font-extrabold text-white">
                                    {initial}
                                  </span>
                                  <span>{p.name}:</span>
                                  <strong className="text-slate-100 font-extrabold">
                                    {formatCurrency(p.amount)}
                                  </strong>
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Participants & Split method info */}
                        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                            <Users className="w-3.5 h-3.5 text-violet-400" />
                            <span>{exp.participants.length} Participants</span>
                          </span>

                          <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-bold text-[11px] capitalize border border-slate-800">
                            Split: {exp.splitType}
                          </span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3.5 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div>
                          {pendingCount > 0 ? (
                            <span className="px-2.5 py-1 rounded bg-amber-500/15 text-amber-400 text-[11px] font-extrabold flex items-center gap-1 border border-amber-500/30">
                              <Clock className="w-3 h-3" />
                              {pendingCount} Pending
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 text-[11px] font-extrabold flex items-center gap-1 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              Fully Settled
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleViewDetails(exp)}
                            className="px-3 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs shadow-md shadow-violet-600/30 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>View Split</span>
                          </button>
                          <button
                            onClick={() => handleEditExpense(exp)}
                            title="Edit Shared Expense"
                            className="p-1.5 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(exp)}
                            title="Delete Shared Expense"
                            className="p-1.5 rounded-md bg-slate-950 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SETTLEMENTS VIEW */}
        {activeTab === "settlements" && (
          <div className="bg-slate-900 rounded-md p-5 sm:p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-violet-400" />
                  Minimum Required Settlements
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Optimized transaction flows required to completely settle all shared group balances.
                </p>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                {allSettlements.length} settlement transaction(s)
              </span>
            </div>

            {allSettlements.length === 0 ? (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400/40" />
                <p className="text-sm font-bold text-slate-300">All balances are completely settled!</p>
                <p className="text-xs text-slate-500">No pending debt settlements remaining.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {allSettlements.map((st, idx) => {
                  const isPaid = st.status === "Paid";
                  const isYouPaying = st.fromName.toLowerCase() === user?.name?.toLowerCase();
                  const isYouReceiving = st.toName.toLowerCase() === user?.name?.toLowerCase();

                  return (
                    <div
                      key={st._id || idx}
                      className={`p-4 rounded-md bg-slate-950 border flex items-center justify-between gap-3 transition-all ${
                        isPaid ? "border-emerald-500/20 opacity-75" : "border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                            isPaid
                              ? "bg-emerald-500/10 text-emerald-400"
                              : isYouPaying
                              ? "bg-rose-500/10 text-rose-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {isPaid ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-100">
                            <span className={isYouPaying ? "text-rose-400" : ""}>{st.fromName}</span>
                            <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className={isYouReceiving ? "text-emerald-400" : ""}>{st.toName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            Expense: <span className="text-slate-300">{st.expenseDescription}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-slate-100">{formatCurrency(st.amount)}</p>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isPaid ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {st.status}
                          </span>
                        </div>

                        <button
                          onClick={() => handleToggleSettlement(st.expenseId, st._id, st.status)}
                          className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                            isPaid
                              ? "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                          }`}
                        >
                          {isPaid ? "Mark Pending" : "Mark Paid"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    )}

        {/* ─── VIEW 2: ADD / EDIT SHARED EXPENSE (FULL PAGE) ─── */}
        {viewMode === "form" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 text-left w-full mx-auto"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs border border-slate-800 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Shared Expenses</span>
                </button>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-violet-400" />
                  {editingExpense ? "Edit Shared Expense" : "Add Shared Expense"}
                </h2>
              </div>
            </div>

            {/* Form Section Container */}
            <div className="bg-slate-900 rounded-md p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-6 text-left">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN (7 cols): Form Inputs */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* BASIC EXPENSE FIELDS GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="form-label">Expense Description *</label>
                      <input
                        type="text"
                        placeholder="e.g., Weekend Dinner, Goa Hotel"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Total Amount (₹) *</label>
                      <input
                        type="number"
                        placeholder="800"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        min="0.01"
                        step="any"
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="form-label">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input-field cursor-pointer"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* PAYER SELECTION SECTION */}
                  <div className="p-4 rounded-md bg-slate-950 border border-slate-800 flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-violet-400" />
                          Who Paid?
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Choose whether a single person paid the full bill or multiple people contributed.
                        </p>
                      </div>

                      {/* Single vs Multiple Payer Toggle */}
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded border border-slate-800 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsMultiPayer(false)}
                          className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                            !isMultiPayer
                              ? "bg-violet-600 text-white shadow-sm"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Single Payer
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsMultiPayer(true)}
                          className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                            isMultiPayer
                              ? "bg-violet-600 text-white shadow-sm"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Multiple Payers
                        </button>
                      </div>
                    </div>

                    {/* Single Payer Dropdown */}
                    {!isMultiPayer ? (
                      <div className="flex flex-col gap-1.5 max-w-sm">
                        <label className="text-xs font-semibold text-slate-300">Select Payer</label>
                        <select
                          value={singlePayerName}
                          onChange={(e) => setSinglePayerName(e.target.value)}
                          className="input-field cursor-pointer"
                        >
                          {participants.map((p, idx) => (
                            <option key={idx} value={p.name}>
                              {p.name} {p.name === user?.name ? "(You)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      /* Multiple Payers Input Grid */
                      <div className="flex flex-col gap-2 pt-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                          <span>Enter amount paid by each participant:</span>
                          <span
                            className={`font-mono text-xs ${
                              liveCalculations.isValid ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            Total Paid: {formatCurrency(liveCalculations.totalPaid)} / {formatCurrency(totalAmount)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {participants.map((p, idx) => {
                            const pName = p.name?.toLowerCase().trim();
                            const pUser = p.user;
                            const payerObj = multiPayers.find(
                              (mp) =>
                                (pUser && mp.user && mp.user === pUser) ||
                                (mp.name && mp.name.toLowerCase().trim() === pName)
                            );
                            const currentAmount = payerObj ? payerObj.amount || "" : "";

                            return (
                              <div
                                key={idx}
                                className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between gap-2"
                              >
                                <span className="text-xs font-bold text-slate-200 truncate">
                                  {p.name}
                                </span>
                                <div className="relative w-28 shrink-0">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">
                                    ₹
                                  </span>
                                  <input
                                    type="number"
                                    placeholder="0"
                                    value={currentAmount}
                                    onChange={(e) => updatePayerAmount(p, e.target.value)}
                                    min="0"
                                    step="any"
                                    className="input-field !py-1 !pl-6 text-xs text-right"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* GROUP PARTICIPANTS SECTION */}
                  <div className="p-4 rounded-md bg-slate-950 border border-slate-800 flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-violet-400" />
                          Select Participants ({participants.length})
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Check registered friends or add custom names to split this expense.
                        </p>
                      </div>
                    </div>

                    {/* Registered Users Checkboxes */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {registeredUsers.map((u) => {
                        const isSelected = participants.some((p) => p.user === u._id || p.email === u.email);
                        return (
                          <button
                            key={u._id}
                            type="button"
                            onClick={() => toggleRegisteredUserParticipant(u)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-violet-600 text-white border-violet-500 shadow-sm"
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                            }`}
                          >
                            {isSelected ? (
                              <UserCheck className="w-3.5 h-3.5 text-violet-300" />
                            ) : (
                              <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            <span>{u.name}</span>
                            {u.email === user?.email && (
                              <span className="text-[10px] bg-violet-500/20 px-1 py-0.2 rounded text-violet-300">You</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Add Custom Non-registered Friend */}
                    <div className="flex items-center gap-2 pt-2 max-w-md">
                      <input
                        type="text"
                        placeholder="Add non-registered friend name..."
                        value={customParticipantName}
                        onChange={(e) => setCustomParticipantName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomParticipant();
                          }
                        }}
                        className="input-field !py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomParticipant}
                        className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-violet-400" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Included Participants Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-900">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider self-center mr-1">
                        Included ({participants.length}):
                      </span>
                      {participants.map((p, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-slate-200 text-xs font-semibold border border-slate-800"
                        >
                          <span>{p.name}</span>
                          {participants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveParticipant(idx)}
                              className="text-slate-500 hover:text-rose-400 ml-1 cursor-pointer transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* SPLIT TYPE MODE SELECTION */}
                  <div className="p-4 rounded-md bg-slate-950 border border-slate-800 flex flex-col gap-3">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Split className="w-4 h-4 text-violet-400" />
                      Choose Split Method
                    </span>

                    {/* Tabs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "equal", label: "Equal Split", icon: Scale },
                        { id: "unequal", label: "Unequal / Custom", icon: SlidersHorizontal },
                        { id: "percentage", label: "Percentage %", icon: Percent },
                        { id: "shares", label: "Shares / Ratio", icon: PieChart },
                      ].map((m) => {
                        const Icon = m.icon;
                        const isActive = splitType === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSplitType(m.id)}
                            className={`p-2.5 rounded text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              isActive
                                ? "bg-violet-600 text-white border-violet-500 shadow"
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Split Inputs depending on splitType */}
                    {splitType === "unequal" && (
                      <div className="flex flex-col gap-2 pt-2">
                        <p className="text-xs text-slate-400">Enter exact amount per person (Must sum to Total):</p>
                        {participants.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-slate-900 p-2 rounded">
                            <span className="text-xs font-bold text-slate-200 min-w-[120px] truncate">
                              {p.name}
                            </span>
                            <div className="relative w-full">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">
                                ₹
                              </span>
                              <input
                                type="number"
                                placeholder="0"
                                value={p.customAmount || ""}
                                onChange={(e) => updateParticipantField(idx, "customAmount", e.target.value)}
                                className="input-field !py-1 !pl-6 text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {splitType === "percentage" && (
                      <div className="flex flex-col gap-2 pt-2">
                        <p className="text-xs text-slate-400">Enter percentage per person (Must sum to 100%):</p>
                        {participants.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-slate-900 p-2 rounded">
                            <span className="text-xs font-bold text-slate-200 min-w-[120px] truncate">
                              {p.name}
                            </span>
                            <input
                              type="number"
                              placeholder="%"
                              value={p.percentage || ""}
                              onChange={(e) => updateParticipantField(idx, "percentage", e.target.value)}
                              className="input-field !py-1 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {splitType === "shares" && (
                      <div className="flex flex-col gap-2 pt-2">
                        <p className="text-xs text-slate-400">Enter share count per person (e.g. 2 shares, 1 share):</p>
                        {participants.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-slate-900 p-2 rounded">
                            <span className="text-xs font-bold text-slate-200 min-w-[120px] truncate">
                              {p.name}
                            </span>
                            <input
                              type="number"
                              placeholder="Shares count"
                              value={p.shares || 1}
                              onChange={(e) => updateParticipantField(idx, "shares", e.target.value)}
                              className="input-field !py-1 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FORM ACTIONS */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={handleBackToList}
                      className="px-4 py-2 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={!liveCalculations.isValid || isSubmitting}
                      className={`px-6 py-2.5 rounded-md font-extrabold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                        liveCalculations.isValid && !isSubmitting
                          ? "bg-violet-600 hover:bg-violet-500 shadow-violet-600/30 cursor-pointer"
                          : "bg-slate-800 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>{editingExpense ? "Updating Expense..." : "Saving Expense..."}</span>
                        </>
                      ) : (
                        <span>{editingExpense ? "Update Shared Expense" : "Save Shared Expense"}</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN (5 cols): LIVE CALCULATION PREVIEW (STICKY) */}
                <div className="lg:col-span-5 lg:sticky lg:top-6 flex flex-col gap-4">
                  {/* LIVE PREVIEW CARD */}
                  <div className="p-4 sm:p-5 rounded-md bg-slate-950 border border-slate-800 flex flex-col gap-4 shadow-md">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-violet-500/20 text-violet-400 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs font-extrabold text-violet-300 uppercase tracking-wider">
                          Live Calculation Preview
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 text-xs font-semibold border border-slate-800">
                          Total: <strong className="text-slate-100 font-bold">{formatCurrency(totalAmount)}</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded bg-violet-500/10 text-violet-300 text-xs font-semibold border border-violet-500/20">
                          Share/Person: <strong className="text-violet-200 font-bold">{formatCurrency(liveCalculations.eachShare)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Validation Warning Alert if invalid */}
                    {!liveCalculations.isValid && Number(totalAmount) > 0 && (
                      <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>
                          Total paid ({formatCurrency(liveCalculations.totalPaid)}) does not equal total expense ({formatCurrency(totalAmount)}). Please adjust amounts paid by payers.
                        </span>
                      </div>
                    )}

                    {/* Participant Breakdown Table */}
                    <div className="border border-slate-800 rounded-md bg-slate-900 overflow-x-auto shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-800">
                          <tr>
                            <th scope="col" className="py-2.5 px-3.5">Participant</th>
                            <th scope="col" className="py-2.5 px-3.5 text-right font-mono">Paid</th>
                            <th scope="col" className="py-2.5 px-3.5 text-right font-mono">Share</th>
                            <th scope="col" className="py-2.5 px-3.5 text-right font-mono">Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {liveCalculations.participantsWithBalance.map((p, idx) => {
                            const isPositive = p.balance > 0.005;
                            const isNegative = p.balance < -0.005;
                            const initial = p.name ? p.name.charAt(0).toUpperCase() : "U";

                            return (
                              <tr key={idx} className="hover:bg-slate-950/50 transition-colors">
                                <td className="py-2.5 px-3.5 font-sans">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white shrink-0 ${
                                        isPositive
                                          ? "bg-emerald-600 shadow-sm shadow-emerald-600/30"
                                          : isNegative
                                          ? "bg-rose-600 shadow-sm shadow-rose-600/30"
                                          : "bg-slate-700"
                                      }`}
                                    >
                                      {initial}
                                    </div>
                                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1">
                                      {p.name}
                                      {p.name === user?.name && (
                                        <span className="text-[10px] text-violet-400 bg-violet-500/10 px-1.5 py-0.2 rounded font-semibold border border-violet-500/20">
                                          You
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3.5 text-right font-bold text-slate-200">
                                  {formatCurrency(p.paid)}
                                </td>
                                <td className="py-2.5 px-3.5 text-right font-bold text-slate-200">
                                  {formatCurrency(p.share)}
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black ${
                                      isPositive
                                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                        : isNegative
                                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                        : "bg-slate-800 text-slate-400 border border-slate-700"
                                    }`}
                                  >
                                    <span>
                                      {isPositive ? `+${formatCurrency(p.balance)}` : formatCurrency(p.balance)}
                                    </span>
                                    <span className="text-[9px] font-semibold opacity-85 uppercase tracking-wider hidden sm:inline">
                                      ({isPositive ? "Gets back" : isNegative ? "Owes" : "Settled"})
                                    </span>
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Generated Settlements Preview */}
                    {liveCalculations.settlementsPreview.length > 0 && (
                      <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
                          ⚡ Generated Settlements Preview ({liveCalculations.settlementsPreview.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {liveCalculations.settlementsPreview.map((st, i) => (
                            <div
                              key={i}
                              className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-200"
                            >
                              <div className="flex items-center gap-1.5 font-bold min-w-0">
                                <span className="text-rose-400 truncate">{st.fromName}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span className="text-emerald-400 truncate">{st.toName}</span>
                              </div>
                              <span className="font-extrabold text-slate-100 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                                {formatCurrency(st.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* ─── VIEW 3: SPLIT DETAILS (FULL PAGE) ─── */}
        {viewMode === "details" && detailsExpense && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 text-left w-full mx-auto"
          >
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs border border-slate-800 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Shared Expenses</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-violet-500/10 text-violet-300 text-xs font-bold border border-violet-500/20">
                    {detailsExpense.category}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-100">
                    {detailsExpense.description}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleEditExpense(detailsExpense)}
                  className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 transition-all cursor-pointer"
                >
                  Edit Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(detailsExpense)}
                  className="px-4 py-2 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Expense</span>
                </button>
              </div>
            </div>

            {/* Main Clean Container Card */}
            <div className="bg-slate-900 rounded-md p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-6 text-left">
              {/* Header Summary Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-md bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Expense
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-emerald-400">
                    {formatCurrency(detailsExpense.totalAmount)}
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Split Mode
                    </span>
                    <span className="text-xs font-extrabold text-violet-300 bg-violet-500/10 px-2.5 py-1 rounded border border-violet-500/20 capitalize mt-0.5 inline-block">
                      {detailsExpense.splitType} Split
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Date
                    </span>
                    <span className="text-xs font-semibold text-slate-300 font-mono">
                      {new Date(detailsExpense.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2-COLUMN BALANCED CONTENT GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN (7 cols): Payers & Participants Breakdown */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Payers Summary */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-violet-400" />
                      Who Paid ({detailsExpense.payers.length})
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {detailsExpense.payers.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-black text-white">
                            {p.name ? p.name.charAt(0).toUpperCase() : "U"}
                          </span>
                          <span className="font-bold text-slate-200">{p.name}</span>
                          <span className="font-extrabold text-emerald-400 font-mono">
                            {formatCurrency(p.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Participants Breakdown Table */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-violet-400" />
                      Participants Breakdown ({detailsExpense.participants.length})
                    </span>

                    <div className="border border-slate-800 rounded-lg bg-slate-950 overflow-x-auto shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900/80 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-800">
                          <tr>
                            <th scope="col" className="py-2.5 px-3.5">Participant</th>
                            <th scope="col" className="py-2.5 px-3.5 text-right font-mono">Paid</th>
                            <th scope="col" className="py-2.5 px-3.5 text-right font-mono">Share</th>
                            <th scope="col" className="py-2.5 px-3.5 text-right font-mono">Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {detailsExpense.participants.map((p, i) => {
                            const isPositive = p.balance > 0.005;
                            const isNegative = p.balance < -0.005;
                            const initial = p.name ? p.name.charAt(0).toUpperCase() : "U";

                            return (
                              <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                                <td className="py-3 px-3.5 font-sans">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white shrink-0 ${
                                        isPositive
                                          ? "bg-emerald-600 shadow-sm shadow-emerald-600/30"
                                          : isNegative
                                          ? "bg-rose-600 shadow-sm shadow-rose-600/30"
                                          : "bg-slate-700"
                                      }`}
                                    >
                                      {initial}
                                    </div>
                                    <span className="font-bold text-slate-100 truncate flex items-center gap-1.5">
                                      {p.name}
                                      {p.name === user?.name && (
                                        <span className="text-[10px] text-violet-400 bg-violet-500/10 px-1.5 py-0.2 rounded font-semibold border border-violet-500/20">
                                          You
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-3.5 text-right font-bold text-slate-200">
                                  {formatCurrency(p.paidAmount)}
                                </td>
                                <td className="py-3 px-3.5 text-right font-bold text-slate-200">
                                  {formatCurrency(p.shareAmount)}
                                </td>
                                <td className="py-3 px-3.5 text-right">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black ${
                                      isPositive
                                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                        : isNegative
                                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                        : "bg-slate-800 text-slate-400 border border-slate-700"
                                    }`}
                                  >
                                    <span>
                                      {isPositive ? `+${formatCurrency(p.balance)}` : formatCurrency(p.balance)}
                                    </span>
                                    <span className="text-[9px] font-semibold opacity-85 uppercase tracking-wider hidden sm:inline">
                                      ({isPositive ? "Gets back" : isNegative ? "Owes" : "Settled"})
                                    </span>
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (5 cols): Required Debt Settlements */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    Required Debt Settlements ({detailsExpense.settlements.length})
                  </span>

                  {detailsExpense.settlements.length === 0 ? (
                    <div className="p-6 text-center flex flex-col items-center justify-center gap-2 text-emerald-400 font-bold bg-emerald-500/5 rounded-md border border-emerald-500/20">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <span className="text-xs">Everyone is fully settled! No payments required.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {detailsExpense.settlements.map((st) => (
                        <div
                          key={st._id}
                          className="p-3 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2 font-extrabold min-w-0">
                            <span className="text-rose-400 truncate">{st.fromName}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="text-emerald-400 truncate">{st.toName}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-black text-slate-100 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 font-mono">
                              {formatCurrency(st.amount)}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleToggleSettlement(detailsExpense._id, st._id, st.status)}
                              className={`px-2.5 py-1 rounded font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                                st.status === "Paid"
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                              }`}
                            >
                              {st.status === "Paid" ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Paid</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" />
                                  <span>Mark Paid</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        <AnimatePresence>
          {deleteTarget && (
            <div
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setDeleteTarget(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 w-full max-w-md rounded-md p-6 border border-slate-800 shadow-2xl flex flex-col gap-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-100">
                      Delete Shared Expense?
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                  Are you sure you want to delete <strong className="text-slate-100">&quot;{deleteTarget.description}&quot;</strong> ({formatCurrency(deleteTarget.totalAmount)})?
                  All associated participant balances and settlements will be permanently removed.
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer"
                  >
                    Delete Expense
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default SplitExpenses;
