export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Connect Your Repo",
      description:
        "Authenticate with GitHub. Meridian reads your repo structure, README, and open issues (never stores code).",
      icon: "🔗",
    },
    {
      number: "2",
      title: "Get a Roadmap",
      description:
        "Claude AI analyzes your project and breaks it into 12-18 concrete, 30-60 minute tasks with micro-steps.",
      icon: "🗺️",
    },
    {
      number: "3",
      title: "Ship Every Day",
      description:
        "Each day, Meridian picks your next best task. After each session, get AI coaching on your progress.",
      icon: "🚀",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 px-4 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest">
            The Process
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            How Meridian Works
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From zero to shipped in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-8 hover:bg-white/10 hover:border-white/20 transition space-y-4"
            >
              {/* Icon & Number */}
              <div className="space-y-3">
                <div className="text-5xl">{step.icon}</div>
                <div className="inline-block rounded-full bg-indigo-600/20 border border-indigo-500/30 px-4 py-2">
                  <span className="text-indigo-400 font-bold text-lg">
                    Step {step.number}
                  </span>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Visual Flow */}
        <div className="mt-12 hidden md:flex items-center justify-center gap-4 text-slate-600">
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600/50 to-transparent"></div>
          <span className="text-xl">→</span>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emerald-600/50 to-transparent"></div>
          <span className="text-xl">→</span>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent to-indigo-600/50"></div>
        </div>
      </div>
    </section>
  );
}
