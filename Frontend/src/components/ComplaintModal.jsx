import { useEffect, useState } from "react";
import { X, Trash2, Loader2, FileText, Star, Mail, User, Paperclip } from "lucide-react";
import { updateComplaintStatus, deleteComplaint, uploadUrl, errorMessage } from "../api";
import { useToast } from "../context/toast";
import { StatusBadge } from "./Badges";
import StatusTimeline from "./StatusTimeline";
import { STATUSES, PRIORITIES, CATEGORIES, STATUS_COLORS, formatDate, isImage } from "../utils/complaint";

function ComplaintModal({ complaint, close, onUpdated, onDeleted }) {

  const toast = useToast();

  const [status, setStatus] = useState(complaint.status);
  const [priority, setPriority] = useState(complaint.priority || "Medium");
  const [category, setCategory] = useState(complaint.category || "General");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dirty =
    status !== complaint.status ||
    priority !== (complaint.priority || "Medium") ||
    category !== (complaint.category || "General") ||
    note.trim() !== "";

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [close]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await updateComplaintStatus(complaint._id, { status, priority, category, note });
      toast.success(`Complaint #${complaint.complaintId} updated`);
      onUpdated?.(res.complaint);
      close();
    } catch (error) {
      toast.error(errorMessage(error, "Status update failed"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setSaving(true);
    try {
      await deleteComplaint(complaint._id);
      toast.success(`Complaint #${complaint.complaintId} deleted`);
      onDeleted?.(complaint._id);
      close();
    } catch (error) {
      toast.error(errorMessage(error, "Delete failed"));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4 animate-fade-in" onClick={close}>

      <div
        className="bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >

        {/* Header */}
        <div className="flex justify-between items-start gap-4 border-b border-gray-100 px-6 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-sm text-blue-600 font-semibold">#{complaint.complaintId}</span>
              <StatusBadge status={complaint.status} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mt-1 break-words">{complaint.title}</h2>
          </div>
          <button onClick={close} className="text-gray-400 hover:text-gray-600 p-1" aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 grid md:grid-cols-5 gap-6">

          <div className="md:col-span-3 space-y-5">

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <p className="flex items-center gap-2 text-gray-700"><User size={15} className="text-gray-400" /> {complaint.name} <span className="text-gray-400">· {complaint.userType}</span></p>
              <a href={`mailto:${complaint.email}`} className="flex items-center gap-2 text-blue-600 hover:underline truncate"><Mail size={15} className="text-gray-400" /> {complaint.email}</a>
              <p className="text-gray-500">Submitted {formatDate(complaint.createdAt)}</p>
              <p className="text-gray-500">Resolved {formatDate(complaint.resolvedAt)}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs font-medium mb-2">DESCRIPTION</p>
              <div className="bg-slate-50 rounded-lg p-4 text-gray-700 leading-relaxed whitespace-pre-line break-words">
                {complaint.description}
              </div>
            </div>

            {complaint.file && (
              <div>
                <p className="text-gray-400 text-xs font-medium mb-2 flex items-center gap-1"><Paperclip size={12} /> ATTACHMENT</p>
                {isImage(complaint.file) ? (
                  <a href={uploadUrl(complaint.file)} target="_blank" rel="noreferrer">
                    <img src={uploadUrl(complaint.file)} alt="Attachment" className="rounded-lg max-h-56 border border-gray-100 object-cover" />
                  </a>
                ) : (
                  <a href={uploadUrl(complaint.file)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <FileText size={18} /> Open document
                  </a>
                )}
              </div>
            )}

            {complaint.feedback?.rating && (
              <div>
                <p className="text-gray-400 text-xs font-medium mb-2">USER FEEDBACK</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={18} className={n <= complaint.feedback.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                  ))}
                </div>
                {complaint.feedback.comment && <p className="text-sm text-gray-600 mt-2">"{complaint.feedback.comment}"</p>}
              </div>
            )}

            <div>
              <p className="text-gray-400 text-xs font-medium mb-3">HISTORY</p>
              <StatusTimeline complaint={complaint} />
            </div>

          </div>

          {/* Actions */}
          <div className="md:col-span-2 space-y-4 md:border-l md:border-gray-100 md:pl-6">

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">UPDATE STATUS</p>
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`text-sm py-2 rounded-lg border font-medium transition ${status === s ? "text-white border-transparent" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    style={status === s ? { background: STATUS_COLORS[s] } : undefined}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-medium text-gray-500">
                PRIORITY
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input mt-1 py-2 text-sm">
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label className="text-xs font-medium text-gray-500">
                CATEGORY
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input mt-1 py-2 text-sm">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
            </div>

            <label className="block text-xs font-medium text-gray-500">
              NOTE TO USER <span className="font-normal text-gray-400">(shown on tracking page & email)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="e.g. Technician scheduled for tomorrow 10am"
                className="input mt-1 text-sm"
              />
            </label>

            <button onClick={save} disabled={!dirty || saving} className="btn-primary w-full">
              {saving && <Loader2 size={16} className="animate-spin" />} Save Changes
            </button>

            <div className="pt-4 border-t border-gray-100">
              {confirmDelete ? (
                <div className="bg-rose-50 border border-rose-100 rounded-lg p-3">
                  <p className="text-sm text-rose-700">Delete this complaint permanently?</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setConfirmDelete(false)} className="btn-secondary flex-1 py-1.5 text-sm">Cancel</button>
                    <button onClick={remove} disabled={saving} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg py-1.5 text-sm font-medium">Delete</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)} className="w-full flex items-center justify-center gap-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg py-2">
                  <Trash2 size={16} /> Delete complaint
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ComplaintModal;
