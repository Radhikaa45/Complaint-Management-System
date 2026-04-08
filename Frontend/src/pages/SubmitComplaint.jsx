import { useState } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";

function SubmitComplaint() {

const [formData, setFormData] = useState({
  name: "",
  email: "",
  userType: "",
  title: "",
  description: ""
});

const [file, setFile] = useState(null);
const [submitted, setSubmitted] = useState(false);
const [complaintId, setComplaintId] = useState("");

const handleChange = (e) => {

const { name, value } = e.target;

setFormData({
  ...formData,
  [name]: value
});

};

const handleFileChange = (e) => {
setFile(e.target.files[0]);
};

const handleSubmit = async (e) => {

e.preventDefault();

/* EMAIL VALIDATION */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(formData.email)) {
  alert("Please enter a valid email address");
  return;
}

/* REQUIRED FIELD VALIDATION */

if(!formData.name || !formData.email || !formData.userType || !formData.title || !formData.description){
  alert("Please fill all required fields");
  return;
}

try {

const data = new FormData();

data.append("name", formData.name);
data.append("email", formData.email);
data.append("userType", formData.userType);
data.append("title", formData.title);
data.append("description", formData.description);

if (file) {
  data.append("file", file);
}

const res = await axios.post(
"http://localhost:5000/api/complaints/submit",
data
);

const id = res.data.complaintId;

/* Copy complaint ID */

navigator.clipboard.writeText(id);

alert(`Complaint submitted successfully!

Your Complaint ID: ${id}

It has been copied to your clipboard.`);

setComplaintId(id);
setSubmitted(true);

/* Reset form */

setFormData({
  name: "",
  email: "",
  userType: "",
  title: "",
  description: ""
});

setFile(null);

} catch (error) {

alert(
  error.response?.data?.message ||
  "Complaint submission failed"
);

}

};

return (

<div className="bg-gray-100 min-h-screen py-16">

<div className="max-w-4xl mx-auto px-6">

<h1 className="text-4xl font-bold text-gray-800">
Submit a Complaint
</h1>

<p className="text-gray-500 mt-2 mb-10">
Is something not right in the office? Let our maintenance team know so we can fix it promptly.
</p>

<form
onSubmit={handleSubmit}
className="bg-white rounded-xl shadow-lg p-10 space-y-8"
>

{/* Name + Email */}

<div className="grid grid-cols-2 gap-6">

<div>
<label className="text-sm font-medium text-gray-600">
Full Name
</label>

<input
type="text"
name="name"
value={formData.name}
onChange={handleChange}
placeholder="Enter your full name"
className="mt-2 w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
/>

</div>

<div>

<label className="text-sm font-medium text-gray-600">
Email Address
</label>

<input
type="email"
name="email"
value={formData.email}
onChange={handleChange}
placeholder="Enter your work email"
className="mt-2 w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
/>

</div>

</div>

{/* User Type */}

<div>

<label className="text-sm font-medium text-gray-600">
Select User Type
</label>

<select
name="userType"
value={formData.userType}
onChange={handleChange}
className="mt-2 w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
>

<option value="">Select user type</option>
<option value="Employee">Employee</option>
<option value="Visitor">Visitor</option>
<option value="Client">Client</option>

</select>

</div>

{/* Complaint Title */}

<div>

<label className="text-sm font-medium text-gray-600">
Complaint Title
</label>

<input
type="text"
name="title"
value={formData.title}
onChange={handleChange}
placeholder="Brief summary of the issue"
className="mt-2 w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
/>

</div>

{/* Description */}

<div>

<label className="text-sm font-medium text-gray-600">
Describe Issue
</label>

<textarea
name="description"
rows="5"
value={formData.description}
onChange={handleChange}
placeholder="Please provide as much detail as possible..."
className="mt-2 w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
/>

</div>

{/* Upload */}

<div>

<label className="text-sm font-medium text-gray-600">
Attachments (Image / PDF)
</label>

<label className="mt-3 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:bg-gray-50">

<UploadCloud className="text-gray-400" size={28} />

<p className="text-gray-500 text-sm mt-2">
Click to upload or drag and drop
</p>

<p className="text-xs text-gray-400">
PNG, JPG or PDF (max. 5MB)
</p>

<input
type="file"
accept=".png,.jpg,.jpeg,.pdf"
onChange={handleFileChange}
className="hidden"
/>

</label>

</div>

{/* Submit */}

<button
type="submit"
className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
>
Submit Complaint
</button>

</form>

{/* Success Message */}

{submitted && (

<div className="mt-6 bg-green-100 border border-green-300 text-green-700 p-4 rounded-lg">

Complaint submitted successfully!  
Tracking ID: <strong>{complaintId}</strong>

</div>

)}

</div>

</div>

);

}

export default SubmitComplaint;