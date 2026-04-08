import { Link } from "react-router-dom";

function CTA(){

return(

<section className="bg-blue-600 text-white text-center py-20">

<h2 className="text-4xl font-bold">
Ready to Upgrade Your Workplace?
</h2>

<p className="mt-4 text-blue-100">
Join hundreds of organizations using SmartOffice.
</p>

<Link
to="/submit"
className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg"
>

Start Free Trial

</Link>

</section>

);

}

export default CTA;