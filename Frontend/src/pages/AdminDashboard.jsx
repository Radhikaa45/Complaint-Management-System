import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import StatsCards from "../components/StatsCard";
import StatusChart from "../components/StatusChart";

import RecentComplaints from "../components/RecentComplaints";

function AdminDashboard(){

const [complaints,setComplaints] = useState([]);

useEffect(()=>{
fetchComplaints();
},[]);

const fetchComplaints = async ()=>{

const res = await axios.get(
"http://localhost:5000/api/complaints"
);

setComplaints(res.data);

};

return(

<div className="flex min-h-screen bg-gray-100">

<Sidebar/>

<div className="flex-1 p-8">

<h1 className="text-2xl font-semibold mb-2">
Complaint Management Dashboard
</h1>

<p className="text-gray-500 mb-6">
Overview of system performance and status across all departments.
</p>

<StatsCards complaints={complaints}/>

<div className="grid grid-cols-3 gap-6">

<StatusChart complaints={complaints}/>

<RecentComplaints complaints={complaints}/>

</div>

</div>

</div>

);

}

export default AdminDashboard;