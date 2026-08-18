"use client";

import {
  getMysteryResolution,
} from "@/data/mystery/mystery-resolutions";

import {
  MysteryCaseClosedDialog,
} from "@/components/mystery/MysteryCaseClosedDialog";

import {
  MysteryEvidenceDialog,
} from "@/components/mystery/MysteryEvidenceDialog";

import {
  useEffect,
  useState,
} from "react";

import { SqlEditor } from "@/components/editor/SqlEditor";
import { QueryResults } from "@/components/results/QueryResults";

import {
  MYSTERY_DATABASE_TABLES,
} from "@/data/mystery/mystery-database";

import {
  MYSTERY_LEVELS,
  getMysteryLevelByNumber,
} from "@/data/mystery/mystery-levels";

import {
  MYSTERY_TASKS,
  getMysteryTask,
} from "@/data/mystery/mystery-tasks";
import {
  getMysterySuspects,
} from "@/data/mystery/mystery-suspects";

import {
  executeMysteryQuery,
  executeMysterySandbox,
} from "@/lib/mystery/mystery-engine";

import {
  readMysteryProgress,
  writeMysteryProgress,
} from "@/lib/mystery/mystery-progress";

import {
  validateMysteryTask,
} from "@/lib/mystery/validate-mystery-task";

import type {
  QueryResult,
} from "@/types/database";

import type {
  MysteryProgress,
  MysteryTaskValidationResult,
} from "@/types/mystery";

type MysteryCampaignDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const BUILT_LEVEL_NUMBERS = new Set(
  MYSTERY_TASKS.map(
    (task) => task.levelNumber,
  ),
);

function levelIsUnlocked(
  levelNumber: number,
  progress: MysteryProgress,
): boolean {
  if (!BUILT_LEVEL_NUMBERS.has(levelNumber)) {
    return false;
  }

  if (levelNumber === 1) {
    return true;
  }

  const previousLevel =
    getMysteryLevelByNumber(
      levelNumber - 1,
    );

  return Boolean(
    previousLevel &&
      progress.completedLevelIds.includes(
        previousLevel.id,
      ),
  );
}

function findResumeLevel(
  progress: MysteryProgress,
): number {
  const saved = MYSTERY_LEVELS.find(
    (level) =>
      level.id ===
      progress.activeLevelId,
  );

  if (
    saved &&
    BUILT_LEVEL_NUMBERS.has(
      saved.number,
    ) &&
    levelIsUnlocked(
      saved.number,
      progress,
    )
  ) {
    return saved.number;
  }

  for (
    let levelNumber = 1;
    levelNumber <= 5;
    levelNumber += 1
  ) {
    const level =
      getMysteryLevelByNumber(
        levelNumber,
      );

    if (
      level &&
      levelIsUnlocked(
        levelNumber,
        progress,
      ) &&
      !progress.completedLevelIds.includes(
        level.id,
      )
    ) {
      return levelNumber;
    }
  }

  return 1;
}

export function MysteryCampaignDialog({
  isOpen,
  onClose,
}: MysteryCampaignDialogProps) {
  const [
    progress,
    setProgress,
  ] = useState<MysteryProgress>(
    () => readMysteryProgress(),
  );

  const [
    activeLevelNumber,
    setActiveLevelNumber,
  ] = useState(1);

  const [
    activeTaskId,
    setActiveTaskId,
  ] = useState("mystery-task-001");

  const [sql, setSql] =
    useState("");

  const [result, setResult] =
    useState<QueryResult | null>(
      null,
    );

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const [
    feedback,
    setFeedback,
  ] =
    useState<MysteryTaskValidationResult | null>(
      null,
    );

  const [
    isRunning,
    setIsRunning,
  ] = useState(false);

  const [
    isChecking,
    setIsChecking,
  ] = useState(false);

  const [
    showHints,
    setShowHints,
  ] = useState(false);

  const [
    expandedTable,
    setExpandedTable,
  ] = useState<string | null>(
    "purchase_history",
  );


  const [
    completedLevelDialog,
    setCompletedLevelDialog,
  ] = useState<number | null>(
    null,
  );


  const [
    isCaseClosedOpen,
    setIsCaseClosedOpen,
  ] = useState(false);


  const activeLevel =
    getMysteryLevelByNumber(
      activeLevelNumber,
    )!;

  const levelTasks =
    MYSTERY_TASKS.filter(
      (task) =>
        task.levelNumber ===
        activeLevelNumber,
    );

  const activeTask =
    getMysteryTask(
      activeTaskId,
    ) ??
    levelTasks[0] ??
    null;

  const availableTables =
    MYSTERY_DATABASE_TABLES.filter(
      (table) =>
        table.unlockLevel <=
        activeLevelNumber,
    );

  const suspectBoard =
    getMysterySuspects(
      activeLevelNumber,
    );


  const activeResolution =
    completedLevelDialog === null
      ? null
      : getMysteryResolution(
          completedLevelDialog,
        );


  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeoutId =
      window.setTimeout(() => {
        const saved =
          readMysteryProgress();

        const resumeLevel =
          findResumeLevel(saved);

        const level =
          getMysteryLevelByNumber(
            resumeLevel,
          );

        if (!level) {
          return;
        }

        const tasks =
          MYSTERY_TASKS.filter(
            (task) =>
              task.levelNumber ===
              resumeLevel,
          );

        const savedTask =
          saved.activeTaskId &&
          tasks.some(
            (task) =>
              task.id ===
              saved.activeTaskId,
          )
            ? saved.activeTaskId
            : null;

        const firstIncomplete =
          tasks.find(
            (task) =>
              !saved.completedTaskIds.includes(
                task.id,
              ),
          );

        const taskId =
          savedTask ??
          firstIncomplete?.id ??
          tasks[
            tasks.length - 1
          ]?.id;

        if (!taskId) {
          return;
        }

        setProgress(saved);
        setActiveLevelNumber(
          resumeLevel,
        );
        setActiveTaskId(taskId);
        setSql("");
        setResult(null);
        setError(null);
        setFeedback(null);
        setShowHints(false);
      }, 0);

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [isOpen]);

  if (
    !isOpen ||
    !activeTask
  ) {
    return null;
  }

  const activeTaskIndex =
    levelTasks.findIndex(
      (task) =>
        task.id ===
        activeTask.id,
    );

  const levelComplete =
    activeLevel.taskIds.every(
      (taskId) =>
        progress.completedTaskIds.includes(
          taskId,
        ),
    );

  const completedBuiltLevels =
    MYSTERY_LEVELS.filter(
      (level) =>
        progress.completedLevelIds.includes(
          level.id,
        ),
    ).length;

  function canOpenTask(
    index: number,
  ): boolean {
    if (index === 0) {
      return true;
    }

    return progress.completedTaskIds.includes(
      levelTasks[index - 1].id,
    );
  }

  function clearWorkspace(): void {
    setSql("");
    setResult(null);
    setError(null);
    setFeedback(null);
    setShowHints(false);
  }

  function openLevel(
    levelNumber: number,
  ): void {
    if (
      !levelIsUnlocked(
        levelNumber,
        progress,
      )
    ) {
      return;
    }

    const level =
      getMysteryLevelByNumber(
        levelNumber,
      );

    if (!level) {
      return;
    }

    const tasks =
      MYSTERY_TASKS.filter(
        (task) =>
          task.levelNumber ===
          levelNumber,
      );

    const firstIncomplete =
      tasks.find(
        (task) =>
          !progress.completedTaskIds.includes(
            task.id,
          ),
      );

    const taskId =
      firstIncomplete?.id ??
      tasks[0]?.id;

    if (!taskId) {
      return;
    }

    const nextProgress: MysteryProgress = {
      ...progress,
      activeLevelId: level.id,
      activeTaskId: taskId,
    };

    setProgress(nextProgress);
    writeMysteryProgress(
      nextProgress,
    );

    setActiveLevelNumber(
      levelNumber,
    );
    setActiveTaskId(taskId);
    clearWorkspace();
  }

  function openTask(
    taskId: string,
  ): void {
    const task =
      getMysteryTask(taskId);

    if (!task) {
      return;
    }

    const index =
      levelTasks.findIndex(
        (item) =>
          item.id === taskId,
      );

    if (
      index < 0 ||
      !canOpenTask(index)
    ) {
      return;
    }

    const nextProgress: MysteryProgress = {
      ...progress,
      activeLevelId:
        activeLevel.id,
      activeTaskId: task.id,
    };

    setProgress(nextProgress);
    writeMysteryProgress(
      nextProgress,
    );

    setActiveTaskId(task.id);
    clearWorkspace();
  }


  async function executeCurrentTaskSql(
    sqlToExecute: string,
  ): Promise<QueryResult> {
    if (
      activeTask.executionMode ===
      "sandbox"
    ) {
      if (
        !activeTask.verificationSql
      ) {
        throw new Error(
          "This mystery sandbox task is not configured correctly.",
        );
      }

      return executeMysterySandbox({
        setupSql:
          activeTask.setupSql,
        sql:
          sqlToExecute,
        verificationSql:
          activeTask.verificationSql,
      });
    }

    return executeMysteryQuery(
      sqlToExecute,
    );
  }


  async function previewTable(
    tableName: string,
  ): Promise<void> {
    setIsRunning(true);
    setError(null);
    setFeedback(null);

    try {
      setResult(
        await executeMysteryQuery(
          `SELECT * FROM ${tableName} LIMIT 3`,
        ),
      );
    } catch (previewError) {
      setResult(null);

      setError(
        previewError instanceof Error
          ? previewError.message
          : "Could not preview table.",
      );
    } finally {
      setIsRunning(false);
    }
  }

  async function runSql(): Promise<void> {
    if (
      !sql.trim() ||
      isRunning
    ) {
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      setResult(
        await executeCurrentTaskSql(
          sql,
        ),
      );
    } catch (runError) {
      setResult(null);

      setError(
        runError instanceof Error
          ? runError.message
          : "The query failed.",
      );
    } finally {
      setIsRunning(false);
    }
  }

  async function checkAnswer(): Promise<void> {
    if (isChecking) {
      return;
    }

    setIsChecking(true);
    setFeedback(null);
    setError(null);

    try {
      const validation =
        await validateMysteryTask(
          activeTask,
          sql,
        );

      setFeedback(
        validation,
      );

      if (
        !validation.correct
      ) {
        return;
      }

      setResult(
        await executeCurrentTaskSql(
          sql,
        ),
      );

      const completedTaskIds = [
        ...new Set([
          ...progress.completedTaskIds,
          activeTask.id,
        ]),
      ];

      const completedLevel =
        activeLevel.taskIds.every(
          (taskId) =>
            completedTaskIds.includes(
              taskId,
            ),
        );

      const wasLevelAlreadyComplete =
        progress.completedLevelIds.includes(
          activeLevel.id,
        );

      const completedLevelIds =
        completedLevel
          ? [
              ...new Set([
                ...progress.completedLevelIds,
                activeLevel.id,
              ]),
            ]
          : progress.completedLevelIds;

      const nextProgress: MysteryProgress = {
        completedTaskIds,
        completedLevelIds,
        activeLevelId:
          activeLevel.id,
        activeTaskId:
          activeTask.id,
      };

      setProgress(
        nextProgress,
      );

      writeMysteryProgress(
        nextProgress,
      );

      if (
        completedLevel &&
        !wasLevelAlreadyComplete
      ) {
        setCompletedLevelDialog(
          activeLevel.number,
        );
      }
    } catch (checkError) {
      setError(
        checkError instanceof Error
          ? checkError.message
          : "Could not check the evidence.",
      );
    } finally {
      setIsChecking(false);
    }
  }

  function nextTask(): void {
    const next =
      levelTasks[
        activeTaskIndex + 1
      ];

    if (next) {
      openTask(next.id);
    }
  }

  function nextLevel(): void {
    openLevel(
      activeLevelNumber + 1,
    );
  }

  function continueAfterEvidence(): void {
    const completedNumber =
      completedLevelDialog;

    setCompletedLevelDialog(
      null,
    );

    if (
      completedNumber === 20
    ) {
      setIsCaseClosedOpen(
        true,
      );
      return;
    }

    if (
      completedNumber !== null &&
      BUILT_LEVEL_NUMBERS.has(
        completedNumber + 1,
      )
    ) {
      openLevel(
        completedNumber + 1,
      );
    }
  }

  function showSolution(): void {
    setSql(
      activeTask.solutionSql,
    );

    setFeedback({
      correct: false,
      message:
        "Solution loaded. Run it and study why it works.",
    });
  }

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden bg-[#040817]">
      <section
        role="dialog"
        aria-modal="true"
        aria-label="SQL Murder Mystery"
        className="flex h-[100dvh] w-full flex-col overflow-hidden"
      >
        <header className="shrink-0 border-b border-red-400/20 bg-[linear-gradient(120deg,#210b0b,#111827_48%,#172554)] px-4 py-3 text-white">
          <div className="flex items-start justify-between gap-2 sm:items-center sm:gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-300">
                Case File #714
              </p>

              <h2 className="truncate text-base font-black sm:text-xl">
                The Night Train to Bern
              </h2>

              <p className="truncate text-[10px] text-slate-300 sm:text-xs">
                Nora Keller · Alpenstern
                714 · Munich → Bern ·
                22:18–22:31
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-[10px] font-bold text-slate-200 hover:bg-white/10 sm:px-3 sm:py-2 sm:text-xs"
            >
              Exit Investigation
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#07111f] lg:grid lg:grid-cols-[270px_minmax(0,1fr)_245px] lg:overflow-hidden">
          <aside className="border-b border-white/10 bg-[#07111f] p-3 text-white lg:min-h-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
            <section className="rounded-xl border border-red-400/20 bg-red-400/5 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                Current Chapter
              </p>

              <p className="mt-1 text-sm font-black">
                Level{" "}
                {activeLevel.number} ·{" "}
                {activeLevel.title}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-300">
                {activeLevel.intro}
              </p>

              <p className="mt-2 text-xs font-semibold leading-5 text-amber-300">
                {activeLevel.objective}
              </p>
            </section>

            <section className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
                  Case Chapters
                </p>

                <span className="text-[10px] text-slate-500">
                  {
                    completedBuiltLevels
                  }
                  /20 solved
                </span>
              </div>

              <div className="mt-2 grid grid-cols-10 gap-1 lg:grid-cols-5">
                {MYSTERY_LEVELS.map(
                  (level) => {
                    const completed =
                      progress.completedLevelIds.includes(
                        level.id,
                      );

                    const unlocked =
                      levelIsUnlocked(
                        level.number,
                        progress,
                      );

                    const active =
                      level.number ===
                      activeLevelNumber;

                    return (
                      <button
                        key={level.id}
                        type="button"
                        title={`${level.number}. ${level.title}`}
                        disabled={
                          !unlocked
                        }
                        onClick={() =>
                          openLevel(
                            level.number,
                          )
                        }
                        className={`rounded-md border py-1.5 text-[10px] font-black ${
                          active
                            ? "border-sky-400 bg-sky-400/20 text-sky-200"
                            : completed
                              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                              : "border-white/10 bg-white/[0.03] text-slate-400"
                        } disabled:cursor-not-allowed disabled:opacity-35`}
                      >
                        {completed
                          ? "✓"
                          : level.number}
                      </button>
                    );
                  },
                )}
              </div>
            </section>

            <section className="mt-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
                Case Database
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                Evidence tables currently
                unlocked
              </p>

              <div className="mt-2 grid auto-cols-[minmax(210px,1fr)] grid-flow-col gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1.5 lg:overflow-visible lg:pb-0">
                {availableTables.map(
                  (table) => {
                    const expanded =
                      expandedTable ===
                      table.name;

                    return (
                      <div
                        key={table.name}
                        className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedTable(
                              expanded
                                ? null
                                : table.name,
                            )
                          }
                          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
                        >
                          <code className="text-[11px] font-bold text-sky-200">
                            {table.name}
                          </code>

                          <span className="text-[10px] text-slate-500">
                            {expanded
                              ? "▲"
                              : "▼"}
                          </span>
                        </button>

                        {expanded && (
                          <div className="border-t border-white/10 p-2.5">
                            <p className="text-[10px] leading-4 text-slate-400">
                              {
                                table.description
                              }
                            </p>

                            <div className="mt-2 flex flex-wrap gap-1">
                              {table.columns.map(
                                (column) => (
                                  <code
                                    key={
                                      column
                                    }
                                    className="rounded bg-slate-800 px-1 py-0.5 text-[9px] text-slate-300"
                                  >
                                    {
                                      column
                                    }
                                  </code>
                                ),
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                void previewTable(
                                  table.name,
                                )
                              }
                              className="mt-2 w-full rounded-md border border-sky-400/30 bg-sky-400/10 px-2 py-1.5 text-[10px] font-bold text-sky-200 hover:bg-sky-400/20"
                            >
                              Preview first 3
                              rows
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </section>

            <section className="mt-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
                Level Progress
              </p>

              <div className="mt-2 grid auto-cols-[minmax(180px,1fr)] grid-flow-col gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1.5 lg:overflow-visible lg:pb-0">
                {levelTasks.map(
                  (task, index) => {
                    const completed =
                      progress.completedTaskIds.includes(
                        task.id,
                      );

                    const active =
                      task.id ===
                      activeTask.id;

                    const unlocked =
                      canOpenTask(index);

                    return (
                      <button
                        key={task.id}
                        type="button"
                        disabled={
                          !unlocked
                        }
                        onClick={() =>
                          openTask(
                            task.id,
                          )
                        }
                        className={`w-full rounded-lg border px-2.5 py-2 text-left ${
                          active
                            ? "border-sky-400 bg-sky-400/15"
                            : completed
                              ? "border-emerald-400/30 bg-emerald-400/10"
                              : "border-white/10 bg-white/[0.03]"
                        } disabled:cursor-not-allowed disabled:opacity-40`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold">
                            {
                              task.position
                            }
                            /5{" "}
                            {
                              task.title
                            }
                          </span>

                          <span className="text-[10px]">
                            {completed
                              ? "✅"
                              : unlocked
                                ? "🔎"
                                : "🔒"}
                          </span>
                        </div>
                      </button>
                    );
                  },
                )}
              </div>
            </section>
          </aside>

          <main className="min-w-0 bg-slate-100 p-2.5 sm:p-3 lg:min-h-0 lg:overflow-y-auto lg:overflow-x-hidden">
            <section className="rounded-xl border border-red-200 bg-white p-3 shadow-sm sm:p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-600">
                    Mystery Level{" "}
                    {activeLevel.number}
                    {" · "}Task{" "}
                    {activeTask.position}/5
                  </p>

                  <h3 className="mt-1 text-lg font-black text-slate-950 sm:text-xl">
                    {activeTask.title}
                  </h3>
                </div>

                <span className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-bold text-sky-800">
                  {activeTask.skill}
                </span>
              </div>

              <div className="mt-3 grid gap-3 xl:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Story
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-700">
                    {activeTask.story}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-950 p-3 text-white">
                  <p className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                    Evidence Question
                  </p>

                  <p className="mt-1 text-sm font-semibold leading-5">
                    {
                      activeTask.evidenceQuestion
                    }
                  </p>

                  <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-sky-300">
                    SQL Task
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-200">
                    {activeTask.prompt}
                  </p>
                </div>
              </div>

              {feedback && (
                <div
                  className={`mt-3 rounded-lg border p-3 text-sm ${
                    feedback.correct
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                      : "border-amber-300 bg-amber-50 text-amber-900"
                  }`}
                >
                  <p className="font-bold">
                    {feedback.message}
                  </p>

                  {feedback.correct && (
                    <p className="mt-1 leading-5">
                      {
                        activeTask.successStory
                      }
                    </p>
                  )}
                </div>
              )}

              <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    setShowHints(
                      (value) =>
                        !value,
                    )
                  }
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700"
                >
                  💡 Hints
                </button>

                <button
                  type="button"
                  onClick={showSolution}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700"
                >
                  Show Solution
                </button>

                {feedback?.correct &&
                  activeTaskIndex <
                    levelTasks.length -
                      1 && (
                    <button
                      type="button"
                      onClick={nextTask}
                      className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-black text-white"
                    >
                      Next Clue →
                    </button>
                  )}
              </div>

              {showHints && (
                <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-3">
                  <ul className="list-disc space-y-1 pl-5 text-xs leading-5 text-sky-900">
                    {activeTask.hints.map(
                      (hint) => (
                        <li key={hint}>
                          {hint}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </section>

            <section className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    SQL Investigation Console
                  </h3>

                  <p className="text-[10px] text-slate-500">
                    🛡️ Isolated Mystery
                    Database · Your own
                    database remains untouched
                  </p>
                </div>

                <div className="mt-3 grid w-full grid-cols-1 gap-2 sm:mt-0 sm:w-auto sm:grid-cols-none sm:flex sm:gap-1.5">
                  <button
                    type="button"
                    onClick={
                      clearWorkspace
                    }
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void runSql()
                    }
                    disabled={isRunning}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-black text-white disabled:opacity-50"
                  >
                    {isRunning
                      ? "Running..."
                      : "▶ Run SQL"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void checkAnswer()
                    }
                    disabled={isChecking}
                    className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-black text-white disabled:opacity-50"
                  >
                    {isChecking
                      ? "Checking..."
                      : "✓ Check Answer"}
                  </button>
                </div>
              </div>

              <div className="h-[270px] sm:h-[240px] lg:h-[190px]">
                <SqlEditor
                  value={sql}
                  onChange={setSql}
                />
              </div>
            </section>

            <section className="mt-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <h3 className="mb-2 text-sm font-black text-slate-900">
                Evidence Result
              </h3>

              <div className="min-h-[110px]">
                <QueryResults
                  result={result}
                  error={error}
                />
              </div>
            </section>

            {levelComplete && (
              <section className="mt-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                  Evidence secured
                </p>

                <h3 className="mt-1 text-xl font-black text-emerald-950">
                  Level{" "}
                  {activeLevel.number} Solved
                </h3>

                <p className="mt-2 text-sm leading-6 text-emerald-900">
                  {
                    activeLevel.outcome
                  }
                </p>

                {BUILT_LEVEL_NUMBERS.has(
                  activeLevel.number +
                    1,
                ) && (
                  <button
                    type="button"
                    onClick={
                      nextLevel
                    }
                    className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-black text-white hover:bg-indigo-500"
                  >
                    Continue to Level{" "}
                    {
                      activeLevel.number +
                      1
                    }{" "}
                    →
                  </button>
                )}
              </section>
            )}
          </main>

          <aside className="border-t border-white/10 bg-[#091426] p-3 text-white lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0">
            <div className="lg:sticky lg:top-0">
              <div className="rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-300">
                  Suspect Board
                </p>

                <div className="mt-1 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-xl font-black">
                      {suspectBoard.length}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      people currently relevant
                    </p>
                  </div>

                  <span className="text-2xl">
                    🕵️
                  </span>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:block lg:space-y-2">
                {suspectBoard.map(
                  (suspect) => {
                    const statusClasses =
                      suspect.status ===
                      "Prime Suspect"
                        ? "border-red-400/40 bg-red-400/10 text-red-200"
                        : suspect.status ===
                            "Cleared"
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                          : suspect.status ===
                              "New Lead"
                            ? "border-violet-400/30 bg-violet-400/10 text-violet-200"
                            : suspect.status ===
                                "Suspect"
                              ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                              : "border-sky-400/20 bg-sky-400/[0.06] text-sky-200";

                    return (
                      <div
                        key={suspect.name}
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-black text-white">
                            {suspect.name}
                          </p>

                          <span
                            className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide ${statusClasses}`}
                          >
                            {suspect.status}
                          </span>
                        </div>

                        <p className="mt-1.5 text-[10px] leading-4 text-slate-400">
                          {suspect.reason}
                        </p>
                      </div>
                    );
                  },
                )}
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Investigation Funnel
                </p>

                <div className="mt-2 space-y-1 text-[10px] text-slate-400">
                  <p className="text-slate-300">
                    Initial persons of interest:
                    {" "}12
                  </p>

                  {activeLevelNumber >= 2 && (
                    <p className="text-amber-200">
                      KX-17 buyers: 5
                    </p>
                  )}

                  {activeLevelNumber >= 4 && (
                    <p className="text-amber-200">
                      Preparation-material buyers: 4
                    </p>
                  )}

                  {activeLevelNumber >= 5 && (
                    <p className="text-amber-200">
                      On Alpenstern 714: 3
                    </p>
                  )}

                  {activeLevelNumber >= 6 && (
                    <p className="text-red-200">
                      Blood evidence: 2
                    </p>
                  )}

                  {activeLevelNumber >= 8 && (
                    <p className="font-bold text-red-300">
                      Direct killer: Elias Vogel
                    </p>
                  )}

                  {activeLevelNumber >= 16 && (
                    <p className="font-bold text-violet-300">
                      Accomplice: Klara Meier
                    </p>
                  )}

                  {activeLevelNumber >= 19 && (
                    <p className="font-bold text-amber-300">
                      Mastermind lead: Adrian Voss
                    </p>
                  )}

                  {activeLevelNumber < 8 && (
                    <p className="italic text-slate-500">
                      Further evidence locked...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    

      <MysteryEvidenceDialog
        isOpen={
          completedLevelDialog !== null
        }
        resolution={
          activeResolution
        }
        hasNextLevel={
          completedLevelDialog !== null &&
          (
            completedLevelDialog === 20 ||
            BUILT_LEVEL_NUMBERS.has(
              completedLevelDialog + 1,
            )
          )
        }
        onClose={() =>
          setCompletedLevelDialog(
            null,
          )
        }
        onContinue={
          continueAfterEvidence
        }
      />

      <MysteryCaseClosedDialog
        isOpen={
          isCaseClosedOpen
        }
        onClose={() =>
          setIsCaseClosedOpen(
            false,
          )
        }
      />
</div>
  );
}
