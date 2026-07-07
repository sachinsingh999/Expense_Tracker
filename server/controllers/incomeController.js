import Income from "../models/incomeModel.js";

// @desc    Add a new income
// @route   POST /api/income
// @access  Private
export const addIncome = async (req, res) => {
  try {
    const { title, amount, source, date, note } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    const income = await Income.create({
      userId: req.user._id,
      title,
      amount,
      source: source || "Other",
      date: date || new Date(),
      note: note || "",
    });

    res.status(201).json(income);
  } catch (error) {
    console.error("Add income error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all income for logged-in user
// @route   GET /api/income
// @access  Private
export const getIncome = async (req, res) => {
  try {
    const { month, year } = req.query;

    let query = { userId: req.user._id };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }

    const income = await Income.find(query).sort({ date: -1 });

    res.json(income);
  } catch (error) {
    console.error("Get income error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    if (income.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Income.findByIdAndDelete(req.params.id);

    res.json({ message: "Income deleted" });
  } catch (error) {
    console.error("Delete income error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
