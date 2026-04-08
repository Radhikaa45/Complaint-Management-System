import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

interface Complaint {
  id: number;
  description: string;
  category: string;
  priority: string; // make flexible (important)
  confidence: number;
  time: string;
}

export default function Performance() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 REAL-TIME FETCH (polling every 5 sec)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/complaints");
        const data = await res.json();

        console.log("LIVE DATA:", data); // 🔍 DEBUG

        setComplaints([...data]); // force re-render
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ NORMALIZE PRIORITY (REAL FIX)
  const normalized = complaints.map((c) => ({
    ...c,
    priority: String(c.priority).toLowerCase().trim(),
  }));

  // 📊 STATS (REAL-TIME NOW WORKS)
  const stats = {
    high: normalized.filter((c) => c.priority === "high").length,
    medium: normalized.filter((c) => c.priority === "medium").length,
    low: normalized.filter((c) => c.priority === "low").length,
  };

  // 🔥 MOST FREQUENT CATEGORY (FIXED)
  const categoryCount: any = {};
  normalized.forEach((c) => {
    categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
  });

  const topCategory =
    Object.keys(categoryCount).length > 0
      ? Object.keys(categoryCount).reduce((a, b) =>
          categoryCount[a] > categoryCount[b] ? a : b
        )
      : "...";

  return (
    <div className="flex bg-[#F4F8FF] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6">
        {/* 🔹 Header */}
        <h1 className="text-2xl font-semibold text-gray-900">
          AI Performance Insights
        </h1>

        {/* 🔹 Priority Cards */}
        <div className="grid grid-cols-3 gap-4">
          <PriorityCard title="High Priority" value={stats.high} color="red" />
          <PriorityCard
            title="Medium Priority"
            value={stats.medium}
            color="blue"
          />
          <PriorityCard title="Low Priority" value={stats.low} color="green" />
        </div>

        {/* 🔹 Middle Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* AI Accuracy */}
          <div className="col-span-2 bg-white p-5 rounded-xl shadow-sm border">
            <h3 className="font-medium mb-4">
              AI Accuracy by Category
            </h3>

            <div className="space-y-3">
              {["HVAC", "IT", "Maintenance"].map((cat) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat}</span>
                    <span>90%</span>
                  </div>

                  <div className="bg-gray-200 h-2 rounded">
                    <div className="bg-blue-500 h-2 rounded w-[90%]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights Card */}
          <div className="bg-blue-900 text-white p-5 rounded-xl shadow">
            <h3 className="font-medium mb-4">
              Classification Insights
            </h3>

            <p className="text-sm">
              Most frequent category:{" "}
              <strong>{topCategory}</strong>
            </p>

            <p className="text-sm mt-2">
              Accuracy improving across system.
            </p>

            <button className="mt-4 bg-white text-blue-900 px-3 py-2 rounded">
              View Report
            </button>
          </div>
        </div>

        {/* 🔹 Real-time Queue */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="font-medium mb-4">
            Real-time Priority Queue
          </h3>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            complaints.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <p className="font-medium">{c.description}</p>
                  <p className="text-xs text-gray-500">
                    {c.time} · {c.category}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge priority={c.priority} />
                  <span className="text-xs text-gray-500">
                    {c.confidence}% AI
                  </span>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs">
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

/* 🔹 Components */

function PriorityCard({ title, value, color }: any) {
  const colors: any = {
    red: "border-l-4 border-red-500",
    blue: "border-l-4 border-blue-500",
    green: "border-l-4 border-green-500",
  };

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm ${colors[color]}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-xl font-bold text-gray-900">{value}</h2>
    </div>
  );
}

function Badge({ priority }: any) {
  const p = String(priority).toLowerCase().trim();

  const styles: any = {
    high: "bg-red-100 text-red-600",
    medium: "bg-blue-100 text-blue-600",
    low: "bg-green-100 text-green-600",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${styles[p]}`}>
      {p.charAt(0).toUpperCase() + p.slice(1)}
    </span>
  );
}