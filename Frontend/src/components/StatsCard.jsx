function StatsCard({ complaints }) {

const total = complaints.length;

const submitted = complaints.filter(
c => c.status === "Submitted"
).length;

const resolved = complaints.filter(
c => c.status === "Resolved"
).length;

return (

<div className="grid grid-cols-4 gap-6 mb-8">

{/* Total Complaints */}

<div className="bg-white p-6 rounded-xl shadow border">

<p className="text-gray-400 text-sm mb-1">
Total Complaints
</p>

<h2 className="text-3xl font-bold mb-3">
{total}
</h2>

<span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">
+12% from last month
</span>

</div>


{/* Open Issues */}

<div className="bg-white p-6 rounded-xl shadow border">

<p className="text-gray-400 text-sm mb-1">
Open Issues
</p>

<h2 className="text-3xl font-bold mb-3">
{submitted}
</h2>

<span className="text-orange-600 text-xs bg-orange-100 px-2 py-1 rounded">
⚠ Action required
</span>

</div>


{/* Resolved */}

<div className="bg-white p-6 rounded-xl shadow border">

<p className="text-gray-400 text-sm mb-1">
Resolved
</p>

<h2 className="text-3xl font-bold mb-3">
{resolved}
</h2>

<span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">
+5% growth
</span>

</div>


{/* Avg Resolution */}

<div className="bg-white p-6 rounded-xl shadow border">

<p className="text-gray-400 text-sm mb-1">
Avg. Resolution Time
</p>

<h2 className="text-3xl font-bold mb-3">
2.4 days
</h2>

<span className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded">
Target: 3 days
</span>

</div>

</div>

);

}

export default StatsCard;