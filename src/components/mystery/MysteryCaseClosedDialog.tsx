"use client";

type MysteryCaseClosedDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MysteryCaseClosedDialog({
  isOpen,
  onClose,
}: MysteryCaseClosedDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center bg-[#02040b]/95 p-3 backdrop-blur-md">
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Case Closed"
        className="max-h-[95dvh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-amber-300/30 bg-[radial-gradient(circle_at_top,#451a03_0%,#111827_35%,#020617_100%)] p-6 text-white shadow-[0_30px_140px_rgba(0,0,0,0.85)] sm:p-9"
      >
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-amber-300/30 bg-amber-400/10 text-5xl shadow-[0_0_80px_rgba(245,158,11,0.25)]">
            🕵️
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.35em] text-amber-300">
            SQLTrain · Case #714
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">
            CASE CLOSED
          </h2>

          <p className="mt-3 text-lg font-bold text-sky-200">
            Master Detective
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
            You followed one evidence chain
            through 20 mystery levels and
            completed all 100 SQL investigation
            tasks.
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-red-400/25 bg-red-400/[0.07] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
              Murderer
            </p>
            <p className="mt-1 text-xl font-black">
              Elias Vogel
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Killed Nora Keller in the luggage
              compartment and transported her
              laptop and documents.
            </p>
          </article>

          <article className="rounded-2xl border border-violet-400/25 bg-violet-400/[0.07] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
              Accomplice
            </p>
            <p className="mt-1 text-xl font-black">
              Klara Meier
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Opened the luggage compartment,
              disabled its camera and hid the
              murder evidence in Locker 417.
            </p>
          </article>

          <article className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
              Mastermind
            </p>
            <p className="mt-1 text-xl font-black">
              Adrian Voss
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Controlled the financial chain
              that paid Elias and Klara through
              Northstar Consulting.
            </p>
          </article>

          <article className="rounded-2xl border border-sky-400/25 bg-sky-400/[0.07] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
              Victim & Motive
            </p>
            <p className="mt-1 text-xl font-black">
              Nora Keller
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Nora intended to publish evidence
              that Voss Group manipulated
              medical research results.
            </p>
          </article>
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4 text-center">
          <p className="text-3xl font-black text-emerald-300">
            100 / 100
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
            SQL Mystery Challenges Solved
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[linear-gradient(135deg,#f59e0b,#dc2626,#7c3aed)] px-5 py-3 text-sm font-black text-white shadow-xl transition hover:brightness-110"
        >
          Return to Case File
        </button>
      </section>
    </div>
  );
}
