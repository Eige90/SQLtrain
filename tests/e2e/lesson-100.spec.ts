import {
  expect,
  test,
} from "@playwright/test";

import * as fs
  from "node:fs";

const lessonSource =
  fs.readFileSync(
    "src/data/lessons.ts",
    "utf8",
  );

const lessons = [
  ...lessonSource.matchAll(
    /\{\s*"id"\s*:\s*"([^"]+)"\s*,\s*"number"\s*:\s*(\d+)/g,
  ),
]
  .map(
    (match) => ({
      id: match[1],
      number:
        Number(
          match[2],
        ),
    }),
  )
  .sort(
    (left, right) =>
      left.number -
      right.number,
  );

if (
  lessons.length !== 100
) {
  throw new Error(
    `Expected 100 lessons, found ${lessons.length}.`,
  );
}

const first99LessonIds =
  lessons
    .filter(
      (lesson) =>
        lesson.number <= 99,
    )
    .map(
      (lesson) =>
        lesson.id,
    );

test(
  "Lesson 100 completes the course and fills the XP bar",
  async ({
    page,
  }) => {
    // Establish the real application origin first.
    await page.goto("/");

    // Seed progress only after localStorage belongs to
    // the SQLTrain origin. This avoids timing/origin issues
    // with addInitScript.
    await page.evaluate(
      ({
        completedIds,
      }) => {
        localStorage.setItem(
          "sqltrain.lesson-progress.v1",
          JSON.stringify(
            completedIds,
          ),
        );

        // Prevent the Lesson-10 Murder Mystery teaser
        // from covering the Lesson-100 test.
        localStorage.setItem(
          "sqltrain.mystery-teaser-seen.v1",
          "true",
        );
      },
      {
        completedIds:
          first99LessonIds,
      },
    );

    const seededLessonCount =
      await page.evaluate(
        () => {
          const raw =
            localStorage.getItem(
              "sqltrain.lesson-progress.v1",
            );

          if (!raw) {
            return 0;
          }

          const parsed =
            JSON.parse(raw);

          return Array.isArray(
            parsed,
          )
            ? parsed.length
            : 0;
        },
      );

    console.log(
      "Initial seeded lesson count:",
      seededLessonCount,
    );

    const seededSnapshot =
      await page.evaluate(
        () => {
          const raw =
            localStorage.getItem(
              "sqltrain.lesson-progress.v1",
            );

          const parsed =
            raw
              ? JSON.parse(raw)
              : [];

          return {
            first:
              parsed[0],
            second:
              parsed[1],
            last:
              parsed[
                parsed.length - 1
              ],
            firstType:
              typeof parsed[0],
            stringCount:
              Array.isArray(parsed)
                ? parsed.filter(
                    (value) =>
                      typeof value ===
                      "string",
                  ).length
                : 0,
          };
        },
      );

    console.log(
      "Seeded progress snapshot:",
      seededSnapshot,
    );

    expect(
      seededLessonCount,
    ).toBe(99);

    await page.reload();

    await expect
      .poll(
        async () => {
          return page.evaluate(
            () => {
              const raw =
                localStorage.getItem(
                  "sqltrain.lesson-progress.v1",
                );

              if (!raw) {
                return 0;
              }

              const parsed =
                JSON.parse(raw);

              return Array.isArray(
                parsed,
              )
                ? parsed.length
                : 0;
            },
          );
        },
      )
      .toBe(99);

    const lessonsButton =
      page
        .getByRole(
          "button",
          {
            name: /Lessons/i,
          },
        )
        .first();

    await expect(
      lessonsButton,
    ).toBeVisible({
      timeout: 30_000,
    });

    // The server snapshot is 0/100 during hydration.
    // The browser snapshot must then update automatically
    // from localStorage without opening the Lessons dialog.
    await expect(
      lessonsButton,
    ).toContainText(
      /99\s*\/\s*100/,
      {
        timeout: 10_000,
      },
    );

    const initialHeaderText =
      (
        await lessonsButton
          .innerText()
      )
        .replace(
          /\s+/g,
          " ",
        )
        .trim();

    console.log(
      "Hydrated header before opening Lessons:",
      initialHeaderText,
    );

    // Opening the Lessons dialog deliberately refreshes
    // completedLessonIds from localStorage.
    await lessonsButton.click();

    await expect(
      page.getByRole(
        "dialog",
      ),
    ).toBeVisible({
      timeout: 10_000,
    });

    const dialogText =
      (
        await page
          .getByRole(
            "dialog",
          )
          .innerText()
      )
        .replace(
          /\s+/g,
          " ",
        )
        .trim();

    console.log(
      "Lessons dialog:",
      dialogText.slice(
        0,
        250,
      ),
    );

    await expect(
      page.getByText(
        /99\s+of\s+100\s+completed/i,
      ),
    ).toBeVisible({
      timeout: 30_000,
    });

    console.log(
      "✅ Lessons dialog loaded 99/100 from localStorage."
    );

    const finalLesson =
      page
        .getByRole(
          "button",
        )
        .filter({
          hasText:
            "Final Project: Build the SQLTrain Railway",
        });

    await expect(
      finalLesson,
    ).toBeVisible();

    await finalLesson.click();

    await page
      .getByRole(
        "button",
        {
          name:
            "Start Lesson",
          exact: true,
        },
      )
      .click();

    await expect(
      page.getByText(
        "Final Project: Build the SQLTrain Railway",
        {
          exact: true,
        },
      ),
    ).toBeVisible();

    await page
      .getByRole(
        "button",
        {
          name:
            /Show Solution/i,
        },
      )
      .click();

    await expect(
      page.getByText(
        /solution has been loaded/i,
      ),
    ).toBeVisible();

    await page
      .getByRole(
        "button",
        {
          name:
            /Check Answer/i,
        },
      )
      .click();

    await expect
      .poll(
        async () => {
          return page.evaluate(
            () => {
              const raw =
                localStorage.getItem(
                  "sqltrain.lesson-progress.v1",
                );

              if (!raw) {
                return 0;
              }

              const parsed =
                JSON.parse(raw);

              return Array.isArray(
                parsed,
              )
                ? parsed.length
                : 0;
            },
          );
        },
        {
          timeout:
            30_000,
        },
      )
      .toBe(100);

    // SQL Pro celebration handling
    const returnHomeButton =
      page.getByRole(
        "button",
        {
          name:
            /Return Home/i,
        },
      );

    if (
      await returnHomeButton
        .isVisible()
        .catch(
          () => false,
        )
    ) {
      await expect(
        page.getByText(
          /SQL Pro/i,
        ).first(),
      ).toBeVisible();

      await returnHomeButton.click();
    }

    const savedIds =
      await page.evaluate(
        () => {
          const raw =
            localStorage.getItem(
              "sqltrain.lesson-progress.v1",
            );

          return raw
            ? JSON.parse(
                raw,
              )
            : [];
        },
      );

    expect(
      savedIds,
    ).toContain(
      "sql-pro-final-project",
    );

    const completedLessonsButton =
      page
        .getByRole(
          "button",
          {
            name: /Lessons/i,
          },
        )
        .first();

    await expect(
      completedLessonsButton,
    ).toBeVisible();

    const completedButtonText =
      (
        await completedLessonsButton
          .innerText()
      )
        .replace(
          /\s+/g,
          " ",
        )
        .trim();

    console.log(
      "Completed Lessons button:",
      completedButtonText,
    );

    expect(
      completedButtonText,
    ).toMatch(
      /100\s*\/\s*100/,
    );

    const xpProgress =
      page.getByRole(
        "progressbar",
        {
          name:
            "Lesson XP progress",
        },
      );

    await expect(
      xpProgress,
    ).toHaveAttribute(
      "aria-valuenow",
      "100",
    );

    await expect(
      page.getByText(
        "COURSE COMPLETE",
        {
          exact: true,
        },
      ),
    ).toHaveCount(1);

    const width =
      await page
        .getByTestId(
          "lesson-xp-progress",
        )
        .locator("div")
        .evaluate(
          (
            element,
          ) =>
            (
              element as HTMLElement
            ).style.width,
        );

    expect(
      width,
    ).toBe(
      "100%",
    );
  },
);
