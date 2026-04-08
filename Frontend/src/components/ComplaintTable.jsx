import { useState } from "react";
import ComplaintModal from "./ComplaintModal";

function ComplaintTable({ complaints, refresh }) {

const [selectedComplaint, setSelectedComplaint] = useState(null);

return (

<div className="bg-white p-6 rounded shadow">

<h2 className="text-xl font-semibold mb-4">
Recent Complaints
</h2>

<table className="w-full">

<thead>

<tr className="border-b text-left">
<th>ID</th>
<th>Name</th>
<th>Title</th>
<th>Status</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{complaints.map(c => (

<tr key={c._id} className="border-b">

<td>{c.complaintId}</td>
<td>{c.name}</td>
<td>{c.title}</td>
<td>{c.status}</td>

<td>

<button
className="bg-blue-500 text-white px-3 py-1 rounded"
onClick={() => setSelectedComplaint(c)}
>
View
</button>

</td>

</tr>

))}

</tbody>

</table>

{selectedComplaint && (
<ComplaintModal
complaint={selectedComplaint}
close={() => setSelectedComplaint(null)}
refresh={refresh}
/>
)}

</div>

);

}

export default ComplaintTable;