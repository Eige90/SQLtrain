"use client";

type SqlProCelebrationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenBadges: () => void;
  onReturnHome: () => void;
};

export function SqlProCelebrationDialog({
  isOpen,
  onClose,
  onOpenBadges,
  onReturnHome,
}: SqlProCelebrationDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-slate-950/90 p-4"
      role="presentation"
    >
      <div className="sqltrain-confetti absolute inset-0 pointer-events-none">
        <span>⭐</span>
        <span>🎉</span>
        <span>✨</span>
        <span>🚆</span>
        <span>🏆</span>
        <span>⭐</span>
        <span>🎊</span>
        <span>✨</span>
      </div>

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="sql-pro-title"
        className="sqltrain-sql-pro-dialog relative w-full max-w-3xl overflow-hidden rounded-[2rem] border-4 border-amber-300 bg-[radial-gradient(circle_at_top,#4338ca_0%,#111827_45%,#020617_100%)] px-6 py-10 text-center text-white shadow-[0_0_100px_rgba(251,191,36,0.45)] sm:px-12 sm:py-14"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close SQL Pro celebration"
          className="absolute right-5 top-5 rounded-full bg-white/10 px-3 py-2 text-lg font-bold transition hover:bg-white/20"
        >
          ×
        </button>

        <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-300">
          100 / 100 lessons completed
        </p>

        <div className="sqltrain-pro-badge mx-auto mt-8 flex h-48 w-48 items-center justify-center rounded-full border-8 border-amber-300 bg-[linear-gradient(145deg,#fef3c7,#f59e0b,#7c3aed)] text-8xl shadow-[0_0_80px_rgba(251,191,36,0.75)] sm:h-56 sm:w-56 sm:text-9xl">
          👑
        </div>

        <h2
          id="sql-pro-title"
          className="mt-8 text-4xl font-black uppercase leading-tight tracking-tight sm:text-6xl"
        >
          Congrats!
        </h2>

        <p className="mt-3 bg-[linear-gradient(90deg,#fbbf24,#ffffff,#38bdf8)] bg-clip-text text-3xl font-black text-transparent sm:text-5xl">
          You are an SQL Pro!
        </p>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          You completed the entire SQLTrain journey:
          queries, joins, functions, transactions,
          keys, relationships, triggers, indexes,
          optimization, and complete database projects.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
            <p className="text-3xl">🚆</p>
            <p className="mt-2 font-black">
              100 Lessons
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
            <p className="text-3xl">��</p>
            <p className="mt-2 font-black">
              SQL Pro Badge
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
            <p className="text-3xl">🏆</p>
            <p className="mt-2 font-black">
              Journey Complete
            </p>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onOpenBadges}
            className="rounded-xl bg-amber-400 px-6 py-3 font-black text-amber-950 transition hover:scale-105 hover:bg-amber-300"
          >
            View My Badges
          </button>

          <button
            type="button"
            onClick={onReturnHome}
            className="rounded-xl border border-sky-300 bg-sky-400/10 px-6 py-3 font-black text-sky-200 transition hover:scale-105 hover:bg-sky-400/20"
          >
            Return to SQLTrain
          </button>
        </div>

        <p className="mt-8 text-sm font-semibold text-slate-400">
          Built by Eige90 · SQLTrain
        </p>
      </section>
    </div>
  );
}
