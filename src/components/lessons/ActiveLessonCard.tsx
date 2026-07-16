import type {
  LessonValidationResult,
  SqlLesson,
} from "@/types/lesson";

type ActiveLessonCardProps = {
  lesson: SqlLesson;
  feedback: LessonValidationResult | null;
  isChecking: boolean;
  isCompleted: boolean;
  onCheck: () => void;
  onShowSolution: () => void;
  rewardXp: number | null;
  hasNextLesson: boolean;
  onNextLesson: () => void;
  onOpenLessons: () => void;
  onExit: () => void;
};

export function ActiveLessonCard({
  lesson,
  feedback,
  isChecking,
  isCompleted,
  onCheck,
  onShowSolution,
  rewardXp,
  hasNextLesson,
  onNextLesson,
  onOpenLessons,
  onExit,
}: ActiveLessonCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-sky-200 bg-white shadow-sm">
      <div className="bg-[linear-gradient(135deg,#e0f2fe,#eef2ff)] px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
              Lesson {lesson.number} · {lesson.topic}
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-950">
              {lesson.title}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              {lesson.task}
            </p>
          </div>

          {isCompleted && (
            <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">
              Completed
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={onCheck}
          disabled={isChecking}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {isChecking ? "Checking..." : "Check Answer"}
        </button>

        <button
          type="button"
          onClick={onShowSolution}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Show Solution
        </button>

        <button
          type="button"
          onClick={onOpenLessons}
          className="rounded-lg border border-sky-300 px-3 py-2 text-sm font-semibold text-sky-800 transition hover:bg-sky-50"
        >
          All Lessons
        </button>

        <button
          type="button"
          onClick={onExit}
          className="ml-auto rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Exit Lesson
        </button>
      </div>

      {feedback && (
        <div
          className={`border-t px-4 py-3 text-sm font-medium sm:px-5 ${
            feedback.correct
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{feedback.message}</span>

            {feedback.correct && rewardXp !== null && (
              <span className="sqltrain-reward-pop rounded-full bg-amber-400 px-3 py-1 font-black text-amber-950 shadow-lg">
                +{rewardXp} XP
              </span>
            )}

            {feedback.correct && hasNextLesson && (
              <button
                type="button"
                onClick={onNextLesson}
                className="rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white transition hover:bg-indigo-700"
              >
                Next Lesson →
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
