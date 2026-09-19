import { useEffect, useState } from "react";
import { Inbox, CheckCircle2, Timer, Star } from "lucide-react";
import { getPublicStats } from "../api";
import { formatDuration } from "../utils/complaint";

function Stats() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    getPublicStats().then(setStats).catch(() => setStats(null));
  }, []);

  const cards = [
    { icon: Inbox, label: "Complaints Handled", value: stats ? stats.total : "—" },
    { icon: CheckCircle2, label: "Resolution Rate", value: stats ? `${stats.resolutionRate}%` : "—" },
    { icon: Timer, label: "Avg. Resolution Time", value: stats ? formatDuration(stats.avgResolutionHours) : "—" },
    { icon: Star, label: "User Satisfaction", value: stats?.avgRating ? `${stats.avgRating}/5` : "—" }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
        Operations At a Glance
      </h2>
      <p className="text-center text-gray-500 mb-12">Live numbers from our complaint desk.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl border border-white shadow-lg text-center hover:shadow-xl transition">
            <div className="w-11 h-11 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Icon size={22} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</h3>
            <p className="text-gray-500 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

    </section>
  );
}

export default Stats;
