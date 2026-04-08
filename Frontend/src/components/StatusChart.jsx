import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function StatusChart({ complaints }) {

const submitted = complaints.filter(
c => c.status === "Submitted"
).length;

const inReview = complaints.filter(
c => c.status === "In Process"
).length;

const resolved = complaints.filter(
c => c.status === "Resolved"
).length;

const total = complaints.length;

const data = [
{ name: "Submitted", value: submitted },
{ name: "In Review", value: inReview },
{ name: "Resolved", value: resolved }
];

const COLORS = ["#0850d4", "#facc15", "#10b981"];

const percentage = (value) =>
total ? Math.round((value / total) * 100) : 0;

return (

<div className="bg-white p-6 rounded-xl shadow border">

<h2 className="font-semibold mb-6">
Complaint Status Chart
</h2>

{/* Donut Chart */}

<div className="relative w-full h-60">

<ResponsiveContainer>

<PieChart>

<Pie
data={data}
dataKey="value"
innerRadius={70}
outerRadius={90}
paddingAngle={4}
>

{data.map((entry, index) => (
<Cell key={index} fill={COLORS[index]} />
))}

</Pie>

</PieChart>

</ResponsiveContainer>

{/* Center Total */}

<div className="absolute inset-0 flex flex-col items-center justify-center">

<h2 className="text-2xl font-bold">
{total}
</h2>

<p className="text-gray-400 text-sm">
TOTAL
</p>

</div>

</div>


{/* Legend */}

<div className="mt-6 space-y-2 text-sm">

<div className="flex justify-between items-center">

<div className="flex items-center gap-2">

<span className="w-3 h-3 rounded-full bg-blue-500"></span>

Submitted

</div>

<span>
{submitted} ({percentage(submitted)}%)
</span>

</div>


<div className="flex justify-between items-center">

<div className="flex items-center gap-2">

<span className="w-3 h-3 rounded-full bg-yellow-400"></span>

In Review

</div>

<span>
{inReview} ({percentage(inReview)}%)
</span>

</div>


<div className="flex justify-between items-center">

<div className="flex items-center gap-2">

<span className="w-3 h-3 rounded-full bg-green-500"></span>

Resolved

</div>

<span>
{resolved} ({percentage(resolved)}%)
</span>

</div>

</div>

</div>

);

}

export default StatusChart;