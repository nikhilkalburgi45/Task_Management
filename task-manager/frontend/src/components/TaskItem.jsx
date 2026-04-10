export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <label className="task-check-label">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggle(task._id, task.completed)}
        />
        <span className="checkmark" />
      </label>

      <span className="task-title">{task.title}</span>

      <div className="task-actions">
        <button
          className="btn-icon btn-edit"
          onClick={() => onEdit(task)}
          title="Edit task"
          disabled={task.completed}
        >
          ✏️
        </button>
        <button
          className="btn-icon btn-delete"
          onClick={() => onDelete(task._id)}
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
