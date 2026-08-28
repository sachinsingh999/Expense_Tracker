import SplitExpense from "../models/splitExpenseModel.js";
import Expense from "../models/expenseModel.js";
import { calculateSplitAmounts, calculateSettlements } from "../utils/splitCalculator.js";

// Helper to auto-sync personal Expense records for each registered participant's share
const syncPersonalExpensesForSplit = async (splitExpense) => {
  try {
    // 1. Remove previous linked personal expense records for this splitExpense
    await Expense.deleteMany({ splitExpenseId: splitExpense._id });

    // 2. Create a personal expense entry for each participant with a registered user ID & share > 0
    const expenseDocs = [];
    if (splitExpense.participants && Array.isArray(splitExpense.participants)) {
      for (const p of splitExpense.participants) {
        const uId = p.user?._id || p.user;
        if (uId && p.shareAmount > 0) {
          expenseDocs.push({
            userId: uId,
            title: `[Split] ${splitExpense.description}`,
            amount: p.shareAmount,
            category: splitExpense.category || "Other",
            date: splitExpense.date || new Date(),
            note: `Shared group expense total: ₹${splitExpense.totalAmount} (${splitExpense.splitType} split)`,
            paymentMode: "UPI",
            splitExpenseId: splitExpense._id,
          });
        }
      }
    }

    if (expenseDocs.length > 0) {
      await Expense.insertMany(expenseDocs);
    }
  } catch (error) {
    console.error("Sync personal expenses error:", error.message);
  }
};

// @desc    Create a new shared expense
// @route   POST /api/split-expenses
// @access  Private
export const createSplitExpense = async (req, res) => {
  try {
    const { description, totalAmount, category, date, splitType, payers, participants } = req.body;

    if (!description || !totalAmount || !category) {
      return res.status(400).json({ message: "Description, total amount, and category are required" });
    }

    // Validate calculations
    const calcResult = calculateSplitAmounts({
      totalAmount,
      splitType: splitType || "equal",
      payers,
      participants,
    });

    if (!calcResult.isValid) {
      return res.status(400).json({
        message: "Invalid split configuration",
        errors: calcResult.errors,
      });
    }

    // Calculate settlements using greedy algorithm
    const settlements = calculateSettlements(calcResult.participants);

    // Create split expense record
    const splitExpense = await SplitExpense.create({
      description: description.trim(),
      totalAmount: calcResult.totalAmount,
      category,
      date: date || new Date(),
      splitType: splitType || "equal",
      createdBy: req.user._id,
      payers: calcResult.payers,
      participants: calcResult.participants,
      settlements,
    });

    const populated = await SplitExpense.findById(splitExpense._id)
      .populate("createdBy", "name email")
      .populate("payers.user", "name email")
      .populate("participants.user", "name email");

    // Auto-sync personal expense entry for each participant
    await syncPersonalExpensesForSplit(populated);

    res.status(201).json(populated);
  } catch (error) {
    console.error("Create split expense error:", error.message);
    res.status(500).json({ message: "Server error creating split expense", error: error.message });
  }
};

// @desc    Get all split expenses for the logged-in user
// @route   GET /api/split-expenses
// @access  Private
export const getSplitExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email?.toLowerCase();
    const userName = req.user.name?.toLowerCase();

    // Query expenses where user is creator, payer, or participant
    const expenses = await SplitExpense.find({
      $or: [
        { createdBy: userId },
        { "payers.user": userId },
        { "participants.user": userId },
        { "participants.email": userEmail },
        { "participants.name": { $regex: new RegExp(`^${userName}$`, "i") } },
      ],
    })
      .sort({ date: -1 })
      .populate("createdBy", "name email")
      .populate("payers.user", "name email")
      .populate("participants.user", "name email");

    res.json(expenses);
  } catch (error) {
    console.error("Get split expenses error:", error.message);
    res.status(500).json({ message: "Server error fetching split expenses" });
  }
};

// @desc    Get single split expense by ID
// @route   GET /api/split-expenses/:id
// @access  Private
export const getSplitExpenseById = async (req, res) => {
  try {
    const expense = await SplitExpense.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("payers.user", "name email")
      .populate("participants.user", "name email");

    if (!expense) {
      return res.status(404).json({ message: "Shared expense not found" });
    }

    res.json(expense);
  } catch (error) {
    console.error("Get split expense by ID error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a split expense
// @route   PUT /api/split-expenses/:id
// @access  Private
export const updateSplitExpense = async (req, res) => {
  try {
    const expense = await SplitExpense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Shared expense not found" });
    }

    const { description, totalAmount, category, date, splitType, payers, participants } = req.body;

    const calcResult = calculateSplitAmounts({
      totalAmount: totalAmount || expense.totalAmount,
      splitType: splitType || expense.splitType,
      payers: payers || expense.payers,
      participants: participants || expense.participants,
    });

    if (!calcResult.isValid) {
      return res.status(400).json({
        message: "Invalid split configuration",
        errors: calcResult.errors,
      });
    }

    // Recalculate settlements
    const newSettlements = calculateSettlements(calcResult.participants);

    expense.description = description !== undefined ? description.trim() : expense.description;
    expense.totalAmount = calcResult.totalAmount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    expense.splitType = splitType || expense.splitType;
    expense.payers = calcResult.payers;
    expense.participants = calcResult.participants;
    expense.settlements = newSettlements;

    await expense.save();

    const updated = await SplitExpense.findById(expense._id)
      .populate("createdBy", "name email")
      .populate("payers.user", "name email")
      .populate("participants.user", "name email");

    // Auto-sync personal expense entry for each participant
    await syncPersonalExpensesForSplit(updated);

    res.json(updated);
  } catch (error) {
    console.error("Update split expense error:", error.message);
    res.status(500).json({ message: "Server error updating split expense" });
  }
};

// @desc    Delete a split expense
// @route   DELETE /api/split-expenses/:id
// @access  Private
export const deleteSplitExpense = async (req, res) => {
  try {
    const expense = await SplitExpense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Shared expense not found" });
    }

    // Check permission (creator or participant can delete)
    const userIdStr = req.user._id.toString();
    const isCreator = expense.createdBy.toString() === userIdStr;
    const isParticipant = expense.participants.some(
      (p) => (p.user && p.user.toString() === userIdStr) ||
             (p.name && p.name.toLowerCase() === req.user.name.toLowerCase())
    );

    if (!isCreator && !isParticipant) {
      return res.status(403).json({ message: "Not authorized to delete this shared expense" });
    }

    // Auto-delete linked personal expense entries
    await Expense.deleteMany({ splitExpenseId: req.params.id });

    await SplitExpense.findByIdAndDelete(req.params.id);

    res.json({ message: "Shared expense deleted successfully" });
  } catch (error) {
    console.error("Delete split expense error:", error.message);
    res.status(500).json({ message: "Server error deleting split expense" });
  }
};

// @desc    Update settlement status (Mark as Paid / Pending)
// @route   PATCH /api/split-expenses/:id/settlements/:settlementId
// @access  Private
export const updateSettlementStatus = async (req, res) => {
  try {
    const { id, settlementId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Paid"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'Pending' or 'Paid'" });
    }

    const expense = await SplitExpense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Shared expense not found" });
    }

    const settlement = expense.settlements.id(settlementId);
    if (!settlement) {
      return res.status(404).json({ message: "Settlement record not found" });
    }

    settlement.status = status;
    if (status === "Paid") {
      settlement.paidAt = new Date();
      settlement.paidBy = req.user._id;
    } else {
      settlement.paidAt = null;
      settlement.paidBy = null;
    }

    await expense.save();

    const updated = await SplitExpense.findById(id)
      .populate("createdBy", "name email")
      .populate("payers.user", "name email")
      .populate("participants.user", "name email");

    res.json(updated);
  } catch (error) {
    console.error("Update settlement status error:", error.message);
    res.status(500).json({ message: "Server error updating settlement" });
  }
};

// @desc    Get dashboard summary metrics for shared expenses
// @route   GET /api/split-expenses/summary
// @access  Private
export const getSplitSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const userIdStr = userId.toString();
    const userName = req.user.name?.toLowerCase().trim();

    const expenses = await SplitExpense.find({
      $or: [
        { createdBy: userId },
        { "payers.user": userId },
        { "participants.user": userId },
        { "participants.name": { $regex: new RegExp(`^${userName}$`, "i") } },
      ],
    }).sort({ date: -1 });

    let totalPaid = 0;
    let totalOwedToYou = 0; // positive balances of user or others owing user in pending settlements
    let totalYouOwe = 0;   // negative balance of user or user owing others in pending settlements
    const pendingSettlements = [];

    expenses.forEach((e) => {
      // User's participant entry in this expense
      const userPart = e.participants.find(
        (p) => (p.user && p.user.toString() === userIdStr) ||
               (p.name && p.name.toLowerCase().trim() === userName)
      );

      if (userPart) {
        totalPaid += userPart.paidAmount || 0;
      }

      // Check settlements in this expense
      e.settlements.forEach((s) => {
        if (s.status === "Pending") {
          const isFromUser = (s.fromUser && s.fromUser.toString() === userIdStr) ||
                             (s.fromName && s.fromName.toLowerCase().trim() === userName);
          const isToUser = (s.toUser && s.toUser.toString() === userIdStr) ||
                           (s.toName && s.toName.toLowerCase().trim() === userName);

          if (isFromUser) {
            totalYouOwe += s.amount;
            pendingSettlements.push({
              expenseId: e._id,
              expenseDescription: e.description,
              settlementId: s._id,
              type: "you_owe",
              otherPersonName: s.toName,
              amount: s.amount,
              date: e.date,
            });
          } else if (isToUser) {
            totalOwedToYou += s.amount;
            pendingSettlements.push({
              expenseId: e._id,
              expenseDescription: e.description,
              settlementId: s._id,
              type: "owed_to_you",
              otherPersonName: s.fromName,
              amount: s.amount,
              date: e.date,
            });
          }
        }
      });
    });

    res.json({
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalOwedToYou: Math.round(totalOwedToYou * 100) / 100,
      totalYouOwe: Math.round(totalYouOwe * 100) / 100,
      pendingCount: pendingSettlements.length,
      pendingSettlements,
      recentSharedExpenses: expenses.slice(0, 5),
    });
  } catch (error) {
    console.error("Get split summary error:", error.message);
    res.status(500).json({ message: "Server error fetching split summary" });
  }
};
