import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { StatusBadge, PriorityBadge } from "./Badges";
import { timeAgo } from "../utils/complaint";

function RecentComplaints({ complaints, onSelect, title = "Recent Complaints", limit = 6, emptyText = "No complaints yet." }) {

  const recent = complaints.slice(0, limit);

  return (
    <div className="card overflow-hidden">

      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <Link to="/admin/complaints" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-gray-400 px-6 py-10 text-center">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {recent.map((c) => (
            <li key={c._id}>
              <button
                onClick={() => onSelect?.(c)}
                className="w-full text-left px-6 py-3.5 hover:bg-slate-50 transition flex items-center gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{c.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    <span className="font-mono">#{c.complaintId}</span> · {c.name} · {timeAgo(c.createdAt)}
                  </p>
                </div>
                <div className="hidden sm:block"><PriorityBadge priority={c.priority} /></div>
                <StatusBadge status={c.status} />
              </button>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default RecentComplaints;
