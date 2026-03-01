/**
 * Meridian logo — rising path with waypoints (Connect → Roadmap → Ship). Indigo → emerald.
 */
interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 32, withWordmark = false, className = "" }: LogoProps) {
  const r = 2.5;
  const lineWidth = 2;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="meridian-path" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(129, 140, 248)" />
            <stop offset="100%" stopColor="rgb(52, 211, 153)" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="10" fill="white" />
        {/* Rising path: gentle arc from left to right */}
        <path
          d="M8 20 Q16 8 24 14"
          stroke="url(#meridian-path)"
          strokeWidth={lineWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Waypoint 1 — Connect */}
        <circle cx="8" cy="20" r={r} fill="rgb(129, 140, 248)" />
        {/* Waypoint 2 — Roadmap (peak) */}
        <circle cx="16" cy="8" r={r} fill="url(#meridian-path)" />
        {/* Waypoint 3 — Ship */}
        <circle cx="24" cy="14" r={r} fill="rgb(52, 211, 153)" />
      </svg>
      {withWordmark && (
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
          Meridian
        </span>
      )}
    </div>
  );
}
