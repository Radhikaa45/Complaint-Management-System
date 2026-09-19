import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { STATUSES, STATUS_COLORS } from "../utils/complaint";

function StatusChart({ complaints }) {

  const total = complaints.length;

  const data = STATUSES.map((s) => ({
    name: s,
    value: complaints.filter((c) => c.status === s).length
  }));

  const percentage = (value) => (total ? Math.round((value / total) * 100) : 0);

  return (
    <div className="card p-6 self-start">

      <h2 className="font-semibold text-gray-900 mb-4">Status Breakdown</h2>

      {/* Donut Chart */}
      <div className="relative w-full h-56">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={total ? data : [{ name: "None", value: 1 }]}
              dataKey="value"
              innerRadius={65}
              outerRadius={88}
              paddingAngle={total ? 3 : 0}
              stroke="none"
            >
              {(total ? data : [{ name: "None" }]).map((entry) => (
                <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#e5e7eb"} />
              ))}
            </Pie>
            {total > 0 && <Tooltip />}
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-gray-900">{total}</span>
          <span className="text-gray-400 text-xs tracking-wide">TOTAL</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2 text-sm">
        {data.map((d) => (
          <div key={d.name} className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[d.name] }} />
              {d.name}
            </div>
            <span className="text-gray-900 font-medium">
              {d.value} <span className="text-gray-400 font-normal">({percentage(d.value)}%)</span>
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default StatusChart;
