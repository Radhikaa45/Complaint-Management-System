function RecentComplaints({ complaints }) {

const recent = complaints.slice(0,5);

return (

<div className="bg-white p-6 rounded-lg shadow col-span-2">

<h2 className="font-semibold mb-4">
Recent Complaints
</h2>

<table className="w-full">

<thead className="text-gray-500 text-sm">

<tr>

<th>ID</th>
<th>Subject</th>
<th>Status</th>
<th>Date</th>

</tr>

</thead>

<tbody>

{recent.map(c => (

<tr key={c._id} className="border-t">

<td className="py-3">{c.complaintId}</td>

<td>{c.title}</td>

<td>

<span
className={`px-2 py-1 text-xs rounded
${c.status==="Resolved" && "bg-green-100 text-green-700"}
${c.status==="Submitted" && "bg-blue-100 text-blue-600"}
${c.status==="In Process" && "bg-yellow-100 text-yellow-600"}
`}
>

{c.status}

</span>

</td>

<td>
{new Date(c.createdAt).toLocaleDateString()}
</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

export default RecentComplaints;