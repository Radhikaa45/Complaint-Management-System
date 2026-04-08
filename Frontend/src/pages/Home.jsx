import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Workflow from "../components/Workflow";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Home() {

return (

<div className="relative overflow-hidden bg-gray-50 min-h-screen">


{/* Background Gradient */}

<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"></div>


{/* Floating Blur Effects */}

<div className="absolute w-[400px] h-[400px] bg-blue-300 rounded-full blur-3xl opacity-20 top-20 left-10"></div>

<div className="absolute w-[400px] h-[400px] bg-indigo-300 rounded-full blur-3xl opacity-20 bottom-20 right-10"></div>


{/* Page Content */}

<div className="relative">

<Hero />

<Stats />

<Workflow />

<CTA />

<Footer />

</div>
</div>

);

}

export default Home;