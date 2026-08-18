import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";

import {
  SQL_LESSONS,
} from "../../src/data/lessons";

import {
  MYSTERY_LEVELS,
} from "../../src/data/mystery/mystery-levels";

import {
  MYSTERY_TASKS,
} from "../../src/data/mystery/mystery-tasks";

import type {
  MysteryProgress,
  MysteryTask,
} from "../../src/types/mystery";


const LESSON_PROGRESS_KEY =
  "sqltrain.lesson-progress.v1";

const MYSTERY_PROGRESS_KEY =
  "sqltrain.mystery-progress.v1";

const MYSTERY_TEASER_KEY =
  "sqltrain.mystery-teaser-seen.v1";


const lessonTen =
  SQL_LESSONS.find(
    (lesson) =>
      lesson.number === 10,
  );

if (!lessonTen) {
  throw new Error(
    "Normal SQL Lesson 10 was not found.",
  );
}


function getMysteryTaskByNumber(
  number: number,
): MysteryTask {
  const task =
    MYSTERY_TASKS.find(
      (item) =>
        item.number === number,
    );

  if (!task) {
    throw new Error(
      `Mystery task ${number} was not found.`,
    );
  }

  return task;
}


function progressBeforeTask(
  taskNumber: number,
): MysteryProgress {
  const target =
    getMysteryTaskByNumber(
      taskNumber,
    );

  const activeLevel =
    MYSTERY_LEVELS.find(
      (level) =>
        level.number ===
        target.levelNumber,
    );

  if (!activeLevel) {
    throw new Error(
      `Mystery level ${target.levelNumber} was not found.`,
    );
  }

  return {
    completedTaskIds:
      MYSTERY_TASKS
        .filter(
          (task) =>
            task.number <
            taskNumber,
        )
        .map(
          (task) =>
            task.id,
        ),

    completedLevelIds:
      MYSTERY_LEVELS
        .filter(
          (level) =>
            level.number <
            target.levelNumber,
        )
        .map(
          (level) =>
            level.id,
        ),

    activeLevelId:
      activeLevel.id,

    activeTaskId:
      target.id,
  };
}


async function seedMysteryEnvironment(
  page: Page,
  options: {
    unlock?: boolean;
    teaserSeen?: boolean;
    progress?: MysteryProgress | null;
  } = {},
): Promise<void> {
  const {
    unlock = true,
    teaserSeen = true,
    progress = null,
  } = options;

  await page.addInitScript(
    ({
      lessonProgressKey,
      mysteryProgressKey,
      mysteryTeaserKey,
      lessonTenId,
      shouldUnlock,
      shouldMarkTeaserSeen,
      mysteryProgress,
    }) => {
      /*
       * Apply the prepared E2E state only on the first document
       * load in this tab.
       *
       * sessionStorage survives a normal page.reload(), while
       * every Playwright test starts with a fresh page/context.
       * This means application-written localStorage progress can
       * now be tested across a real reload without our init script
       * overwriting it again.
       */
      const seedFlag =
        "__sqltrain_mystery_e2e_seed_applied";

      if (
        window.sessionStorage.getItem(
          seedFlag,
        ) === "true"
      ) {
        return;
      }

      window.sessionStorage.setItem(
        seedFlag,
        "true",
      );

      if (shouldUnlock) {
        window.localStorage.setItem(
          lessonProgressKey,
          JSON.stringify([
            lessonTenId,
          ]),
        );
      } else {
        window.localStorage.removeItem(
          lessonProgressKey,
        );
      }

      if (shouldMarkTeaserSeen) {
        window.localStorage.setItem(
          mysteryTeaserKey,
          "true",
        );
      } else {
        window.localStorage.removeItem(
          mysteryTeaserKey,
        );
      }

      if (mysteryProgress) {
        window.localStorage.setItem(
          mysteryProgressKey,
          JSON.stringify(
            mysteryProgress,
          ),
        );
      } else {
        window.localStorage.removeItem(
          mysteryProgressKey,
        );
      }
    },
    {
      lessonProgressKey:
        LESSON_PROGRESS_KEY,
      mysteryProgressKey:
        MYSTERY_PROGRESS_KEY,
      mysteryTeaserKey:
        MYSTERY_TEASER_KEY,
      lessonTenId:
        lessonTen.id,
      shouldUnlock:
        unlock,
      shouldMarkTeaserSeen:
        teaserSeen,
      mysteryProgress:
        progress,
    },
  );
}


async function expectNoBodyOverflow(
  page: Page,
): Promise<void> {
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const root =
            document.documentElement;

          return (
            root.scrollWidth <=
            root.clientWidth + 1
          );
        }),
      {
        timeout: 15_000,
      },
    )
    .toBe(true);
}


async function expectElementInsideViewport(
  locator: Locator,
): Promise<void> {
  await expect(locator).toBeVisible();

  const box =
    await locator.boundingBox();

  expect(box).not.toBeNull();

  if (!box) {
    return;
  }

  const viewport =
    locator.page().viewportSize();

  expect(viewport).not.toBeNull();

  if (!viewport) {
    return;
  }

  expect(
    box.x + box.width,
  ).toBeGreaterThan(0);

  expect(
    box.x,
  ).toBeLessThan(
    viewport.width,
  );

  expect(
    box.y + box.height,
  ).toBeGreaterThan(0);

  expect(
    box.y,
  ).toBeLessThan(
    viewport.height,
  );
}


async function openMystery(
  page: Page,
): Promise<Locator> {
  await page.goto("/");

  const mysteryButton =
    page.getByRole(
      "button",
      {
        name:
          "🔎 Murder Mystery",
      },
    );

  await expect(
    mysteryButton,
  ).toBeEnabled({
    timeout: 30_000,
  });

  await mysteryButton.click();

  const dialog =
    page.getByRole(
      "dialog",
      {
        name:
          "SQL Murder Mystery",
      },
    );

  await expect(
    dialog,
  ).toBeVisible({
    timeout: 30_000,
  });

  return dialog;
}


async function setMysterySql(
  page: Page,
  dialog: Locator,
  sql: string,
): Promise<void> {
  const editor =
    dialog.getByRole(
      "textbox",
      {
        name:
          "Editor content",
      },
    );

  await expect(
    editor,
  ).toBeVisible({
    timeout: 30_000,
  });

  /*
   * Monaco's accessible edit context can be covered by its
   * rendered .view-line elements. A normal pointer click may
   * therefore be intercepted even though the editor is usable.
   *
   * Focus the actual edit context directly and then use the
   * keyboard exactly as a user would.
   */
  await editor.focus();

  await expect(
    editor,
  ).toBeFocused();

  await page.keyboard.press(
    "Control+A",
  );

  await page.keyboard.insertText(
    sql,
  );
}


async function solveActiveTask(
  page: Page,
  dialog: Locator,
  task: MysteryTask,
): Promise<void> {
  await setMysterySql(
    page,
    dialog,
    task.solutionSql,
  );

  const checkButton =
    dialog.getByRole(
      "button",
      {
        name:
          "✓ Check Answer",
      },
    );

  await expect(
    checkButton,
  ).toBeEnabled();

  await checkButton.click();

  await expect(
    dialog.getByText(
      task.successStory,
      {
        exact: true,
      },
    ),
  ).toBeVisible({
    timeout: 30_000,
  });

  /*
   * Correct feedback is rendered before checkAnswer() has
   * necessarily finished executing the task SQL and persisting
   * Mystery progress.
   *
   * Wait for the application-written localStorage state as well.
   * This prevents a race where the success story is already
   * visible but completedTaskIds / completedLevelIds have not
   * been written yet.
   */
  await expect
    .poll(
      async () =>
        page.evaluate(
          ({
            storageKey,
            taskId,
          }) => {
            const raw =
              window.localStorage.getItem(
                storageKey,
              );

            if (!raw) {
              return false;
            }

            try {
              const progress =
                JSON.parse(
                  raw,
                ) as {
                  completedTaskIds?: unknown;
                };

              return (
                Array.isArray(
                  progress.completedTaskIds,
                ) &&
                progress.completedTaskIds.includes(
                  taskId,
                )
              );
            } catch {
              return false;
            }
          },
          {
            storageKey:
              MYSTERY_PROGRESS_KEY,
            taskId:
              task.id,
          },
        ),
      {
        timeout: 30_000,
      },
    )
    .toBe(true);
}


async function readMysteryProgressFromBrowser(
  page: Page,
): Promise<MysteryProgress> {
  return page.evaluate(
    (storageKey) => {
      const raw =
        window.localStorage.getItem(
          storageKey,
        );

      if (!raw) {
        throw new Error(
          "Mystery progress was not saved.",
        );
      }

      return JSON.parse(
        raw,
      ) as MysteryProgress;
    },
    MYSTERY_PROGRESS_KEY,
  );
}


function taskButton(
  dialog: Locator,
  task: MysteryTask,
): Locator {
  return dialog.getByRole(
    "button",
    {
      name:
        new RegExp(
          `${task.position}/5\\s+${escapeRegex(
            task.title,
          )}`,
          "i",
        ),
    },
  );
}


function escapeRegex(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}


function evidenceDialog(
  page: Page,
): Locator {
  return page.locator(
    '[role="dialog"][aria-labelledby="mystery-evidence-title"]',
  );
}


async function continueEvidence(
  page: Page,
): Promise<void> {
  const dialog =
    evidenceDialog(page);

  await expect(
    dialog,
  ).toBeVisible({
    timeout: 30_000,
  });

  const continueButton =
    dialog.getByRole(
      "button",
      {
        name:
          "Continue Investigation →",
      },
    );

  await expect(
    continueButton,
  ).toBeVisible();

  await expect(
    continueButton,
  ).toBeEnabled();

  await continueButton.click();
}


test.describe(
  "SQLTrain Murder Mystery workflows",
  () => {
    test(
      "Mystery is locked before Lesson 10 and unlocked after Lesson 10",
      async ({ page }) => {
        await seedMysteryEnvironment(
          page,
          {
            unlock: false,
            teaserSeen: true,
          },
        );

        await page.goto("/");

        const lockedButton =
          page.getByRole(
            "button",
            {
              name:
                "🔒 Mystery · Lesson 10",
            },
          );

        await expect(
          lockedButton,
        ).toBeVisible({
          timeout: 30_000,
        });

        await expect(
          lockedButton,
        ).toBeDisabled();

        await page.evaluate(
          ({
            key,
            lessonId,
          }) => {
            window.localStorage.setItem(
              key,
              JSON.stringify([
                lessonId,
              ]),
            );

            /*
             * SqlWorkbench subscribes to this same event through
             * subscribeToLessonProgress(). Trigger the real
             * application update without navigating away.
             */
            window.dispatchEvent(
              new Event(
                "sqltrain.lesson-progress.changed",
              ),
            );
          },
          {
            key:
              LESSON_PROGRESS_KEY,
            lessonId:
              lessonTen.id,
          },
        );

        const unlockedButton =
          page.getByRole(
            "button",
            {
              name:
                "🔎 Murder Mystery",
            },
          );

        await expect(
          unlockedButton,
        ).toBeVisible({
          timeout: 30_000,
        });

        await expect(
          unlockedButton,
        ).toBeEnabled();

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "first unlock shows the Mystery teaser and can start the investigation",
      async ({ page }) => {
        await seedMysteryEnvironment(
          page,
          {
            unlock: true,
            teaserSeen: false,
          },
        );

        await page.goto("/");

        const teaser =
          page.locator(
            ".sqltrain-mystery-teaser",
          );

        await expect(
          teaser,
        ).toBeVisible({
          timeout: 30_000,
        });

        await expect(
          teaser.getByText(
            /Follow the evidence through 20 connected/i,
          ),
        ).toBeVisible();

        const teaserButtons =
          teaser.getByRole(
            "button",
          );

        await expect(
          teaserButtons,
        ).not.toHaveCount(0);

        await teaserButtons.last().click();

        const mystery =
          page.getByRole(
            "dialog",
            {
              name:
                "SQL Murder Mystery",
            },
          );

        await expect(
          mystery,
        ).toBeVisible({
          timeout: 30_000,
        });

        const teaserSeen =
          await page.evaluate(
            (key) =>
              window.localStorage.getItem(
                key,
              ),
            MYSTERY_TEASER_KEY,
          );

        expect(
          teaserSeen,
        ).toBe(
          "true",
        );

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "investigation opens, exits, and keeps the normal database untouched",
      async ({ page }) => {
        await seedMysteryEnvironment(
          page,
        );

        await page.goto("/");

        const customersBefore =
          page.getByRole(
            "button",
            {
              name:
                /^Customers\s+91$/,
            },
          );

        await expect(
          customersBefore,
        ).toBeVisible({
          timeout: 30_000,
        });

        const mysteryButton =
          page.getByRole(
            "button",
            {
              name:
                "🔎 Murder Mystery",
            },
          );

        await mysteryButton.click();

        const dialog =
          page.getByRole(
            "dialog",
            {
              name:
                "SQL Murder Mystery",
            },
          );

        await expect(
          dialog,
        ).toBeVisible();

        await dialog
          .getByRole(
            "button",
            {
              name:
                "Exit Investigation",
            },
          )
          .click();

        await expect(
          dialog,
        ).toBeHidden();

        await expect(
          page.getByRole(
            "button",
            {
              name:
                /^Customers\s+91$/,
            },
          ),
        ).toBeVisible();

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "Case Database preview, chapter locks and task locks work",
      async ({ page }) => {
        await seedMysteryEnvironment(
          page,
        );

        const dialog =
          await openMystery(
            page,
          );

        const firstTask =
          getMysteryTaskByNumber(
            1,
          );

        const secondTask =
          getMysteryTaskByNumber(
            2,
          );

        const levelOne =
          MYSTERY_LEVELS.find(
            (level) =>
              level.number === 1,
          );

        if (!levelOne) {
          throw new Error(
            "Mystery Level 1 was not found.",
          );
        }

        await expect(
          dialog.getByText(
            `Level 1 · ${levelOne.title}`,
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          taskButton(
            dialog,
            firstTask,
          ),
        ).toBeEnabled();

        await expect(
          taskButton(
            dialog,
            secondTask,
          ),
        ).toBeDisabled();

        const chapterTwo =
          dialog.getByRole(
            "button",
            {
              name:
                "2",
              exact: true,
            },
          );

        await expect(
          chapterTwo,
        ).toBeDisabled();

        const previewButton =
          dialog.getByRole(
            "button",
            {
              name:
                "Preview first 3 rows",
            },
          )
          .first();

        await expect(
          previewButton,
        ).toBeVisible();

        await previewButton.click();

        const evidenceSection =
          dialog
            .getByRole(
              "heading",
              {
                name:
                  "Evidence Result",
              },
            )
            .locator(
              "..",
            );

        await expect(
          evidenceSection.locator(
            "tbody tr",
          ),
        ).toHaveCount(
          3,
          {
            timeout: 30_000,
          },
        );

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "Hints, Show Solution, Reset and Run SQL are usable",
      async ({ page }) => {
        await seedMysteryEnvironment(
          page,
        );

        const dialog =
          await openMystery(
            page,
          );

        const activeTask =
          getMysteryTaskByNumber(
            1,
          );

        await dialog
          .getByRole(
            "button",
            {
              name:
                "💡 Hints",
            },
          )
          .click();

        for (
          const hint of
          activeTask.hints
        ) {
          await expect(
            dialog.getByText(
              hint,
              {
                exact: true,
              },
            ),
          ).toBeVisible();
        }

        await dialog
          .getByRole(
            "button",
            {
              name:
                "Show Solution",
            },
          )
          .click();

        await expect(
          dialog.getByText(
            "Solution loaded. Run it and study why it works.",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        const editor =
          dialog.getByRole(
            "textbox",
            {
              name:
                "Editor content",
            },
          );

        await expect(
          editor,
        ).toBeVisible();

        await dialog
          .getByRole(
            "button",
            {
              name:
                "▶ Run SQL",
            },
          )
          .click();

        await expect(
          dialog
            .getByRole(
              "heading",
              {
                name:
                  "Evidence Result",
              },
            )
            .locator(
              "..",
            )
            .locator(
              "table",
            ),
        ).toBeVisible({
          timeout: 30_000,
        });

        await dialog
          .getByRole(
            "button",
            {
              name:
                "Reset",
            },
          )
          .click();

        await expect(
          dialog.getByText(
            "Solution loaded. Run it and study why it works.",
            {
              exact: true,
            },
          ),
        ).toHaveCount(0);

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "wrong SQL does not complete the task or unlock the next clue",
      async ({ page }) => {
        await seedMysteryEnvironment(
          page,
        );

        const dialog =
          await openMystery(
            page,
          );

        const firstTask =
          getMysteryTaskByNumber(
            1,
          );

        const secondTask =
          getMysteryTaskByNumber(
            2,
          );

        await setMysterySql(
          page,
          dialog,
          "SELECT 1;",
        );

        await dialog
          .getByRole(
            "button",
            {
              name:
                "✓ Check Answer",
            },
          )
          .click();

        await expect(
          dialog.getByText(
            firstTask.successStory,
            {
              exact: true,
            },
          ),
        ).toHaveCount(0);

        await expect(
          taskButton(
            dialog,
            secondTask,
          ),
        ).toBeDisabled();

        const progress =
          await page.evaluate(
            (key) => {
              const raw =
                window.localStorage.getItem(
                  key,
                );

              return raw
                ? JSON.parse(
                    raw,
                  )
                : null;
            },
            MYSTERY_PROGRESS_KEY,
          );

        if (progress) {
          expect(
            progress.completedTaskIds,
          ).not.toContain(
            firstTask.id,
          );
        }

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "correct SQL completes a task, unlocks Next Clue and persists after reload",
      async ({ page }) => {
        await seedMysteryEnvironment(
          page,
        );

        const dialog =
          await openMystery(
            page,
          );

        const firstTask =
          getMysteryTaskByNumber(
            1,
          );

        const secondTask =
          getMysteryTaskByNumber(
            2,
          );

        await solveActiveTask(
          page,
          dialog,
          firstTask,
        );

        await expect(
          taskButton(
            dialog,
            secondTask,
          ),
        ).toBeEnabled();

        const nextButton =
          dialog.getByRole(
            "button",
            {
              name:
                "Next Clue →",
            },
          );

        await expect(
          nextButton,
        ).toBeVisible();

        await nextButton.click();

        await expect(
          dialog.getByRole(
            "heading",
            {
              name:
                secondTask.title,
            },
          ),
        ).toBeVisible();

        const progress =
          await readMysteryProgressFromBrowser(
            page,
          );

        expect(
          progress.completedTaskIds,
        ).toContain(
          firstTask.id,
        );

        expect(
          progress.activeTaskId,
        ).toBe(
          secondTask.id,
        );

        await page.reload();

        const mysteryButton =
          page.getByRole(
            "button",
            {
              name:
                "🔎 Murder Mystery",
            },
          );

        await mysteryButton.click();

        const resumed =
          page.getByRole(
            "dialog",
            {
              name:
                "SQL Murder Mystery",
            },
          );

        await expect(
          resumed.getByRole(
            "heading",
            {
              name:
                secondTask.title,
            },
          ),
        ).toBeVisible({
          timeout: 30_000,
        });

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "finishing task 5 completes Level 1, shows evidence and unlocks Level 2",
      async ({ page }) => {
        const taskFive =
          getMysteryTaskByNumber(
            5,
          );

        await seedMysteryEnvironment(
          page,
          {
            progress:
              progressBeforeTask(
                5,
              ),
          },
        );

        const dialog =
          await openMystery(
            page,
          );

        await expect(
          dialog.getByRole(
            "heading",
            {
              name:
                taskFive.title,
            },
          ),
        ).toBeVisible();

        await solveActiveTask(
          page,
          dialog,
          taskFive,
        );

        const levelOne =
          MYSTERY_LEVELS.find(
            (level) =>
              level.number === 1,
          )!;

        const progress =
          await readMysteryProgressFromBrowser(
            page,
          );

        expect(
          progress.completedLevelIds,
        ).toContain(
          levelOne.id,
        );

        const evidence =
          evidenceDialog(
            page,
          );

        await expect(
          evidence,
        ).toBeVisible({
          timeout: 30_000,
        });

        await expectElementInsideViewport(
          evidence,
        );

        await continueEvidence(
          page,
        );

        const levelTwo =
          MYSTERY_LEVELS.find(
            (level) =>
              level.number === 2,
          );

        if (!levelTwo) {
          throw new Error(
            "Mystery Level 2 was not found.",
          );
        }

        await expect(
          dialog.getByText(
            `Level 2 · ${levelTwo.title}`,
            {
              exact: true,
            },
          ),
        ).toBeVisible({
          timeout: 30_000,
        });

        const chapterTwo =
          dialog.getByRole(
            "button",
            {
              name:
                "2",
              exact: true,
            },
          );

        await expect(
          chapterTwo,
        ).toBeEnabled();

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "a real sandbox task can be solved and persisted",
      async ({ page }) => {
        const sandboxTask =
          MYSTERY_TASKS.find(
            (task) =>
              task.executionMode ===
              "sandbox",
          );

        if (!sandboxTask) {
          throw new Error(
            "No Mystery sandbox task exists.",
          );
        }

        await seedMysteryEnvironment(
          page,
          {
            progress:
              progressBeforeTask(
                sandboxTask.number,
              ),
          },
        );

        const dialog =
          await openMystery(
            page,
          );

        await expect(
          dialog.getByRole(
            "heading",
            {
              name:
                sandboxTask.title,
            },
          ),
        ).toBeVisible({
          timeout: 30_000,
        });

        await solveActiveTask(
          page,
          dialog,
          sandboxTask,
        );

        const progress =
          await readMysteryProgressFromBrowser(
            page,
          );

        expect(
          progress.completedTaskIds,
        ).toContain(
          sandboxTask.id,
        );

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "later progress updates the Suspect Board and Investigation Funnel",
      async ({ page }) => {
        const levelEightFirstTask =
          MYSTERY_TASKS.find(
            (task) =>
              task.levelNumber === 8 &&
              task.position === 1,
          );

        if (!levelEightFirstTask) {
          throw new Error(
            "Level 8 first task was not found.",
          );
        }

        await seedMysteryEnvironment(
          page,
          {
            progress:
              progressBeforeTask(
                levelEightFirstTask.number,
              ),
          },
        );

        const dialog =
          await openMystery(
            page,
          );

        await expect(
          dialog.getByText(
            "Direct killer: Elias Vogel",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          dialog.getByText(
            "Further evidence locked...",
            {
              exact: true,
            },
          ),
        ).toHaveCount(0);

        await expect(
          dialog.getByText(
            "Suspect Board",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "final Task 100 opens final evidence and Case Closed",
      async ({ page }) => {
        const finalTask =
          getMysteryTaskByNumber(
            100,
          );

        await seedMysteryEnvironment(
          page,
          {
            progress:
              progressBeforeTask(
                100,
              ),
          },
        );

        const dialog =
          await openMystery(
            page,
          );

        await expect(
          dialog.getByRole(
            "heading",
            {
              name:
                finalTask.title,
            },
          ),
        ).toBeVisible({
          timeout: 30_000,
        });

        await solveActiveTask(
          page,
          dialog,
          finalTask,
        );

        const finalProgress =
          await readMysteryProgressFromBrowser(
            page,
          );

        expect(
          finalProgress.completedTaskIds,
        ).toHaveLength(
          100,
        );

        expect(
          finalProgress.completedLevelIds,
        ).toHaveLength(
          20,
        );

        const evidence =
          evidenceDialog(
            page,
          );

        await expect(
          evidence,
        ).toBeVisible({
          timeout: 30_000,
        });

        await expectElementInsideViewport(
          evidence,
        );

        await continueEvidence(
          page,
        );

        const caseClosedDialog =
          page.getByRole(
            "dialog",
            {
              name:
                "Case Closed",
            },
          );

        await expect(
          caseClosedDialog,
        ).toBeVisible({
          timeout: 30_000,
        });

        await expect(
          caseClosedDialog.getByRole(
            "heading",
            {
              name:
                "CASE CLOSED",
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          caseClosedDialog.getByText(
            /100 SQL investigation/i,
          ),
        ).toBeVisible();

        await expect(
          caseClosedDialog.getByText(
            "Master Detective",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expectNoBodyOverflow(
          page,
        );
      },
    );
  },
);
