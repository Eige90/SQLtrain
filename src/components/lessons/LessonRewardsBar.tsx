import {
  getLessonRewardSummary,
} from "@/lib/lessons/lesson-rewards";

type LessonRewardsBarProps = {
  completedLessonIds: string[];
  streak: number;
  onOpenBadges: () => void;
};

export function LessonRewardsBar({
  completedLessonIds,
  streak,
  onOpenBadges,
}: LessonRewardsBarProps) {
  const summary = getLessonRewardSummary(
    completedLessonIds,
  );

  return (
    <section className="border-b border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <span
            className="text-3xl"
            aria-hidden="true"
          >
            ⭐
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Level {summary.level}
            </p>

            <p className="font-black text-slate-900">
              {summary.totalXp} XP
            </p>
          </div>
        </div>

        <div className="min-w-[180px] flex-1">
          <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
            <span>
              {summary.xpInsideLevel} XP
            </span>

            <span>
              {summary.xpRequiredForLevel} XP
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e,#38bdf8,#6366f1)] transition-all duration-700"
              style={{
                width:
                  `${summary.levelProgressPercent}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-bold text-orange-800">
          🔥 {streak} day streak
        </div>

        <button
          type="button"
          onClick={onOpenBadges}
          className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-bold text-violet-800 transition hover:border-violet-400 hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          🏅 {summary.badges.length} badges
        </button>
      </div>
    </section>
  );
}
