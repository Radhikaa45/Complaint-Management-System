import { Link } from "react-router-dom";
import { ArrowRight, Search, Sparkles } from "lucide-react";

function Hero() {

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">

      <div>

        <p className="inline-flex items-center gap-2 text-blue-700 bg-blue-50 ring-1 ring-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <Sparkles size={14} /> AI-POWERED WORKPLACE SUPPORT
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Redefining Modern <span className="text-blue-600">Office</span> Operations
        </h1>

        <p className="text-gray-500 mt-6 text-lg max-w-xl">
          Report an issue in under a minute. We automatically categorise and prioritise it,
          route it to the right team, and keep you updated until it's fixed.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link to="/submit" className="btn-primary px-6 py-3 text-base">
            Submit Complaint <ArrowRight size={18} />
          </Link>
          <Link to="/track" className="btn-secondary px-6 py-3 text-base">
            <Search size={18} /> Track Progress
          </Link>
        </div>

      </div>

      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-200 to-indigo-100 rounded-3xl blur-2xl opacity-60" />
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
          alt="Modern office workspace"
          className="relative rounded-2xl shadow-xl w-full aspect-[4/3] object-cover"
        />
      </div>

    </section>
  );
}

export default Hero;
