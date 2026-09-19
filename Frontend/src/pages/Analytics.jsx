import { useMemo, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, Cell
} from "recharts";
import { Star, Timer, TrendingUp, Users } from "lucide-react";
import useComplaints from "../hooks/useComplaints";
import {
  CATEGORIES, PRIORITIES, PRIORITY_COLORS, resolutionHours, averageResolutionHours, formatDuration
} from "../utils/complaint";

const RANGES = { 7: "7 days", 14: "14 days", 30: "30 days", 90: "90 days" };
// Local calendar day, so buckets match the labels shown
const dayKey = (value) => { const d = new Date(value); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };

function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <div className={`card p-6 ${className}`}>
      <h2 className="font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${tone}`}><Icon size={20} /></span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function Analytics() {

  const { complaints, loading, error } = useComplaints();
  const [range, setRange] = useState(14);
  const [now] = useState(() => Date.now());

  const inRange = useMemo(() => {
    const since = now - range * 864e5;
    return complaints.filter((c) => new Date(c.createdAt) >= since);
  }, [complaints, range, now]);

  /* Daily submitted vs resolved */
  const trend = useMemo(() => {
    const days = [];
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(now - i * 864e5);
      days.push({ key: dayKey(d), label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), Submitted: 0, Resolved: 0 });
    }
    const byKey = Object.fromEntries(days.map((d) => [d.key, d]));
    complaints.forEach((c) => {
      if (byKey[dayKey(c.createdAt)]) byKey[dayKey(c.createdAt)].Submitted++;
      if (c.status === "Resolved" && c.resolvedAt && byKey[dayKey(c.resolvedAt)]) byKey[dayKey(c.resolvedAt)].Resolved++;
    });
    return days;
  }, [complaints, range, now]);

  const byCategory = useMemo(() =>
    CATEGORIES.map((cat) => {
      const items = inRange.filter((c) => (c.category || "General") === cat);
      return { name: cat, count: items.length, avg: averageResolutionHours(items) };
    }).filter((c) => c.count > 0).sort((a, b) => b.count - a.count),
  [inRange]);

  const byPriority = PRIORITIES.map((p) => ({
    name: p,
    count: inRange.filter((c) => (c.priority || "Medium") === p).length
  }));

  const byUserType = ["Employee", "Visitor", "Client"].map((t) => ({
    name: t,
    count: inRange.filter((c) => c.userType === t).length
  }));

  const ratings = inRange.filter((c) => c.feedback?.rating).map((c) => c.feedback.rating);
  const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;
  const resolvedCount = inRange.filter((c) => resolutionHours(c) != null).length;
  const within3Days = inRange.filter((c) => { const h = resolutionHours(c); return h != null && h <= 72; }).length;

  if (loading) {
    return <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />;
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Trends and team performance over time.</p>
        </div>
        <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1">
          {Object.entries(RANGES).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setRange(Number(value))}
              className={`px-3 py-1.5 text-sm rounded-md transition ${range === Number(value) ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Kpi icon={TrendingUp} label={`New in last ${RANGES[range]}`} value={inRange.length} tone="bg-blue-50 text-blue-600" />
        <Kpi icon={Timer} label="Avg. resolution time" value={formatDuration(averageResolutionHours(inRange))} tone="bg-violet-50 text-violet-600" />
        <Kpi icon={Users} label="Resolved within 3 days" value={resolvedCount ? `${Math.round((within3Days / resolvedCount) * 100)}%` : "—"} tone="bg-emerald-50 text-emerald-600" />
        <Kpi icon={Star} label={`Satisfaction (${ratings.length} ratings)`} value={avgRating ? `${avgRating} / 5` : "—"} tone="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <ChartCard title="Complaint Volume" subtitle="Submitted vs resolved per day" className="lg:col-span-3">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={trend} margin={{ left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="gSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} minTickGap={16} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                <Area type="monotone" dataKey="Submitted" stroke="#2563eb" strokeWidth={2} fill="url(#gSub)" />
                <Area type="monotone" dataKey="Resolved" stroke="#10b981" strokeWidth={2} fill="url(#gRes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="By Category" subtitle="Where complaints come from" className="lg:col-span-2">
          {byCategory.length === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center">No data for this period.</p>
          ) : (
            <div className="space-y-3">
              {byCategory.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{c.name}</span>
                    <span className="text-gray-500">
                      {c.count} <span className="text-gray-400">· avg {formatDuration(c.avg)}</span>
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(c.count / byCategory[0].count) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard title="By Priority">
          <div className="h-48">
            <ResponsiveContainer>
              <BarChart data={byPriority} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="count" name="Complaints" radius={[6, 6, 0, 0]}>
                  {byPriority.map((p) => <Cell key={p.name} fill={PRIORITY_COLORS[p.name]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-3">BY USER TYPE</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {byUserType.map((u) => (
                <div key={u.name} className="bg-slate-50 rounded-lg py-2">
                  <p className="text-lg font-bold text-gray-900">{u.count}</p>
                  <p className="text-xs text-gray-500">{u.name}</p>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

      </div>
    </>
  );
}

export default Analytics;
