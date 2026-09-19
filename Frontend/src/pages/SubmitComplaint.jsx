import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UploadCloud, FileText, X, Sparkles, CheckCircle2, Copy, Check, Loader2 } from "lucide-react";
import { submitComplaint, analyzeComplaint, errorMessage } from "../api";
import { useToast } from "../context/toast";
import { PriorityBadge, CategoryBadge } from "../components/Badges";

const EMPTY = { name: "", email: "", userType: "", title: "", description: "" };
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1.5">{children}</div>
      {error ? <p className="text-xs text-rose-600 mt-1">{error}</p> : hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function SubmitComplaint() {

  const toast = useToast();

  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const fileInput = useRef(null);

  /* Live AI suggestion while typing (debounced) */
  useEffect(() => {
    const text = `${formData.title}\n${formData.description}`.trim();
    if (formData.description.trim().length < 20) {
      setSuggestion(null);
      return;
    }
    const timer = setTimeout(() => {
      analyzeComplaint(text).then(setSuggestion).catch(() => setSuggestion(null));
    }, 1200);
    return () => clearTimeout(timer);
  }, [formData.title, formData.description]);

  /* Image preview URL lifecycle */
  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const pickFile = (f) => {
    if (!f) return;
    if (!ALLOWED.includes(f.type)) {
      toast.error("Only JPG, PNG, WEBP or PDF files are allowed");
      return;
    }
    if (f.size > MAX_SIZE) {
      toast.error("File is too large (max 5MB)");
      return;
    }
    setFile(f);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Please enter your name";
    if (!emailRegex.test(formData.email)) e.email = "Please enter a valid email address";
    if (!formData.userType) e.userType = "Please select a user type";
    if (formData.title.trim().length < 5) e.title = "Title should be at least 5 characters";
    if (formData.description.trim().length < 15) e.description = "Please describe the issue in a bit more detail (15+ characters)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v.trim()));
      if (file) data.append("file", file);

      const res = await submitComplaint(data);
      setResult(res);
      setFormData(EMPTY);
      removeFile();
      setSuggestion(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(errorMessage(error, "Complaint submission failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(result.complaintId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy - please copy the ID manually");
    }
  };

  /* ---------- Success screen ---------- */

  if (result) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="card max-w-lg w-full p-8 text-center animate-slide-up">

          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={34} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-5">Complaint Submitted!</h1>
          <p className="text-gray-500 mt-2">
            We've emailed you a confirmation. Save your tracking ID to follow progress.
          </p>

          <div className="mt-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Tracking ID</p>
            <div className="flex items-center justify-center gap-3 mt-1">
              <span className="text-2xl font-mono font-bold text-blue-600 tracking-wider">{result.complaintId}</span>
              <button onClick={copyId} className="p-2 rounded-lg hover:bg-white text-gray-500" title="Copy ID" aria-label="Copy ID">
                {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {result.category && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              Routed to <CategoryBadge category={result.category} /> with <PriorityBadge priority={result.priority} /> priority
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to={`/track?id=${result.complaintId}`} className="btn-primary flex-1">Track Status</Link>
            <button onClick={() => setResult(null)} className="btn-secondary flex-1">Submit Another</button>
          </div>

        </div>
      </div>
    );
  }

  /* ---------- Form ---------- */

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">

      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Submit a Complaint</h1>

        <p className="text-gray-500 mt-2 mb-8">
          Is something not right in the office? Let our team know so we can fix it promptly.
        </p>

        <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-10 space-y-6">

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Full Name" error={errors.name}>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Enter your full name" className="input" maxLength={100} autoComplete="name" />
            </Field>

            <Field label="Email Address" error={errors.email}>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@company.com" className="input" autoComplete="email" />
            </Field>
          </div>

          <Field label="I am a..." error={errors.userType}>
            <div className="grid grid-cols-3 gap-3">
              {["Employee", "Visitor", "Client"].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => handleChange({ target: { name: "userType", value: type } })}
                  className={`py-2.5 rounded-lg border text-sm font-medium transition
                  ${formData.userType === type ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Complaint Title" error={errors.title}>
            <input type="text" name="title" value={formData.title} onChange={handleChange}
              placeholder="Brief summary of the issue" className="input" maxLength={150} />
          </Field>

          <Field
            label="Describe Issue"
            error={errors.description}
            hint={`${formData.description.length}/3000 characters`}
          >
            <textarea name="description" rows="5" value={formData.description} onChange={handleChange}
              placeholder="Where is it, when did it start, how is it affecting you?" className="input resize-y" maxLength={3000} />
          </Field>

          {suggestion && (
            <div className="flex flex-wrap items-center gap-2 text-sm bg-indigo-50/60 border border-indigo-100 rounded-lg px-3 py-2 animate-fade-in">
              <Sparkles size={16} className="text-indigo-500" />
              <span className="text-gray-600">Looks like</span>
              <CategoryBadge category={suggestion.category} />
              <span className="text-gray-600">with</span>
              <PriorityBadge priority={suggestion.priority} />
              <span className="text-gray-600">priority</span>
            </div>
          )}

          {/* Upload */}
          <Field label="Attachment (optional)">
            {file ? (
              <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-3">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                    <FileText size={26} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
                <button type="button" onClick={removeFile} className="p-2 text-gray-400 hover:text-rose-600" aria-label="Remove file">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); pickFile(e.dataTransfer.files[0]); }}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-36 cursor-pointer transition
                ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"}`}
              >
                <UploadCloud className={dragging ? "text-blue-500" : "text-gray-400"} size={28} />
                <p className="text-gray-500 text-sm mt-2">
                  <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP or PDF (max. 5MB)</p>
                <input ref={fileInput} type="file" accept=".png,.jpg,.jpeg,.webp,.pdf"
                  onChange={(e) => pickFile(e.target.files[0])} className="hidden" />
              </label>
            )}
          </Field>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
            {submitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : "Submit Complaint"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default SubmitComplaint;
