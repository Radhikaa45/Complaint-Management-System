export const STATUSES = ["Submitted", "In Process", "Resolved", "Rejected"];
export const PRIORITIES = ["High", "Medium", "Low"];
export const CATEGORIES = ["IT", "Facilities", "HR", "Security", "Housekeeping", "General"];

export const STATUS_STYLES = {
  Submitted: "bg-blue-100 text-blue-700 ring-blue-200",
  "In Process": "bg-amber-100 text-amber-700 ring-amber-200",
  Resolved: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  Rejected: "bg-rose-100 text-rose-700 ring-rose-200"
};

export const STATUS_COLORS = {
  Submitted: "#2563eb",
  "In Process": "#f59e0b",
  Resolved: "#10b981",
  Rejected: "#f43f5e"
};

export const PRIORITY_STYLES = {
  High: "bg-rose-50 text-rose-700 ring-rose-200",
  Medium: "bg-orange-50 text-orange-700 ring-orange-200",
  Low: "bg-slate-100 text-slate-600 ring-slate-200"
};

export const PRIORITY_COLORS = { High: "#e11d48", Medium: "#f97316", Low: "#94a3b8" };

export const formatDate = (date, withTime = true) => {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {})
  });
};

export const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units = [["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [name, secs] of units) {
    const n = Math.floor(seconds / secs);
    if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

export const formatDuration = (hours) => {
  if (hours == null || Number.isNaN(hours)) return "—";
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min`;
  if (hours < 48) return `${Math.round(hours * 10) / 10} hrs`;
  return `${Math.round((hours / 24) * 10) / 10} days`;
};

// Hours between creation and resolution, for resolved complaints only
export const resolutionHours = (c) =>
  c.status === "Resolved" && c.resolvedAt
    ? (new Date(c.resolvedAt) - new Date(c.createdAt)) / 36e5
    : null;

export const averageResolutionHours = (complaints) => {
  const values = complaints.map(resolutionHours).filter((h) => h != null);
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
};

export const isImage = (file = "") => /\.(png|jpe?g|webp|gif)$/i.test(file);

// Download complaints as a CSV file
export const exportCsv = (complaints, filename = "complaints.csv") => {
  const columns = [
    ["ID", (c) => c.complaintId],
    ["Name", (c) => c.name],
    ["Email", (c) => c.email],
    ["User Type", (c) => c.userType],
    ["Title", (c) => c.title],
    ["Description", (c) => c.description],
    ["Category", (c) => c.category || "General"],
    ["Priority", (c) => c.priority || "Medium"],
    ["Status", (c) => c.status],
    ["Submitted", (c) => c.createdAt && new Date(c.createdAt).toISOString()],
    ["Resolved", (c) => c.resolvedAt && new Date(c.resolvedAt).toISOString()],
    ["Rating", (c) => c.feedback?.rating]
  ];

  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [columns.map(([h]) => escape(h)).join(",")].concat(
    complaints.map((c) => columns.map(([, get]) => escape(get(c))).join(","))
  );

  const blob = new Blob(["﻿" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
