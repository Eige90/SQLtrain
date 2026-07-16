"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import type {
  LessonBadge,
} from "@/lib/lessons/lesson-rewards";

type BadgeUnlockedToastProps = {
  badge: LessonBadge | null;
  onClose: () => void;
  onOpenBadges: () => void;
};

export function BadgeUnlockedToast({
  badge,
  onClose,
  onOpenBadges,
}: BadgeUnlockedToastProps) {
  useEffect(() => {
    if (!badge) {
      return;
    }

    const timeoutId = window.setTimeout(
      onClose,
      5500,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [badge, onClose]);

  if (!badge) {
    return null;
  }

  return (
    <div className="sqltrain-badge-unlock fixed right-4 top-4 z-[100] w-[min(390px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-amber-300 bg-white shadow-2xl">
      <div className="bg-[linear-gradient(135deg,#fbbf24,#a78bfa)] px-4 py-3 text-slate-950">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.2em]">
            Badge unlocked
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close badge notification"
            className="rounded-lg p-1 transition hover:bg-white/30"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-4xl shadow-inner">
          {badge.icon}
        </div>

        <div>
          <p className="text-xl font-black text-slate-950">
            {badge.title}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {badge.description}
          </p>

          <button
            type="button"
            onClick={onOpenBadges}
            className="mt-2 text-sm font-bold text-indigo-700 hover:text-indigo-900"
          >
            View all badges →
          </button>
        </div>
      </div>
    </div>
  );
}
