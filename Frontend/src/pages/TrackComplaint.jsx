import { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

function TrackComplaint() {

const [id, setId] = useState("");
const [complaint, setComplaint] = useState(null);
const [error, setError] = useState("");

const handleTrack = async () => {

try {

const res = await axios.get(
`http://localhost:5000/api/complaints/track/${id}`
);

setComplaint(res.data);
setError("");

} catch (err) {

setComplaint(null);
setError("Complaint not found");

}

};

return (

<div className="bg-gray-100 min-h-screen py-16">

<div className="max-w-4xl mx-auto px-6">

<h1 className="text-4xl font-bold text-gray-800 mb-3">
Track Complaint
</h1>

<p className="text-gray-500 mb-10">
Enter your complaint ID below to check the real-time resolution status.
</p>


{/* Search Box */}

<div className="bg-white p-6 rounded-xl shadow flex gap-4 items-center">

<div className="flex items-center gap-2 flex-1 border rounded-lg px-3 py-2">

<Search size={18} className="text-gray-400" />

<input
type="text"
placeholder="Complaint Reference ID"
value={id}
onChange={(e)=>setId(e.target.value)}
className="outline-none w-full"
/>

</div>

<button
onClick={handleTrack}
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
>

Track Status →

</button>

</div>


{/* Error */}

{error && (
<p className="text-red-500 mt-6">{error}</p>
)}


{/* Complaint Result */}

{complaint && (

<div className="mt-10 bg-white rounded-xl shadow overflow-hidden flex">

{/* Image Panel */}

<div className="w-1/3 bg-blue-100 flex items-center justify-center p-6">

{complaint.file ? (

<img
src={`http://localhost:5000/uploads/${complaint.file}`}
alt="Complaint Evidence"
className="rounded-lg w-full object-cover"
/>

) : (

<p className="text-gray-400 text-sm">
No image uploaded
</p>

)}

</div>


{/* Details */}

<div className="p-6 flex-1">

<div className="flex justify-between items-center mb-3">

<p className="text-blue-600 text-sm font-medium">
REF: {complaint.complaintId}
</p>

<span
className={`px-3 py-1 text-xs rounded-full
${complaint.status==="Resolved" && "bg-green-100 text-green-700"}
${complaint.status==="Submitted" && "bg-blue-100 text-blue-700"}
${complaint.status==="In Process" && "bg-yellow-100 text-yellow-700"}
`}
>

{complaint.status}

</span>

</div>


<h2 className="text-xl font-semibold mb-3">
{complaint.title}
</h2>


<p className="text-gray-600 mb-6">
{complaint.description}
</p>


{/* Additional Details */}

<div className="grid grid-cols-2 gap-6 text-sm text-gray-600">

<div>
<p className="text-gray-400 text-xs">
Customer Name
</p>
<p>{complaint.name}</p>
</div>


<div>
<p className="text-gray-400 text-xs">
Email Address
</p>
<p>{complaint.email}</p>
</div>


<div>
<p className="text-gray-400 text-xs">
Complaint ID
</p>
<p>{complaint.complaintId}</p>
</div>


<div>
<p className="text-gray-400 text-xs">
Status
</p>
<p>{complaint.status}</p>
</div>


<div>
<p className="text-gray-400 text-xs">
Submitted On
</p>

<p>
{complaint.createdAt
? new Date(complaint.createdAt).toLocaleString("en-IN",{
day:"2-digit",
month:"long",
year:"numeric",
hour:"2-digit",
minute:"2-digit"
})
: "N/A"}
</p>

</div>


{/* Show resolved time only if resolved */}

{complaint.status === "Resolved" && complaint.resolvedAt && (

<div>
<p className="text-gray-400 text-xs">
Resolved On
</p>

<p>
{new Date(complaint.resolvedAt).toLocaleString("en-IN",{
day:"2-digit",
month:"long",
year:"numeric",
hour:"2-digit",
minute:"2-digit"
})}
</p>

</div>

)}

</div>

</div>

</div>

)}


{/* Footer */}

<div className="text-center mt-12 text-gray-500 text-sm">

<p>Need further assistance?</p>

<p className="mt-2">

<span className="text-blue-600 font-medium cursor-pointer">
Contact Support
</span>

{" "}•{" "}

<span className="text-blue-600 font-medium cursor-pointer">
FAQs
</span>

</p>

</div>

</div>

</div>

);

}

export default TrackComplaint;