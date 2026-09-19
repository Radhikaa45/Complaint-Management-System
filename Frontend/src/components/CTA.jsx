import { Link } from "react-router-dom";

function CTA() {

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center rounded-3xl py-16 px-6 shadow-xl">

        <h2 className="text-3xl sm:text-4xl font-bold">
          Something not right in the office?
        </h2>

        <p className="mt-4 text-blue-100 max-w-xl mx-auto">
          Tell us about it. Most issues are picked up by our team the same day.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/submit" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition">
            Report an Issue
          </Link>
          <Link to="/track" className="border border-white/40 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition">
            Track Existing Complaint
          </Link>
        </div>

      </div>
    </section>
  );
}

export default CTA;
