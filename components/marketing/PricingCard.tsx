import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  ctaUrl: string;
  highlighted?: boolean;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  ctaUrl,
  highlighted,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-lg backdrop-blur-md border p-8 space-y-6 transition ${
        highlighted
          ? "bg-gradient-to-br from-indigo-600/20 to-emerald-600/20 border-indigo-500/50 scale-105 md:scale-110"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
      }`}
    >
      {/* Plan Name */}
      <div>
        <h3 className="text-2xl font-bold text-white">{name}</h3>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>

      {/* Price */}
      <div>
        <p className="text-5xl font-bold text-white">{price}</p>
        {price !== "Custom" && (
          <p className="text-sm text-slate-400 mt-1">forever</p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex gap-3 text-slate-300 text-sm">
            <span className="text-emerald-400 font-bold flex-shrink-0">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link href={ctaUrl} className="block">
        <Button
          className={`w-full py-3 font-semibold rounded-lg transition ${
            highlighted
              ? "bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white"
              : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
          }`}
        >
          {cta}
        </Button>
      </Link>
    </div>
  );
}
