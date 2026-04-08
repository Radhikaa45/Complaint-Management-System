import axios from "axios";

function ComplaintModal({ complaint, close, refresh }) {

const updateStatus = async (status) => {

try {

await axios.put(
`http://localhost:5000/api/complaints/status/${complaint._id}`,
{ status }
);

refresh();
close();

} catch (error) {

console.error("Status update failed");

}

};

return (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white rounded-xl shadow-lg w-[650px] p-8">

{/* Header */}

<div className="flex justify-between items-center border-b pb-4 mb-6">

<div>

<h2 className="text-xl font-semibold text-gray-800">
Complaint Details
</h2>

<p className="text-sm text-gray-400">
SmartOffice Ticketing System
</p>

</div>

<button
onClick={close}
className="text-gray-400 hover:text-gray-600 text-xl"
>
×
</button>

</div>



{/* Info Grid */}

<div className="grid grid-cols-2 gap-x-8 gap-y-6 text-base">

<div>

<p className="text-gray-400 text-xs mb-1">
COMPLAINT ID
</p>

<p className="font-medium text-gray-800">
# {complaint.complaintId}
</p>

</div>


<div>

<p className="text-gray-400 text-xs mb-1">
CURRENT STATUS
</p>

<span
className={`px-3 py-1 text-sm rounded-full
${complaint.status === "Resolved" && "bg-green-100 text-green-700"}
${complaint.status === "Submitted" && "bg-orange-100 text-orange-600"}
${complaint.status === "In Process" && "bg-yellow-100 text-yellow-600"}
`}
>

{complaint.status}

</span>

</div>


<div>

<p className="text-gray-400 text-xs mb-1">
CUSTOMER NAME
</p>

<p className="text-gray-800">
{complaint.name}
</p>

</div>


<div>

<p className="text-gray-400 text-xs mb-1">
EMAIL ADDRESS
</p>

<p className="text-gray-800">
{complaint.email}
</p>

</div>

</div>



{/* Subject */}

<div className="mt-8">

<p className="text-gray-400 text-xs mb-2">
SUBJECT / TITLE
</p>

<p className="font-medium text-gray-800 text-base">
{complaint.title}
</p>

</div>
<div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 text-base">

<div>

<p className="text-gray-400 text-xs mb-2">
SUBMITTED ON
</p>

<p className="text-gray-800">
{complaint.createdAt
  ? new Date(complaint.createdAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  : "-"}
</p>

</div>

<div>

<p className="text-gray-400 text-xs mb-2">
RESOLVED ON
</p>

<p className="text-gray-800">
{complaint.resolvedAt
  ? new Date(complaint.resolvedAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  : "-"}
</p>

</div>

</div>



{/* Description */}

<div className="mt-6">

<p className="text-gray-400 text-xs mb-2">
DESCRIPTION
</p>

<div className="bg-gray-100 rounded-md p-4 text-base text-gray-700 leading-relaxed">

{complaint.description}

</div>

</div>




{/* Buttons */}

<div className="flex justify-between items-center mt-8">

<div className="flex gap-3">

<button
onClick={() => updateStatus("In Process")}
className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium"
>
In Process
</button>

<button
onClick={() => updateStatus("Resolved")}
className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
>
Mark Resolved
</button>

</div>

<button
onClick={close}
className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm"
>
Close
</button>


</div>

</div>

</div>

);

}

export default ComplaintModal;