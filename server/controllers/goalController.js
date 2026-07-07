import Goal from "../models/goalModel.js";

// @desc    Create a goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, icon, color } = req.body;
    if (!title || !targetAmount) {
      return res.status(400).json({ message: "Title and target amount are required" });
    }
    const goal = await Goal.create({
      userId: req.user._id,
      title,
      targetAmount,
      deadline: deadline || null,
      icon: icon || "🎯",
      color: color || "#8b5cf6",
    });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add money to a goal (contribute)
// @route   PUT /api/goals/:id/contribute
// @access  Private
export const contributeToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount required" });
    }
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    goal.savedAmount = Math.min(goal.savedAmount + Number(amount), goal.targetAmount);
    if (goal.savedAmount >= goal.targetAmount) goal.isCompleted = true;
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const updated = await Goal.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
