import Expense from "../models/expenseModel.js";

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note, paymentMode } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ message: "Title, amount, and category are required" });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      title,
      amount,
      category,
      date: date || new Date(),
      note: note || "",
      paymentMode: paymentMode || "Cash",
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Add expense error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all expenses for the logged-in user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
  try {
    const { category, month, year, startDate, endDate } = req.query;

    let query = { userId: req.user._id };

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Filter by month & year
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }

    // Filter by date range
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Make sure user owns the expense
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Update expense error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({ message: "Expense deleted" });
  } catch (error) {
    console.error("Delete expense error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get expense analytics (monthly totals for last 6 months)
// @route   GET /api/expenses/analytics
// @access  Private
export const getExpenseAnalytics = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const result = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            category: "$category",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Analytics error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
