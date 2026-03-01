import { Target, Check } from "lucide-react";

interface CoachingResponseProps {
  coaching: string;
  taskTitle: string;
}

export function CoachingResponse({ coaching, taskTitle }: CoachingResponseProps) {
  return (
    <div className="rounded-lg backdrop-blur-md bg-gradient-to-br from-emerald-600/20 via-slate-800/30 to-indigo-600/20 border border-emerald-500/30 p-8 space-y-4">
      <div className="flex items-center gap-2">
        <Target className="w-7 h-7 text-emerald-400 flex-shrink-0" strokeWidth={2} />
        <h3 className="text-xl font-bold text-white">Meridian Coaching</h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          {coaching}
        </p>
      </div>

      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-slate-500 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={2.5} />
          Session recorded. Keep building momentum!
        </p>
      </div>
    </div>
  );
}
