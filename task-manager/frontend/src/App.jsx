import { useState, useEffect, useCallback } from "react";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import TaskFilter from "./components/TaskFilter";
import { fetchTasks, createTask, updateTask, deleteTask } from "./api/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async (status) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchTasks(status);
      setTasks(res.data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks(filter);
  }, [filter, loadTasks]);

  // Derived counts (use all tasks for counts — re-fetch all for badge accuracy)
  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const handleAdd = async (title) => {
    const res = await createTask(title);
    // Always reload to reflect server state correctly
    await loadTasks(filter);
    return res;
  };

  const handleUpdate = async (title) => {
    await updateTask(editTask._id, { title });
    setEditTask(null);
    await loadTasks(filter);
  };

  const handleToggle = async (id, currentCompleted) => {
    try {
      await updateTask(id, { completed: !currentCompleted });
      await loadTasks(filter);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      if (editTask?._id === id) setEditTask(null);
      await loadTasks(filter);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Task Manager</h1>
        <p className="app-subtitle">Stay on top of your work</p>
      </header>

      <main className="app-main">
        <TaskForm
          onSubmit={editTask ? handleUpdate : handleAdd}
          editTask={editTask}
          onCancelEdit={() => setEditTask(null)}
        />

        <TaskFilter active={filter} onChange={setFilter} counts={counts} />

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
            <button className="alert-close" onClick={() => setError("")}>✕</button>
          </div>
        )}

        {loading ? (
          <div className="state-box">
            <div className="spinner" />
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="state-box empty">
            <span className="empty-icon">📋</span>
            <p>
              {filter === "all"
                ? "No tasks yet. Add one above!"
                : `No ${filter} tasks.`}
            </p>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={setEditTask}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
