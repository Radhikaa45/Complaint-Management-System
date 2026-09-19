import { useMemo, useState } from "react";
import { Search, Download, ChevronLeft, ChevronRight, ArrowUpDown, Inbox, X } from "lucide-react";
import ComplaintModal from "../components/ComplaintModal";
import { StatusBadge, PriorityBadge, CategoryBadge } from "../components/Badges";
import useComplaints from "../hooks/useComplaints";
import { STATUSES, PRIORITIES, CATEGORIES, formatDate, exportCsv } from "../utils/complaint";

const PAGE_SIZE = 10;
const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };

const SORTS = {
  newest: { label: "Newest first", fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  oldest: { label: "Oldest first", fn: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
  priority: { label: "Priority", fn: (a, b) => (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1) },
  updated: { label: "Recently updated", fn: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt) }
};

function FilterSelect({ value, onChange, options, label }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input py-2 text-sm w-auto" aria-label={label}>
      <option value="">{label}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function ComplaintHistory() {

  const { complaints, loading, error, replace, remove } = useComplaints();
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return complaints
      .filter((c) =>
        (!status || c.status === status) &&
        (!priority || (c.priority || "Medium") === priority) &&
        (!category || (c.category || "General") === category) &&
        (!q || [c.complaintId, c.name, c.email, c.title, c.description].some((v) => v?.toLowerCase().includes(q)))
      )
      .sort(SORTS[sort].fn);
  }, [complaints, search, status, priority, category, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const hasFilters = search || status || priority || category;

  // Reset to page 1 whenever a filter changes
  const withReset = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setCategory("");
    setPage(1);
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="text-gray-500 mt-1">Search, filter and manage every complaint.</p>
        </div>
        <button
          onClick={() => exportCsv(filtered, `complaints-${new Date().toISOString().slice(0, 10)}.csv`)}
          disabled={!filtered.length}
          className="btn-secondary text-sm py-2"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Toolbar */}
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] border border-gray-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500/40">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => withReset(setSearch)(e.target.value)}
            placeholder="Search by ID, name, email or text..."
            className="outline-none w-full py-2 text-sm"
          />
        </div>
        <FilterSelect value={status} onChange={withReset(setStatus)} options={STATUSES} label="All statuses" />
        <FilterSelect value={priority} onChange={withReset(setPriority)} options={PRIORITIES} label="All priorities" />
        <FilterSelect value={category} onChange={withReset(setCategory)} options={CATEGORIES} label="All categories" />
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ArrowUpDown size={14} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input py-2 text-sm w-auto" aria-label="Sort">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">{error}</div>
      )}

      <div className="card overflow-hidden">

        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 bg-gray-100 rounded" />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Inbox size={40} className="mx-auto mb-3 text-gray-300" />
            {hasFilters ? "No complaints match your filters." : "No complaints yet."}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-5 py-3 font-medium">Complaint</th>
                    <th className="px-5 py-3 font-medium">Submitted by</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Priority</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((c) => (
                    <tr key={c._id} onClick={() => setSelected(c)} className="hover:bg-slate-50 cursor-pointer transition">
                      <td className="px-5 py-3 max-w-xs">
                        <p className="font-medium text-gray-800 truncate">{c.title}</p>
                        <p className="text-xs text-gray-400 font-mono">#{c.complaintId}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-gray-700">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.userType}</p>
                      </td>
                      <td className="px-5 py-3"><CategoryBadge category={c.category} /></td>
                      <td className="px-5 py-3"><PriorityBadge priority={c.priority} /></td>
                      <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="md:hidden divide-y divide-gray-100">
              {rows.map((c) => (
                <li key={c._id}>
                  <button onClick={() => setSelected(c)} className="w-full text-left p-4 hover:bg-slate-50">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-gray-800">{c.title}</p>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1"><span className="font-mono">#{c.complaintId}</span> · {c.name} · {formatDate(c.createdAt, false)}</p>
                    <div className="flex gap-2 mt-2">
                      <CategoryBadge category={c.category} />
                      <PriorityBadge priority={c.priority} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
              <span>
                Showing {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(current - 1)} disabled={current === 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40" aria-label="Previous page">
                  <ChevronLeft size={18} />
                </button>
                <span className="px-2">{current} / {pages}</span>
                <button onClick={() => setPage(current + 1)} disabled={current === pages} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40" aria-label="Next page">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}

      </div>

      {selected && (
        <ComplaintModal
          complaint={selected}
          close={() => setSelected(null)}
          onUpdated={replace}
          onDeleted={remove}
        />
      )}
    </>
  );
}

export default ComplaintHistory;
