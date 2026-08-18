"use client";

import type {
  MysteryResolution,
} from "@/types/mystery";

type MysteryEvidenceDialogProps = {
  isOpen: boolean;
  resolution: MysteryResolution | null;
  hasNextLevel: boolean;
  onContinue: () => void;
  onClose: () => void;
};

export function MysteryEvidenceDialog({
  isOpen,
  resolution,
  hasNextLevel,
  onContinue,
  onClose,
}: MysteryEvidenceDialogProps) {
  if (
    !isOpen ||
    !resolution
  ) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-stretch justify-center bg-slate-950/85 p-0 backdrop-blur-sm sm:items-center sm:p-3"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="mystery-evidence-title"
        className="flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden border border-amber-300/25 bg-[radial-gradient(circle_at_top,#31230d_0%,#101827_35%,#050914_100%)] text-white shadow-[0_30px_120px_rgba(0,0,0,0.75)] sm:h-auto sm:max-h-[94dvh] sm:rounded-3xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <header className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-7 sm:py-5">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-300">
            Evidence Update · Level{" "}
            {resolution.levelNumber}
          </p>

          <h2
            id="mystery-evidence-title"
            className="mt-2 text-2xl font-black tracking-tight sm:text-4xl"
          >
            {resolution.title}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            {resolution.summary}
          </p>
        </header>

        <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto p-3 sm:p-7 lg:grid-cols-3">
          <section className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">
              Cleared
            </p>

            <div className="mt-3 space-y-2">
              {resolution.clearedSuspects.length ===
              0 ? (
                <p className="text-xs leading-5 text-slate-400">
                  No suspect is cleared
                  by this evidence alone.
                </p>
              ) : (
                resolution.clearedSuspects.map(
                  (name) => (
                    <div
                      key={name}
                      className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2"
                    >
                      <p className="text-sm font-black text-emerald-100">
                        {name}
                      </p>

                      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                        Cleared
                      </p>
                    </div>
                  ),
                )
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-red-400/25 bg-red-400/[0.07] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-300">
              Active Case
            </p>

            <div className="mt-3 space-y-2">
              {resolution.remainingSuspects.map(
                (name) => (
                  <div
                    key={name}
                    className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2"
                  >
                    <p className="text-sm font-black text-red-100">
                      {name}
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-sky-400/25 bg-sky-400/[0.07] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
              New Evidence
            </p>

            <div className="mt-3 space-y-2">
              {resolution.unlockedEvidence.map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-lg bg-sky-400/[0.08] px-3 py-2 text-xs leading-5 text-sky-100"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </section>
        </div>

        <footer className="grid shrink-0 grid-cols-1 gap-2 border-t border-white/10 px-3 py-3 sm:flex sm:flex-wrap sm:justify-end sm:px-7 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/10"
          >
            Review Evidence
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="rounded-xl bg-[linear-gradient(135deg,#f59e0b,#ef4444)] px-5 py-2.5 text-sm font-black text-white shadow-lg transition hover:brightness-110"
          >
            {hasNextLevel
              ? "Continue Investigation →"
              : "Return to Case →"}
          </button>
        </footer>
      </section>
    </div>
  );
}
