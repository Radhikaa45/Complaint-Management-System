import { Link } from "react-router-dom";

function Hero(){

return(
    

<section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 gap-10 items-center">
    

<div>

<p className="text-blue-600 text-sm font-semibold mb-3">
INTELLIGENT WORKPLACE 2.0
</p>

<h1 className="text-5xl font-bold text-gray-800 leading-tight">

Transforming Office <br/>

<span className="text-blue-600">
Management
</span>

with AI

</h1>

<p className="text-gray-500 mt-6">
Streamline your workplace with intelligent complaint
management and real-time insights.
</p>

<div className="mt-8 flex gap-4">

<Link
to="/submit"
className="bg-blue-600 text-white px-6 py-3 rounded-lg"
>
Submit Complaint
</Link>

<Link
to="/track"
className="border border-gray-300 px-6 py-3 rounded-lg"
>
Track Progress
</Link>

</div>

</div>


<div>

<img
src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6"
className="rounded-2xl shadow-lg"
/>

</div>

</section>

);

}

export default Hero;