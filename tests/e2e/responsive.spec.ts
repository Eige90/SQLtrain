import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";

import fs from "node:fs";

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

const firstTenLessonIds =
  lessons
    .filter(
      (lesson) =>
        lesson.number <= 10,
    )
    .map(
      (lesson) =>
        lesson.id,
    );

async function seedMysteryUnlock(
  page: Page,
): Promise<void> {
  await page.goto("/");

  await page.evaluate(
    ({
      completedLessonIds,
    }) => {
      localStorage.setItem(
        "sqltrain.lesson-progress.v1",
        JSON.stringify(
          completedLessonIds,
        ),
      );

      localStorage.setItem(
        "sqltrain.mystery-teaser-seen.v1",
        "true",
      );
    },
    {
      completedLessonIds:
        firstTenLessonIds,
    },
  );

  await page.reload();
}

async function expectNoPageOverflow(
  page: Page,
): Promise<void> {
  await expect
    .poll(
      async () =>
        page.evaluate(
          () => {
            const root =
              document.documentElement;

            const body =
              document.body;

            return (
              root.scrollWidth <=
                root.clientWidth + 1 &&
              body.scrollWidth <=
                body.clientWidth + 1
            );
          },
        ),
      {
        timeout: 15_000,
      },
    )
    .toBe(true);
}

async function expectInsideViewport(
  locator: Locator,
  page: Page,
): Promise<void> {
  await expect(
    locator,
  ).toBeVisible();

  const box =
    await locator.boundingBox();

  const viewport =
    page.viewportSize();

  if (
    !box ||
    !viewport
  ) {
    throw new Error(
      "Could not determine element or viewport size.",
    );
  }

  expect(
    box.x,
  ).toBeGreaterThanOrEqual(
    -1,
  );

  expect(
    box.x + box.width,
  ).toBeLessThanOrEqual(
    viewport.width + 1,
  );
}

async function hasHorizontalScrollContainer(
  locator: Locator,
): Promise<boolean> {
  return locator.evaluate(
    (element) => {
      let current:
        HTMLElement | null =
          element as HTMLElement;

      while (current) {
        const style =
          window.getComputedStyle(
            current,
          );

        if (
          style.overflowX ===
            "auto" ||
          style.overflowX ===
            "scroll"
        ) {
          return true;
        }

        current =
          current.parentElement;
      }

      return false;
    },
  );
}

test.describe(
  "SQLTrain responsive layout",
  () => {
    test(
      "home page fits the viewport and results can scroll internally",
      async ({
        page,
      }) => {
        await page.goto("/");

        await expect(
          page.getByText(
            "SQLTrain",
            {
              exact: true,
            },
          ).first(),
        ).toBeVisible({
          timeout: 30_000,
        });

        await expectNoPageOverflow(
          page,
        );

        const runSql =
          page.getByRole(
            "button",
            {
              name:
                "Run SQL",
              exact: true,
            },
          );

        await expectInsideViewport(
          runSql,
          page,
        );

        await runSql.click();

        const resultTable =
          page
            .locator("table")
            .first();

        await expect(
          resultTable,
        ).toBeVisible({
          timeout: 30_000,
        });

        expect(
          await hasHorizontalScrollContainer(
            resultTable,
          ),
        ).toBe(true);

        await expectNoPageOverflow(
          page,
        );
      },
    );

    test(
      "lessons remain usable without page overflow",
      async ({
        page,
      }) => {
        await page.goto("/");

        const lessonsButton =
          page
            .getByRole(
              "button",
              {
                name:
                  /Lessons/i,
              },
            )
            .first();

        await expect(
          lessonsButton,
        ).toBeVisible();

        await lessonsButton.click();

        const dialog =
          page.getByRole(
            "dialog",
          );

        await expectInsideViewport(
          dialog,
          page,
        );

        await expect(
          page.getByRole(
            "button",
            {
              name:
                "Start Lesson",
              exact: true,
            },
          ),
        ).toBeVisible();

        await expectNoPageOverflow(
          page,
        );
      },
    );

    test(
      "murder mystery remains usable without page overflow",
      async ({
        page,
      }) => {
        await seedMysteryUnlock(
          page,
        );

        const mysteryButton =
          page.getByRole(
            "button",
            {
              name:
                /Murder Mystery/i,
            },
          );

        await expect(
          mysteryButton,
        ).toBeEnabled({
          timeout: 30_000,
        });

        await mysteryButton.click();

        await expect(
          page.getByText(
            "The Night Train to Bern",
            {
              exact: true,
            },
          ),
        ).toBeVisible({
          timeout: 30_000,
        });

        await expectNoPageOverflow(
          page,
        );

        await expect(
          page.getByText(
            /Case Database/i,
          ).first(),
        ).toBeVisible();

        await expect(
          page.getByText(
            /Current Suspects|Suspect Board/i,
          ).first(),
        ).toBeVisible();

        const mysteryRunSql =
          page.getByRole(
            "button",
            {
              name:
                /^▶ Run SQL$/i,
            },
          );

        await expect(
          mysteryRunSql,
        ).toBeVisible();

        await expectInsideViewport(
          mysteryRunSql,
          page,
        );

        const checkAnswer =
          page.getByRole(
            "button",
            {
              name:
                /Check Answer/i,
            },
          );

        await expect(
          checkAnswer,
        ).toBeVisible();

        const purchaseHistory =
          page
            .getByRole(
              "button",
            )
            .filter({
              hasText:
                "purchase_history",
            })
            .first();

        await expect(
          purchaseHistory,
        ).toBeVisible();

        const tableButtonText =
          await purchaseHistory
            .innerText();

        if (
          !tableButtonText.includes(
            "▲",
          )
        ) {
          await purchaseHistory.click();
        }

        const preview =
          page.getByRole(
            "button",
            {
              name:
                /Preview first 3 rows/i,
            },
          );

        await expect(
          preview,
        ).toBeVisible();

        await preview.click();

        await expectNoPageOverflow(
          page,
        );
      },
    );
  },
);
