function Footer(){

return(

<footer className="bg-white border-t">

<div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-4 gap-6">

<div>

<h3 className="font-bold text-lg">
SmartOffice
</h3>

<p className="text-gray-500 text-sm mt-3">
Digital-first workplace management.
</p>

</div>


<div>

<h4 className="font-semibold mb-3">
Platform
</h4>

<ul className="space-y-2 text-gray-500 text-sm">
<li>Asset Management</li>
<li>Visitor Tracking</li>
<li>Feedback Portal</li>
</ul>

</div>


<div>

<h4 className="font-semibold mb-3">
Company
</h4>

<ul className="space-y-2 text-gray-500 text-sm">
<li>About</li>
<li>Careers</li>
<li>Contact</li>
</ul>

</div>


<div>

<h4 className="font-semibold mb-3">
Newsletter
</h4>

<input
placeholder="Email address"
className="border p-2 rounded w-full"
/>

</div>

</div>

</footer>

);

}

export default Footer;