import { STATUS_STYLES, PRIORITY_STYLES } from "../utils/complaint";

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset whitespace-nowrap ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600 ring-gray-200"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority = "Medium" }) {
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-md ring-1 ring-inset whitespace-nowrap ${PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium}`}>
      {priority}
    </span>
  );
}

export function CategoryBadge({ category = "General" }) {
  return (
    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200 whitespace-nowrap">
      {category}
    </span>
  );
}
