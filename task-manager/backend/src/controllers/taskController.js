const Task = require("../models/Task");

// GET /tasks  — optionally filter by ?status=completed|pending
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status === "completed") filter.completed = true;
    else if (status === "pending") filter.completed = false;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
};

// POST /tasks
const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const task = await Task.create({ title: title.trim() });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
};

// PATCH /tasks/:id — update title and/or completed status
const updateTask = async (req, res) => {
  try {
    const { title, completed } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res
          .status(400)
          .json({ success: false, message: "Title cannot be empty" });
      }
      updates.title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res
          .status(400)
          .json({ success: false, message: "completed must be a boolean" });
      }
      updates.completed = completed;
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid fields provided to update" });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({ success: false, message: "Failed to update task" });
  }
};

// DELETE /tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({ success: false, message: "Failed to delete task" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
