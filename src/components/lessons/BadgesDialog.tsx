"use client";

import { X } from "lucide-react";

import {
  getAllLessonBadges,
} from "@/lib/lessons/lesson-rewards";

type BadgesDialogProps = {
  isOpen: boolean;
  completedLessonIds: string[];
  onClose: () => void;
};

export function BadgesDialog({
  isOpen,
  completedLessonIds,
  onClose,
}: BadgesDialogProps) {
  if (!isOpen) {
    return null;
  }

  const badges = getAllLessonBadges(
    completedLessonIds,
  );

  const earnedCount = badges.filter(
    (badge) => badge.earned,
  ).length;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="badges-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <header className="flex items-center justify-between border-b border-slate-200 bg-[linear-gradient(135deg,#fef3c7,#ede9fe)] px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              Achievement collection
            </p>

            <h2
              id="badges-title"
              className="mt-1 text-2xl font-black text-slate-950"
            >
              Your Badges
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              {earnedCount} of {badges.length} unlocked
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close badges"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/70 hover:text-slate-950"
          >
            <X size={21} aria-hidden="true" />
          </button>
        </header>

        <div className="max-h-[70vh] overflow-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {badges.map((badge) => (
              <article
                key={badge.id}
                className={`rounded-2xl border p-4 transition ${
                  badge.earned
                    ? "border-amber-300 bg-[linear-gradient(135deg,#fffbeb,#f5f3ff)] shadow-md"
                    : "border-slate-200 bg-slate-100 opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${
                      badge.earned
                        ? "bg-amber-200 shadow-inner"
                        : "bg-slate-200 grayscale"
                    }`}
                  >
                    {badge.earned
                      ? badge.icon
                      : "🔒"}
                  </div>

                  <div>
                    <p className="font-black text-slate-950">
                      {badge.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {badge.description}
                    </p>

                    <p
                      className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                        badge.earned
                          ? "text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      {badge.earned
                        ? "Unlocked"
                        : "Locked"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
