import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Loader2, FileText, Star, Paperclip } from "lucide-react";
import { trackComplaint, sendFeedback, uploadUrl, errorMessage } from "../api";
import { useToast } from "../context/toast";
import { StatusBadge, PriorityBadge, CategoryBadge } from "../components/Badges";
import StatusTimeline from "../components/StatusTimeline";
import { formatDate, isImage } from "../utils/complaint";

function FeedbackForm({ complaint, onSaved }) {

  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  if (complaint.feedback?.rating) {
    return (
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900">Your Feedback</h3>
        <div className="flex gap-1 mt-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={22} className={n <= complaint.feedback.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
          ))}
        </div>
        {complaint.feedback.comment && <p className="text-sm text-gray-600 mt-3">"{complaint.feedback.comment}"</p>}
        <p className="text-xs text-gray-400 mt-3">Thanks for helping us improve!</p>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please choose a rating");
    setSaving(true);
    try {
      const res = await sendFeedback(complaint.complaintId, rating, comment);
      toast.success(res.message);
      onSaved(res.complaint);
    } catch (error) {
      toast.error(errorMessage(error, "Could not save feedback"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card p-6">
      <h3 className="font-semibold text-gray-900">How did we do?</h3>
      <p className="text-sm text-gray-500 mt-1">Rate how your complaint was handled.</p>

      <div className="flex gap-1 mt-4" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} aria-label={`${n} star`}>
            <Star size={28} className={`transition ${n <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        rows={3}
        placeholder="Anything else you'd like to share? (optional)"
        className="input mt-4"
      />

      <button disabled={saving} className="btn-primary mt-4">
        {saving && <Loader2 size={16} className="animate-spin" />} Submit Feedback
      </button>
    </form>
  );
}

function TrackComplaint() {

  const [searchParams, setSearchParams] = useSearchParams();
  const [id, setId] = useState(searchParams.get("id") || "");
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = async (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Please enter your complaint ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await trackComplaint(trimmed);
      setComplaint(data);
      setSearchParams({ id: data.complaintId }, { replace: true });
    } catch (err) {
      setComplaint(null);
      setError(err.response?.status === 404 ? "No complaint found with that ID. Please check and try again." : errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /* Auto-track when opened from a link like /track?id=abc123 */
  useEffect(() => {
    const initial = searchParams.get("id");
    if (initial) lookup(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    lookup(id);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">

      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Track Complaint</h1>
        <p className="text-gray-500 mb-8">Enter your complaint ID to check its real-time resolution status.</p>

        {/* Search Box */}
        <form onSubmit={handleSubmit} className="card p-4 sm:p-5 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="e.g. 3f9a2c1b"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="outline-none w-full py-2.5 font-mono"
              aria-label="Complaint ID"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary px-6">
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Track Status →"}
          </button>
        </form>

        {error && (
          <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3 mt-6 text-sm">{error}</p>
        )}

        {/* Complaint Result */}
        {complaint && (
          <div className="mt-8 grid lg:grid-cols-5 gap-6 animate-slide-up">

            <div className="lg:col-span-3 space-y-6">
              <div className="card p-6">

                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                  <p className="text-blue-600 text-sm font-mono font-semibold">#{complaint.complaintId}</p>
                  <StatusBadge status={complaint.status} />
                </div>

                <h2 className="text-xl font-semibold text-gray-900 break-words">{complaint.title}</h2>

                <div className="flex flex-wrap gap-2 mt-3">
                  <CategoryBadge category={complaint.category} />
                  <PriorityBadge priority={complaint.priority} />
                </div>

                <p className="text-gray-600 mt-4 whitespace-pre-line break-words">{complaint.description}</p>

                <dl className="grid grid-cols-2 gap-4 text-sm mt-6 pt-6 border-t border-gray-100">
                  <div>
                    <dt className="text-gray-400 text-xs">Submitted by</dt>
                    <dd className="text-gray-700">{complaint.name}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 text-xs">User type</dt>
                    <dd className="text-gray-700">{complaint.userType || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 text-xs">Submitted on</dt>
                    <dd className="text-gray-700">{formatDate(complaint.createdAt)}</dd>
                  </div>
                  {complaint.status === "Resolved" && (
                    <div>
                      <dt className="text-gray-400 text-xs">Resolved on</dt>
                      <dd className="text-gray-700">{formatDate(complaint.resolvedAt)}</dd>
                    </div>
                  )}
                </dl>

                {complaint.file && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-gray-400 text-xs mb-2 flex items-center gap-1"><Paperclip size={12} /> Attachment</p>
                    {isImage(complaint.file) ? (
                      <a href={uploadUrl(complaint.file)} target="_blank" rel="noreferrer">
                        <img src={uploadUrl(complaint.file)} alt="Complaint attachment" className="rounded-lg max-h-72 object-cover border border-gray-100" />
                      </a>
                    ) : (
                      <a href={uploadUrl(complaint.file)} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                        <FileText size={18} /> View attached document
                      </a>
                    )}
                  </div>
                )}

              </div>

              {complaint.status === "Resolved" && (
                <FeedbackForm complaint={complaint} onSaved={setComplaint} />
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-5">Progress</h3>
                <StatusTimeline complaint={complaint} />
              </div>
            </div>

          </div>
        )}

        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Lost your complaint ID? Check the confirmation email we sent you.</p>
          <p className="mt-2">
            Haven't reported yet? <Link to="/submit" className="text-blue-600 font-medium hover:underline">Submit a complaint</Link>
          </p>
        </div>

      </div>

    </div>
  );
}

export default TrackComplaint;
