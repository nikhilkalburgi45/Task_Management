import { useState, useEffect } from "react";

export default function TaskForm({ onSubmit, editTask, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate input when editing
  useEffect(() => {
    if (editTask) setTitle(editTask.title);
    else setTitle("");
    setError("");
  }, [editTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit(title.trim());
      setTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(editTask);

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          className={`form-input ${error ? "input-error" : ""}`}
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          disabled={loading}
          autoFocus
        />
        <button className={`btn ${isEditing ? "btn-warning" : "btn-primary"}`} type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update" : "Add Task"}
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancelEdit}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
