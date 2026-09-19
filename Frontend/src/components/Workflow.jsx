import { FilePlus2, BrainCircuit, Wrench, MessageSquareHeart } from "lucide-react";

const steps = [
  { icon: FilePlus2, title: "Instant Reporting", text: "Describe the issue and attach a photo or PDF. You get a tracking ID by email right away." },
  { icon: BrainCircuit, title: "Smart Triage", text: "AI tags every complaint with a category and priority so urgent issues reach the right team first." },
  { icon: Wrench, title: "Tracked Resolution", text: "Follow every status change and note from our team in a live timeline." },
  { icon: MessageSquareHeart, title: "Feedback Loop", text: "Rate the resolution once it's done, so we can keep improving." }
];

function Workflow() {

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

      <div className="max-w-2xl mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Simplified Workflow for <span className="text-blue-600">Peak Performance</span>
        </h2>
        <p className="text-gray-500 mt-4">
          From report to resolution in four transparent steps.
        </p>
      </div>

      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition">
            <span className="absolute top-5 right-5 text-5xl font-extrabold text-gray-100 select-none">{i + 1}</span>
            <div className="relative w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-sm">
              <Icon size={22} />
            </div>
            <h3 className="relative font-semibold text-gray-900">{title}</h3>
            <p className="relative text-gray-500 text-sm mt-2">{text}</p>
          </li>
        ))}
      </ol>

    </section>
  );
}

export default Workflow;
