import { useState } from "react";
import { RefreshCw } from "lucide-react";
import StatsCards from "../components/StatsCard";
import StatusChart from "../components/StatusChart";
import RecentComplaints from "../components/RecentComplaints";
import ComplaintModal from "../components/ComplaintModal";
import useComplaints from "../hooks/useComplaints";
import { getUser } from "../api";

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };

function AdminDashboard() {

  const { complaints, loading, error, refresh, replace, remove } = useComplaints();
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const user = getUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Open complaints, most urgent and oldest first
  const needsAttention = complaints
    .filter((c) => c.status === "Submitted" || c.status === "In Process")
    .sort((a, b) =>
      (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1) ||
      new Date(a.createdAt) - new Date(b.createdAt)
    );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="h-80 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}{user?.email ? `, ${user.email.split("@")[0]}` : ""} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening across your workplace today.</p>
        </div>
        <button onClick={handleRefresh} className="btn-secondary text-sm py-2">
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">{error}</div>
      )}

      <StatsCards complaints={complaints} />

      <div className="grid lg:grid-cols-3 gap-6">

        <StatusChart complaints={complaints} />

        <div className="lg:col-span-2 space-y-6">
          <RecentComplaints
            title="Needs Attention"
            complaints={needsAttention}
            onSelect={setSelected}
            limit={5}
            emptyText="🎉 All caught up - no open complaints."
          />
          <RecentComplaints complaints={complaints} onSelect={setSelected} limit={5} />
        </div>

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

export default AdminDashboard;
