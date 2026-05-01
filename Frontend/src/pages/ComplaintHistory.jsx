import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ComplaintModal from "../components/ComplaintModal";

function ComplaintHistory() {

const [complaints, setComplaints] = useState([]);
const [selectedComplaint, setSelectedComplaint] = useState(null);

useEffect(() => {
fetchComplaints();
}, []);

const fetchComplaints = async () => {

try {

const res = await axios.get(
`${import.meta.env.VITE_API_URL}/api/complaints`
);

setComplaints(res.data);

} catch (error) {

console.error("Error fetching complaints", error);

}

};

const formatDate = (date) => {

if(!date) return "-";

return new Date(date).toLocaleString("en-IN",{
day:"2-digit",
month:"short",
year:"numeric",
hour:"2-digit",
minute:"2-digit"
});

};

return (

<div className="flex min-h-screen bg-gray-100">

<Sidebar />

<div className="flex-1 p-8">

<h1 className="text-2xl font-semibold text-gray-800 mb-6">
Complaint History
</h1>

<div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">

<table className="w-full">

<thead className="bg-gray-50">

<tr className="text-left text-gray-600 text-sm">

<th className="px-6 py-3">ID</th>
<th className="px-6 py-3">Name</th>
<th className="px-6 py-3">Title</th>
<th className="px-6 py-3">Status</th>
<th className="px-6 py-3">Submitted</th>
<th className="px-6 py-3">Resolved</th>
<th className="px-6 py-3">Action</th>

</tr>

</thead>

<tbody>

{complaints.map((c) => (

<tr
key={c._id}
className="border-t hover:bg-gray-50 transition"
>

<td className="px-6 py-3 text-gray-700">
{c.complaintId}
</td>

<td className="px-6 py-3">
{c.name}
</td>

<td className="px-6 py-3">
{c.title}
</td>

<td className="px-6 py-3">

<span
className={`px-3 py-1 text-xs font-medium rounded-full
${c.status === "Resolved" && "bg-green-100 text-green-700"}
${c.status === "Submitted" && "bg-blue-100 text-blue-700"}
${c.status === "In Process" && "bg-yellow-100 text-yellow-700"}
`}
>

{c.status}

</span>

</td>

<td className="px-6 py-3 text-sm text-gray-600">
{formatDate(c.createdAt)}
</td>

<td className="px-6 py-3 text-sm text-gray-600">
{c.status === "Resolved" ? formatDate(c.resolvedAt) : "-"}
</td>

<td className="px-6 py-3">

<button
className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md transition"
onClick={() => setSelectedComplaint(c)}
>
View
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* View Modal */}

{selectedComplaint && (

<ComplaintModal
complaint={selectedComplaint}
close={() => setSelectedComplaint(null)}
refresh={fetchComplaints}
/>

)}

</div>

</div>

);

}

export default ComplaintHistory;