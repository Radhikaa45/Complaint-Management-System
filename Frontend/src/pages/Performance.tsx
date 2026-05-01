import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

interface Complaint {
  id: number;
  description: string;
  category: string;
  priority: string;
  confidence: number;
  time: string;
}

export default function Performance() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints`);
        const data = await res.json();
        setComplaints(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🧠 Smart search (FIXED)
  const filtered = complaints.filter((c) => {
    const text = `${c.description} ${c.category} ${c.priority}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  // 📊 Stats
  const stats = {
    high: complaints.filter((c) => c.priority === "high").length,
    medium: complaints.filter((c) => c.priority === "medium").length,
    low: complaints.filter((c) => c.priority === "low").length,
  };

  return (
    <div className="flex bg-[#F5F7FB] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 space-y-6">
        {/* 🔹 Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            AI Dashboard
          </h1>

          {/* 🔍 Search */}
          <input
            type="text"
            placeholder="Search complaints..."
            className="border px-4 py-2 rounded-lg w-72 shadow-sm focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 🔹 Stats Cards */}
        <div className="grid grid-cols-3 gap-6">
          <Card title="High Priority" value={stats.high} color="red" />
          <Card title="Medium Priority" value={stats.medium} color="blue" />
          <Card title="Low Priority" value={stats.low} color="green" />
        </div>

        {/* 🔹 Complaints */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4 text-gray-800">
            Live Complaints
          </h3>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-400">No results found</p>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center p-4 border rounded-lg mb-3 hover:shadow-md transition"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {c.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {c.category} • {c.time}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Badge priority={c.priority} />

                  <span className="text-xs text-gray-500">
                    {c.confidence}% AI
                  </span>

                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
                    Action
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// 🔹 Card Component
function Card({ title, value, color }: any) {
  const styles: any = {
    red: "bg-red-50 border-red-400 text-red-600",
    blue: "bg-blue-50 border-blue-400 text-blue-600",
    green: "bg-green-50 border-green-400 text-green-600",
  };

  return (
    <div
      className={`p-5 rounded-xl border-l-4 shadow-sm ${styles[color]}`}
    >
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

// 🔹 Badge
function Badge({ priority }: any) {
  const styles: any = {
    high: "bg-red-100 text-red-600",
    medium: "bg-blue-100 text-blue-600",
    low: "bg-green-100 text-green-600",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${styles[priority]}`}>
      {priority}
    </span>
  );
}