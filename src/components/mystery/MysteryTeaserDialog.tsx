"use client";

type MysteryTeaserDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
};

export function MysteryTeaserDialog({
  isOpen,
  onClose,
  onStart,
}: MysteryTeaserDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="mystery-teaser-title"
        className="sqltrain-mystery-teaser relative w-full max-w-xl overflow-hidden rounded-3xl border border-red-400/40 bg-[radial-gradient(circle_at_top,#450a0a_0%,#172033_42%,#07111f_100%)] p-7 text-center text-white shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:p-10"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close mystery preview"
          className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 font-bold text-slate-300 transition hover:bg-white/20 hover:text-white"
        >
          ×
        </button>

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-red-300/30 bg-red-500/10 text-5xl shadow-[0_0_60px_rgba(239,68,68,0.3)]">
          🔎
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-red-300">
          New SQLTrain Challenge
        </p>

        <h2
          id="mystery-teaser-title"
          className="mt-2 text-3xl font-black sm:text-4xl"
        >
          TRY our new Quiz
        </h2>

        <p className="mt-4 text-xl font-bold text-sky-200">
          Go on the search for the murder with SQL.
        </p>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-slate-300">
          Follow the evidence through 20 connected
          mystery levels. Search orders, train records,
          witness statements, phone calls, bank transfers
          and hidden evidence to uncover the killer.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-2xl font-black text-white">
              20
            </p>
            <p className="text-xs text-slate-400">
              Mystery Levels
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-2xl font-black text-white">
              100
            </p>
            <p className="text-xs text-slate-400">
              SQL Challenges
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-2xl">
              🕵️
            </p>
            <p className="text-xs text-slate-400">
              One Murder
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-7 w-full rounded-xl bg-[linear-gradient(135deg,#dc2626,#7c3aed)] px-5 py-3 font-black text-white shadow-lg transition hover:scale-[1.02] hover:brightness-110"
        >
          Start Investigation →
        </button>

        <p className="mt-4 text-xs text-slate-500">
          Murder Mystery will appear as a separate
          SQLTrain learning mode.
        </p>
      </section>
    </div>
  );
}
