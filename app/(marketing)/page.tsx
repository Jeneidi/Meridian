import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Differentiators } from "@/components/marketing/Differentiators";
import { FAQ } from "@/components/marketing/FAQ";
import { ScrollParallaxSides } from "@/components/marketing/ScrollParallaxSides";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Left/right product-themed elements that move as you scroll */}
      <ScrollParallaxSides />
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 [&_span]:text-2xl">
            <Logo size={28} withWordmark />
          </Link>
          <div className="flex items-center gap-6">
            <a
              href="#how-it-works"
              className="text-slate-400 hover:text-white transition text-sm"
            >
              How It Works
            </a>
            <Link href="/pricing" className="text-slate-400 hover:text-white transition text-sm">
              Pricing
            </Link>
            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* How It Works */}
      <section className="relative z-0">
        <HowItWorks />
      </section>

      {/* Differentiators */}
      <section className="relative z-0">
        <Differentiators />
      </section>

      {/* FAQ */}
      <section className="relative z-0">
        <FAQ />
      </section>

      {/* Final CTA */}
      <section className="relative z-0 py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to ship?
          </h2>
          <p className="text-lg text-slate-300">
            Join builders who are shipping projects with accountability and momentum.
          </p>
          <Link href="/login" className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white text-lg px-8 py-6 rounded-lg font-semibold transition-colors inline-flex items-center justify-center">
            Start Free with GitHub →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo size={24} withWordmark className="mb-4" />
              <p className="text-sm text-slate-500">
                Ship your projects with accountability.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <Link href="/#how-it-works" className="hover:text-white transition">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Docs</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm text-slate-500">
            <p>© 2026 Meridian. Stop planning. Start shipping.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
