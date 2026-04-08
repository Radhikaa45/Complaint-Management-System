function Stats(){

return(

<section className="max-w-7xl mx-auto px-6 py-20 relative">

<h2 className="text-center text-3xl font-bold text-gray-800 mb-14">
Operations At a Glance
</h2>

<div className="grid md:grid-cols-3 gap-8">

{/* Card 1 */}

<div className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition">

<p className="text-gray-500 text-sm">
Fast Resolution
</p>

<h3 className="text-4xl font-bold mt-2 text-blue-600">
24h
</h3>

<p className="text-sm text-gray-400 mt-1">
+15% efficiency
</p>

</div>


{/* Card 2 */}

<div className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition">

<p className="text-gray-500 text-sm">
Real-time Tracking
</p>

<h3 className="text-4xl font-bold mt-2 text-blue-600">
100%
</h3>

<p className="text-sm text-gray-400 mt-1">
+20% visibility
</p>

</div>


{/* Card 3 */}

<div className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition">

<p className="text-gray-500 text-sm">
Smart Analytics
</p>

<h3 className="text-4xl font-bold mt-2 text-blue-600">
95%
</h3>

<p className="text-sm text-gray-400 mt-1">
+12% accuracy
</p>

</div>

</div>

</section>

);

}

export default Stats;