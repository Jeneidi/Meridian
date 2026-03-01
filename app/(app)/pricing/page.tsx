"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, cubicBezier } from "framer-motion";
import {
  Sparkles,
  Star,
  Crown,
  Check,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

const easeCustom = cubicBezier(0.25, 0.1, 0.25, 1);

const animationVariants = {
  fromLeft: {
    hidden: { opacity: 0, x: -40, y: 8 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.5, ease: easeCustom },
    },
  },
  fromBelow: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: easeCustom },
    },
  },
  fromRight: {
    hidden: { opacity: 0, x: 40, y: 8 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.5, ease: easeCustom },
    },
  },
};

function CheckoutButton({ plan }: { plan: "PRO" | "PREMIUM" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleCheckout = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        const errorMsg = data.error || "Failed to start checkout";
        console.error("Checkout API error:", errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg"
    >
      {loading ? (
        <>
          <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Upgrade to ${plan === "PRO" ? "Pro" : "Premium"}`
      )}
    </button>
  );
}

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#09090b]">
      <PageHeader title="Subscription" />

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Subheader */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Team-Friendly Pricing
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Start free as a solo developer. Scale with your team.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {/* FREE CARD */}
            <motion.div
              className="relative rounded-lg bg-zinc-900 border border-zinc-800 p-8 flex flex-col"
              variants={animationVariants.fromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}
            >
              <div className="absolute top-6 right-6">
                <span className="inline-block bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
                  Current Plan
                </span>
              </div>

              <div className="mb-6">
                <Sparkles className="w-6 h-6 text-indigo-400 mb-4" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-zinc-400 mb-2 text-sm">
                Perfect for solo developers testing Meridian
              </p>
              <p className="text-zinc-500 text-xs italic">(Solo developers, GitHub only)</p>
              <div className="mb-6"></div>

              <div className="mb-6">
                <div className="text-4xl font-bold text-white">$0</div>
                <div className="text-zinc-400 text-sm">forever, no credit card</div>
              </div>

              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-6 text-center">
                <p className="text-zinc-300 text-lg font-bold">
                  Ship faster for free
                </p>
              </div>

              <div className="border-t border-zinc-800 my-6 pt-6 text-center">
                <p className="text-zinc-500 text-xs">Current Plan</p>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">1 connected repo</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">
                    2 project analyses per month
                  </span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">
                    Daily task selection
                  </span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">
                    2 check-ins per week
                  </span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">
                    Surface security scan
                  </span>
                </div>
              </div>

              <button
                onClick={() => !session?.user && router.push("/login")}
                disabled={!!session?.user}
                className="w-full mt-8 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg"
              >
                {session?.user ? "Already Using" : "Start Free"}
              </button>
            </motion.div>

            {/* PRO CARD */}
            <motion.div
              className="relative rounded-lg bg-zinc-900 border-2 border-indigo-500 p-8 flex flex-col scale-105"
              variants={animationVariants.fromBelow}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute -top-4 left-0 right-0 flex justify-center gap-3">
                <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  38% OFF
                </span>
                <span className="inline-block bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>

              <div className="mb-6 mt-6">
                <Star className="w-6 h-6 text-indigo-400 mb-4" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-zinc-400 mb-6 text-sm">
                Perfect for small dev teams
              </p>

              <div className="mb-6">
                <div className="text-5xl font-bold text-white">$7.99</div>
                <div className="text-zinc-400 text-sm mt-1">/user/month</div>
                <div className="text-zinc-500 text-xs mt-3 leading-relaxed">
                  Ideal for teams of <span className="text-emerald-400 font-semibold">1–5 people</span>
                  <br />
                  <span className="text-zinc-600">(Add or remove users anytime)</span>
                </div>
              </div>

              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-6 text-center">
                <p className="text-zinc-300 text-sm font-semibold">
                  Most teams start here. Everything you need to ship together.
                </p>
              </div>

              <CheckoutButton plan="PRO" />

              <div className="space-y-3 flex-1 mt-8">
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Everything in Free</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">3-5 connected repos</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">5 project analyses/day</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">5 check-ins/day</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">1 deep AI security audit/day</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Shared team roadmap</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Team dashboard (accountability)</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Team streak tracking</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Priority support (email)</span>
                </div>
              </div>
            </motion.div>

            {/* PREMIUM CARD */}
            <motion.div
              className="relative rounded-lg bg-zinc-900 border border-zinc-800 p-8 flex flex-col"
              variants={animationVariants.fromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}
            >
              <div className="absolute top-6 left-6">
                <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  38% OFF
                </span>
              </div>

              <div className="mb-6 mt-6">
                <Crown className="w-6 h-6 text-indigo-400 mb-4" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <p className="text-zinc-400 mb-6 text-sm">
                For power users & growing teams
              </p>

              <div className="mb-6">
                <div className="text-5xl font-bold text-white">$17.99</div>
                <div className="text-zinc-400 text-sm mt-1">/user/month</div>
                <div className="text-zinc-500 text-xs mt-3 leading-relaxed">
                  Ideal for teams of <span className="text-pink-400 font-semibold">5+ people</span>
                  <br />
                  <span className="text-zinc-600">(Add or remove users anytime)</span>
                </div>
              </div>

              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-6 text-center">
                <p className="text-zinc-300 text-sm font-semibold">
                  Everything you need to scale. Enterprise-grade reliability.
                </p>
              </div>

              <CheckoutButton plan="PREMIUM" />

              <div className="space-y-3 flex-1 mt-8">
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Everything in Pro</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Unlimited connected repos</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">10 project analyses/day</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">10 check-ins/day</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">2 deep AI security audits/day</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Advanced analytics & reporting</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Custom workflow automation</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">AI-powered team summaries</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">First access to new features</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Dedicated Slack support</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">Webhook management (advanced)</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">SSO ready (coming soon)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQs */}
          <div className="mt-20 max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Billing Questions
            </h2>

            <motion.div
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              <motion.div
                className="rounded-lg bg-zinc-900 border border-zinc-800 p-6"
                variants={animationVariants.fromBelow}
              >
                <h3 className="font-semibold text-white mb-2">
                  How does per-user pricing work?
                </h3>
                <p className="text-zinc-400">
                  Pro is $7.99/user/month, Premium is $17.99/user/month. You pay for the number of team members you add. Add or remove users anytime—your bill adjusts at the start of your next billing period. No contracts, no minimums.
                </p>
              </motion.div>

              <motion.div
                className="rounded-lg bg-zinc-900 border border-zinc-800 p-6"
                variants={animationVariants.fromBelow}
              >
                <h3 className="font-semibold text-white mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-zinc-400">
                  Yes. Cancel your subscription anytime. You'll keep access for the
                  remainder of your paid month.
                </p>
              </motion.div>

              <motion.div
                className="rounded-lg bg-zinc-900 border border-zinc-800 p-6"
                variants={animationVariants.fromBelow}
              >
                <h3 className="font-semibold text-white mb-2">
                  What happens if I cancel mid-month?
                </h3>
                <p className="text-zinc-400">
                  Your subscription will end at the end of your current billing period.
                  You'll keep full Pro/Premium access until then, then revert to Free.
                </p>
              </motion.div>

              <motion.div
                className="rounded-lg bg-zinc-900 border border-zinc-800 p-6"
                variants={animationVariants.fromBelow}
              >
                <h3 className="font-semibold text-white mb-2">
                  Should I start with Pro or Premium?
                </h3>
                <p className="text-zinc-400">
                  Start with Pro if your team is 3-8 people and you just need shared roadmaps + daily AI coaching. Upgrade to Premium when you hit 5+ people or need advanced analytics, custom workflows, and priority support. Most teams start with Pro.
                </p>
              </motion.div>

              <motion.div
                className="rounded-lg bg-zinc-900 border border-zinc-800 p-6"
                variants={animationVariants.fromBelow}
              >
                <h3 className="font-semibold text-white mb-2">
                  Can we change team size mid-month?
                </h3>
                <p className="text-zinc-400">
                  Absolutely. Add or remove team members anytime. Your subscription quantity updates automatically and your next bill reflects the change. No long-term commitments required.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        className="py-16 px-4 border-t border-zinc-800"
        variants={animationVariants.fromBelow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to ship as a team?
          </h2>
          <p className="text-zinc-400">
            No credit card required. Just GitHub. Start free for solo developers, upgrade when you assemble a team.
          </p>
          <Link href="/login">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg">
              Start Free with GitHub →
            </button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
