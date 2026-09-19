import { CheckCircle2, Circle, Clock, FileText, XCircle } from "lucide-react";
import { STATUS_COLORS, formatDate } from "../utils/complaint";

const ICON = {
  Submitted: FileText,
  "In Process": Clock,
  Resolved: CheckCircle2,
  Rejected: XCircle
};

// Older complaints have no history array, so build a minimal one from their dates
const buildHistory = (complaint) => {
  if (complaint.history?.length) return complaint.history;

  const history = [{ status: "Submitted", at: complaint.createdAt }];
  if (complaint.status === "In Process") history.push({ status: "In Process", at: complaint.updatedAt });
  if (complaint.status === "Resolved") history.push({ status: "Resolved", at: complaint.resolvedAt || complaint.updatedAt });
  if (complaint.status === "Rejected") history.push({ status: "Rejected", at: complaint.updatedAt });
  return history;
};

function StatusTimeline({ complaint }) {

  const history = buildHistory(complaint);
  const done = ["Resolved", "Rejected"].includes(complaint.status);

  return (
    <ol className="relative">
      {history.map((h, i) => {
        const Icon = ICON[h.status] || Circle;
        const last = i === history.length - 1;
        return (
          <li key={i} className="flex gap-3 pb-5 last:pb-0 relative">
            {(!last || !done) && (
              <span className="absolute left-[11px] top-7 bottom-0 w-px bg-gray-200" />
            )}
            <Icon size={24} className="shrink-0 bg-white" style={{ color: STATUS_COLORS[h.status] }} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800">{h.status}</p>
              <p className="text-xs text-gray-400">{formatDate(h.at)}</p>
              {h.note && (
                <p className="mt-1 text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 break-words">
                  {h.note}
                </p>
              )}
            </div>
          </li>
        );
      })}

      {!done && (
        <li className="flex gap-3 relative">
          <Circle size={24} className="shrink-0 text-gray-300" strokeDasharray="3 3" />
          <p className="text-sm text-gray-400 pt-0.5">Awaiting resolution</p>
        </li>
      )}
    </ol>
  );
}

export default StatusTimeline;
