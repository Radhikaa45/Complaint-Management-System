import { useState } from "react";
import { Inbox, AlertTriangle, CheckCircle2, Timer } from "lucide-react";
import { averageResolutionHours, formatDuration } from "../utils/complaint";

const WEEK = 7 * 24 * 36e5;

function StatsCard({ complaints }) {

  const [now] = useState(() => Date.now());
  const total = complaints.length;
  const open = complaints.filter((c) => c.status === "Submitted" || c.status === "In Process").length;
  const urgent = complaints.filter((c) => c.priority === "High" && (c.status === "Submitted" || c.status === "In Process")).length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const thisWeek = complaints.filter((c) => now - new Date(c.createdAt) < WEEK).length;
  const avg = averageResolutionHours(complaints);

  const cards = [
    { label: "Total Complaints", value: total, icon: Inbox, tone: "bg-blue-50 text-blue-600", note: `${thisWeek} in the last 7 days` },
    { label: "Open Issues", value: open, icon: AlertTriangle, tone: "bg-amber-50 text-amber-600", note: urgent ? `${urgent} high priority` : "No urgent issues", noteTone: urgent ? "text-rose-600" : "text-gray-400" },
    { label: "Resolved", value: resolved, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600", note: `${total ? Math.round((resolved / total) * 100) : 0}% resolution rate` },
    { label: "Avg. Resolution Time", value: formatDuration(avg), icon: Timer, tone: "bg-violet-50 text-violet-600", note: "Target: 3 days", noteTone: avg != null && avg > 72 ? "text-rose-600" : "text-gray-400" }
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map(({ label, value, icon: Icon, tone, note, noteTone = "text-gray-400" }) => (
        <div key={label} className="card p-5">
          <div className="flex items-start justify-between">
            <p className="text-gray-500 text-sm">{label}</p>
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${tone}`}><Icon size={18} /></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</h2>
          <p className={`text-xs mt-2 ${noteTone}`}>{note}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCard;
