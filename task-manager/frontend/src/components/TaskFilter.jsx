const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export default function TaskFilter({ active, onChange, counts }) {
  return (
    <div className="filter-bar">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          className={`filter-btn ${active === f.value ? "filter-active" : ""}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
          {counts[f.value] !== undefined && (
            <span className="filter-count">{counts[f.value]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
