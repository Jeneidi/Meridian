interface CoachingResponseProps {
  coaching: string;
  taskTitle: string;
}

export function CoachingResponse({ coaching, taskTitle }: CoachingResponseProps) {
  return (
    <div className="rounded-lg backdrop-blur-md bg-gradient-to-br from-emerald-600/20 via-slate-800/30 to-indigo-600/20 border border-emerald-500/30 p-8 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎯</span>
        <h3 className="text-xl font-bold text-white">Meridian Coaching</h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          {coaching}
        </p>
      </div>

      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-slate-500">
          ✓ Session recorded. Keep building momentum!
        </p>
      </div>
    </div>
  );
}
