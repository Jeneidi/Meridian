export function Differentiators() {
  const differentiators = [
    {
      title: "Not a Code Writer",
      description:
        "We don't write code for you. We break down your project into actionable tasks and coach you through shipping.",
      icon: "📝",
      color: "from-indigo-600/20 to-indigo-600/10",
    },
    {
      title: "Repo-Native",
      description:
        "Meridian reads your actual repo structure, README, and issues to generate realistic, shipping-focused tasks.",
      icon: "📦",
      color: "from-emerald-600/20 to-emerald-600/10",
    },
    {
      title: "Diff-Aware Coaching",
      description:
        "Get honest feedback on your actual code changes. We focus on momentum and next steps, not code review.",
      icon: "🔄",
      color: "from-cyan-600/20 to-cyan-600/10",
    },
    {
      title: "Accountability Partner",
      description:
        "Daily task selection + streak tracking keeps you shipping consistently. Build momentum, not burnout.",
      icon: "🎯",
      color: "from-orange-600/20 to-orange-600/10",
    },
    {
      title: "No AI Tutoring",
      description:
        "Unlike tutoring systems, Meridian assumes you know how to code. We help you scope and ship, not learn.",
      icon: "🚀",
      color: "from-rose-600/20 to-rose-600/10",
    },
    {
      title: "Built for Builders",
      description:
        "Made for indie hackers, students, and anyone shipping a portfolio project from scratch.",
      icon: "⚡",
      color: "from-violet-600/20 to-violet-600/10",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900 via-slate-800/50 to-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-emerald-400 font-semibold text-sm uppercase tracking-widest">
            Why Meridian
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Built for Shipping
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Not a code generator, not a tutor, not a chatbot.
            <br />
            An accountability system for builders.
          </p>
        </div>

        {/* Differentiators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className={`rounded-lg backdrop-blur-md bg-gradient-to-br ${item.color} border border-white/10 p-6 hover:border-white/20 transition group`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-16 rounded-lg border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-6 py-4 font-semibold text-white">
                  Feature
                </th>
                <th className="text-center px-6 py-4 font-semibold text-white">
                  Meridian
                </th>
                <th className="text-center px-6 py-4 font-semibold text-slate-500">
                  Copilot
                </th>
                <th className="text-center px-6 py-4 font-semibold text-slate-500">
                  Generic Tutoring
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Repo Analysis", "✓", "✗", "✗"],
                ["AI Roadmapping", "✓", "✗", "✗"],
                ["Daily Task Selection", "✓", "✗", "✗"],
                ["Diff-Aware Coaching", "✓", "✗", "✗"],
                ["Streak Tracking", "✓", "✗", "✗"],
                ["Writes Code", "✗", "✓", "✓"],
                ["Learning-Focused", "✗", "✓", "✓"],
                ["Free for Projects", "✓", "✗", "✗"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="text-left px-6 py-4 font-medium text-white">
                    {row[0]}
                  </td>
                  <td className="text-center px-6 py-4 text-emerald-400 font-bold">
                    {row[1]}
                  </td>
                  <td className="text-center px-6 py-4 text-slate-500">
                    {row[2]}
                  </td>
                  <td className="text-center px-6 py-4 text-slate-500">
                    {row[3]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
