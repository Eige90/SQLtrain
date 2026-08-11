"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { getLessonXp } from "@/lib/lessons/lesson-rewards";
import type { SqlLesson } from "@/types/lesson";

type LessonsDialogProps = {
  isOpen: boolean;
  lessons: SqlLesson[];
  completedLessonIds: string[];
  onClose: () => void;
  onStartLesson: (lessonId: string) => void;
};

export function LessonsDialog({
  isOpen,
  lessons,
  completedLessonIds,
  onClose,
  onStartLesson,
}: LessonsDialogProps) {
  const [selectedLessonId, setSelectedLessonId] =
    useState(lessons[0]?.id ?? "");

  if (!isOpen) {
    return null;
  }

  const selectedLesson =
    lessons.find(
      (lesson) => lesson.id === selectedLessonId,
    ) ??
    lessons[0] ??
    null;

  const completedLessonCount =
    lessons.filter(
      (lesson) =>
        completedLessonIds.includes(
          lesson.id,
        ),
    ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="lessons-title"
        className="grid h-[92vh] max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-[320px_minmax(0,1fr)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <aside className="overflow-auto border-b border-slate-200 bg-slate-50 p-4 lg:border-b-0 lg:border-r">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
              Learning journey
            </p>

            <h2
              id="lessons-title"
              className="mt-1 text-2xl font-black text-slate-950"
            >
              SQL Lessons
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              {completedLessonCount} of {lessons.length}{" "}
              completed
            </p>
          </div>

          <div className="space-y-2">
            {lessons.map((lesson) => {
              const isSelected =
                lesson.id === selectedLesson?.id;

              const isCompleted =
                completedLessonIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() =>
                    setSelectedLessonId(lesson.id)
                  }
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    isSelected
                      ? "border-sky-300 bg-sky-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {isCompleted ? "✓" : lesson.number}
                    </span>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {lesson.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {lesson.topic} · {lesson.difficulty} ·{" "}
                        <span className="font-bold text-amber-600">
                          +{getLessonXp(lesson.difficulty)} XP
                        </span>
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex h-full min-h-0 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-sky-700">
                Lesson {selectedLesson?.number}
              </p>

              <h3 className="text-xl font-bold text-slate-950">
                {selectedLesson?.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close lessons"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          {selectedLesson && (
            <div className="min-h-0 flex-1 overflow-auto p-5 sm:p-6">
              <p className="leading-7 text-slate-600">
                {selectedLesson.description}
              </p>

              <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Your task
                </p>

                <p className="mt-2 font-medium leading-7 text-indigo-950">
                  {selectedLesson.task}
                </p>
              </div>

              <div className="mt-5">
                <h4 className="font-semibold text-slate-900">
                  Hints
                </h4>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {selectedLesson.hints.map((hint) => (
                    <li
                      key={hint}
                      className="flex gap-2"
                    >
                      <span className="text-sky-600">
                        •
                      </span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <footer className="shrink-0 border-t border-slate-200 bg-white p-4">
            <button
              type="button"
              disabled={!selectedLesson}
              onClick={() => {
                if (selectedLesson) {
                  onStartLesson(selectedLesson.id);
                }
              }}
              className="w-full rounded-xl bg-[linear-gradient(135deg,#0284c7,#4f46e5)] px-4 py-3 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Start Lesson
            </button>
          </footer>
        </div>
      </section>
    </div>
  );
}
