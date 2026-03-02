"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Does Meridian store my code?",
      answer:
        "No. We read your repo structure, README, and issue titles to generate a roadmap, but we never store your actual code. All analysis happens in real-time during roadmap generation.",
    },
    {
      question: "What if my project is still in planning?",
      answer:
        "Perfect. Upload a README or create issues describing what you want to build. Meridian will break it down into tasks. You can update the roadmap as your project evolves.",
    },
    {
      question: "Can I use this for team projects?",
      answer:
        "Yes! Free tier users can invite collaborators to their single repo. Pro and Premium users get full team collaboration across multiple repos with shared roadmaps, accountability tracking, and team dashboards.",
    },
    {
      question: "What if a task estimate is wrong?",
      answer:
        "You can regenerate the roadmap anytime. Or manually adjust task priorities and let Meridian's daily selection algorithm pick your next best task.",
    },
    {
      question: "How does daily task selection work?",
      answer:
        "Meridian scores incomplete tasks using priority (40%), recency (30%), and difficulty fit (20%). Then Claude Haiku generates a motivational reason why that task is a good next step.",
    },
    {
      question: "Will my GitHub token be secure?",
      answer:
        "We use GitHub OAuth v5 with minimal scopes (read-only access to repos and issues). Your token is stored securely and never shared.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest">
            Questions?
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Frequently Asked
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg border border-white/10 overflow-hidden hover:border-white/20 transition"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition"
              >
                <h3 className="font-semibold text-white">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-indigo-400 transition-transform flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  strokeWidth={2}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-white/5 border-t border-white/10 text-slate-400">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
