import { PricingCard } from "@/components/marketing/PricingCard";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-indigo-400 transition">
            Meridian
          </Link>
          <Link href="/">
            <button className="text-slate-400 hover:text-white transition">
              ← Back to Home
            </button>
          </Link>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Start free. Upgrade when you're ready to unlock team features.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Free"
              price="$0"
              description="For indie hackers"
              features={[
                "1 connected repo",
                "AI roadmap generation",
                "Daily task selection",
                "Diff coaching",
                "Streak tracking",
                "Community support",
              ]}
              cta="Start Building"
              ctaUrl="/login"
            />

            <PricingCard
              name="Pro"
              price="$19"
              description="For serious builders"
              features={[
                "Everything in Free",
                "5 connected repos",
                "Priority support",
                "Advanced analytics",
                "Custom task templates",
                "Monthly coaching summaries",
              ]}
              cta="Coming Soon"
              ctaUrl="#"
              highlighted
            />

            <PricingCard
              name="Team"
              price="Custom"
              description="For teams & studios"
              features={[
                "Everything in Pro",
                "Unlimited repos",
                "Team collaboration",
                "Shared roadmaps",
                "Progress reporting",
                "Dedicated support",
              ]}
              cta="Contact Us"
              ctaUrl="mailto:sales@meridian.sh"
            />
          </div>

          {/* FAQs */}
          <div className="mt-20 max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Billing Questions
            </h2>

            <div className="space-y-4">
              <div className="rounded-lg bg-white/5 border border-white/10 p-6">
                <h3 className="font-semibold text-white mb-2">
                  Is the Free plan really free?
                </h3>
                <p className="text-slate-400">
                  Yes. Free plan has no time limit and no payment required. You can
                  use it indefinitely to ship your first project.
                </p>
              </div>

              <div className="rounded-lg bg-white/5 border border-white/10 p-6">
                <h3 className="font-semibold text-white mb-2">
                  What happens if I upgrade mid-month?
                </h3>
                <p className="text-slate-400">
                  We'll prorate your payment. You'll only pay for the days you use Pro.
                </p>
              </div>

              <div className="rounded-lg bg-white/5 border border-white/10 p-6">
                <h3 className="font-semibold text-white mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-slate-400">
                  Yes. No contracts, no lock-in. Cancel your subscription anytime from
                  your dashboard.
                </p>
              </div>

              <div className="rounded-lg bg-white/5 border border-white/10 p-6">
                <h3 className="font-semibold text-white mb-2">
                  Do you offer student discounts?
                </h3>
                <p className="text-slate-400">
                  Not yet, but Pro is only $19/month. Email us at support@meridian.sh
                  if cost is a blocker.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-slate-950 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to ship for free?
          </h2>
          <p className="text-slate-400">
            No credit card required. Just GitHub.
          </p>
          <Link href="/login">
            <button className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition">
              Start Free with GitHub →
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
