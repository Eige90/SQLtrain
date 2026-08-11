import {
  expect,
  test,
  type Page,
} from "@playwright/test";

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT =
  process.cwd();

type NumberedId = {
  number: number;
  id: string;
};

type MysteryProgressSeed = {
  completedTaskIds: string[];
  completedLevelIds: string[];
  activeLevelId: string;
  activeTaskId: string;
};

type BrowserSeed = {
  lessonKey: string;
  lessonIds: string[];
  teaserKey: string;
  teaserValue: string;
  mysteryKey: string;
  mysteryProgress:
    MysteryProgressSeed | null;
};

function readTree(
  target: string,
): string {
  if (
    !fs.existsSync(target)
  ) {
    return "";
  }

  const stat =
    fs.statSync(target);

  if (stat.isFile()) {
    return fs.readFileSync(
      target,
      "utf8",
    );
  }

  return fs
    .readdirSync(target)
    .sort()
    .map((entry) =>
      readTree(
        path.join(
          target,
          entry,
        ),
      ),
    )
    .join("\n");
}

function detectStorageKey(
  source: string,
  hint: RegExp,
): string {
  const keys = [
    ...source.matchAll(
      /["'`](sqltrain\.[^"'`]+)["'`]/g,
    ),
  ].map(
    (match) =>
      match[1],
  );

  const found =
    keys.find(
      (key) =>
        hint.test(key),
    );

  if (!found) {
    throw new Error(
      `Could not detect localStorage key matching ${hint}.`,
    );
  }

  return found;
}

function detectStoredValue(
  source: string,
): string {
  const match =
    source.match(
      /\.setItem\(\s*[^,]+,\s*["'`]([^"'`]+)["'`]\s*\)/,
    );

  return (
    match?.[1] ??
    "1"
  );
}

const LESSON_PROGRESS_SOURCE =
  readTree(
    path.join(
      ROOT,
      "src/lib/lessons/lesson-progress.ts",
    ),
  );

const MYSTERY_PROGRESS_SOURCE =
  readTree(
    path.join(
      ROOT,
      "src/lib/mystery/mystery-progress.ts",
    ),
  );

const MYSTERY_TEASER_SOURCE =
  readTree(
    path.join(
      ROOT,
      "src/lib/mystery/mystery-teaser.ts",
    ),
  );

const LESSON_DATA_SOURCE = [
  readTree(
    path.join(
      ROOT,
      "src/data/lessons.ts",
    ),
  ),
  readTree(
    path.join(
      ROOT,
      "src/data/lessons",
    ),
  ),
].join("\n");

const MYSTERY_LEVEL_SOURCE =
  readTree(
    path.join(
      ROOT,
      "src/data/mystery/mystery-levels.ts",
    ),
  );

const LESSON_PROGRESS_KEY =
  detectStorageKey(
    LESSON_PROGRESS_SOURCE,
    /lesson/i,
  );

const MYSTERY_PROGRESS_KEY =
  detectStorageKey(
    MYSTERY_PROGRESS_SOURCE,
    /mystery/i,
  );

const MYSTERY_TEASER_KEY =
  detectStorageKey(
    MYSTERY_TEASER_SOURCE,
    /teaser|mystery/i,
  );

const MYSTERY_TEASER_VALUE =
  detectStoredValue(
    MYSTERY_TEASER_SOURCE,
  );

const LESSON_ENTRIES: NumberedId[] = [
  ...LESSON_DATA_SOURCE.matchAll(
    /\{\s*"id"\s*:\s*"([^"]+)"\s*,\s*"number"\s*:\s*(\d+)/g,
  ),
]
  .map(
    (match) => ({
      id: match[1],
      number: Number(match[2]),
    }),
  )
  .sort(
    (left, right) =>
      left.number -
      right.number,
  );

const MYSTERY_LEVELS: NumberedId[] = [
  ...MYSTERY_LEVEL_SOURCE.matchAll(
    /\{\s*["'`]?id["'`]?\s*:\s*["'`]([^"'`]+)["'`]\s*,\s*["'`]?number["'`]?\s*:\s*(\d+)/g,
  ),
]
  .map(
    (match) => ({
      id: match[1],
      number: Number(match[2]),
    }),
  )
  .sort(
    (left, right) =>
      left.number -
      right.number,
  );


if (
  LESSON_ENTRIES.length <
  100
) {
  throw new Error(
    `Expected 100 SQL lessons, found ${LESSON_ENTRIES.length}.`,
  );
}

if (
  MYSTERY_LEVELS.length <
  20
) {
  throw new Error(
    `Expected 20 Mystery Levels, found ${MYSTERY_LEVELS.length}.`,
  );
}

const ALL_LESSON_IDS =
  LESSON_ENTRIES
    .slice(0, 100)
    .map(
      (entry) =>
        entry.id,
    );

function mysteryTaskId(
  number: number,
): string {
  return (
    "mystery-task-" +
    String(number)
      .padStart(
        3,
        "0",
      )
  );
}

function mysteryLevelId(
  number: number,
): string {
  const level =
    MYSTERY_LEVELS.find(
      (entry) =>
        entry.number ===
        number,
    );

  if (!level) {
    throw new Error(
      `Mystery Level ${number} was not found.`,
    );
  }

  return level.id;
}

function buildMysteryProgress(
  completedTaskCount: number,
  activeLevelNumber: number,
  activeTaskNumber: number,
): MysteryProgressSeed {
  const completedTaskIds =
    Array.from(
      {
        length:
          completedTaskCount,
      },
      (_, index) =>
        mysteryTaskId(
          index + 1,
        ),
    );

  const completedLevelIds =
    MYSTERY_LEVELS
      .filter(
        (level) =>
          level.number <
          activeLevelNumber,
      )
      .map(
        (level) =>
          level.id,
      );

  return {
    completedTaskIds,
    completedLevelIds,
    activeLevelId:
      mysteryLevelId(
        activeLevelNumber,
      ),
    activeTaskId:
      mysteryTaskId(
        activeTaskNumber,
      ),
  };
}

async function installBrowserState(
  page: Page,
  mysteryProgress:
    MysteryProgressSeed | null =
      null,
): Promise<void> {
  const seed:
    BrowserSeed = {
      lessonKey:
        LESSON_PROGRESS_KEY,
      lessonIds:
        ALL_LESSON_IDS,
      teaserKey:
        MYSTERY_TEASER_KEY,
      teaserValue:
        MYSTERY_TEASER_VALUE,
      mysteryKey:
        MYSTERY_PROGRESS_KEY,
      mysteryProgress,
    };

  // Establish the SQLTrain origin first.
  await page.goto("/");

  await page.evaluate(
    (state:
      BrowserSeed) => {
      localStorage.setItem(
        state.lessonKey,
        JSON.stringify(
          state.lessonIds,
        ),
      );

      localStorage.setItem(
        state.teaserKey,
        state.teaserValue,
      );

      if (
        state.mysteryProgress
      ) {
        localStorage.setItem(
          state.mysteryKey,
          JSON.stringify(
            state.mysteryProgress,
          ),
        );
      } else {
        localStorage.removeItem(
          state.mysteryKey,
        );
      }
    },
    seed,
  );

  await page.reload();
}

function monitorRuntimeErrors(
  page: Page,
): string[] {
  const errors:
    string[] = [];

  page.on(
    "pageerror",
    (error) => {
      errors.push(
        `pageerror: ${error.message}`,
      );
    },
  );

  page.on(
    "console",
    (message) => {
      if (
        message.type() !==
        "error"
      ) {
        return;
      }

      const text =
        message.text();

      if (
        /favicon/i.test(text)
      ) {
        return;
      }

      errors.push(
        `console.error: ${text}`,
      );
    },
  );

  return errors;
}

function expectNoRuntimeErrors(
  errors: string[],
): void {
  expect(
    errors,
    errors.join("\n"),
  ).toEqual([]);
}

async function openHome(
  page: Page,
): Promise<void> {
  await page.goto("/");

  await expect(
    page,
  ).toHaveTitle(
    /SQLTrain/i,
  );

  await expect(
    page.getByRole(
      "heading",
      {
        name:
          "SQLTrain",
      },
    ),
  ).toBeVisible();

  await expect(
    page.getByRole(
      "button",
      {
        name:
          /Run SQL/i,
      },
    ),
  ).toBeEnabled({
    timeout: 30_000,
  });

  await expect(
    page.getByText(
      "Customers",
      {
        exact: true,
      },
    ).first(),
  ).toBeVisible({
    timeout: 30_000,
  });
}

async function openMystery(
  page: Page,
): Promise<void> {
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
  ).toBeVisible({
    timeout: 30_000,
  });

  await expect(
    mysteryButton,
  ).toBeEnabled({
    timeout: 30_000,
  });

  const teaser =
    page.locator(
      ".sqltrain-mystery-teaser",
    );

  const startInvestigation =
    teaser.getByRole(
      "button",
      {
        name:
          /Start Investigation/i,
      },
    );

  // Lesson 10 may trigger the one-time Mystery teaser.
  // If it is already visible, enter the investigation
  // through the real teaser flow instead of trying to
  // click through the overlay.
  if (
    await teaser
      .isVisible()
      .catch(
        () => false,
      )
  ) {
    await expect(
      startInvestigation,
    ).toBeVisible();

    await startInvestigation.click();
  } else {
    try {
      await mysteryButton.click({
        timeout: 2_000,
      });
    } catch (error) {
      // The teaser appears 500 ms after the unlock.
      // It can therefore race the normal header click.
      if (
        await teaser
          .isVisible()
          .catch(
            () => false,
          )
      ) {
        await expect(
          startInvestigation,
        ).toBeVisible();

        await startInvestigation.click();
      } else {
        throw error;
      }
    }
  }

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
}

async function setMonacoSql(
  page: Page,
  sql: string,
): Promise<void> {
  const editor =
    page.locator(
      ".monaco-editor",
    ).first();

  await expect(
    editor,
  ).toBeVisible();

  await editor.click({
    position: {
      x: 120,
      y: 35,
    },
  });

  await page.keyboard.press(
    "Control+A",
  );

  await page.keyboard.insertText(
    sql,
  );
}

async function expectNoHorizontalOverflow(
  page: Page,
): Promise<void> {
  const dimensions =
    await page.evaluate(
      () => ({
        clientWidth:
          document
            .documentElement
            .clientWidth,
        scrollWidth:
          document
            .documentElement
            .scrollWidth,
      }),
    );

  expect(
    dimensions.scrollWidth,
    `Horizontal overflow: scrollWidth=${dimensions.scrollWidth}, clientWidth=${dimensions.clientWidth}`,
  ).toBeLessThanOrEqual(
    dimensions.clientWidth +
      2,
  );
}

test.describe(
  "SQLTrain full page",
  () => {
    test(
      "home page, SQLite, table mutation and restore work",
      async ({
        page,
      }) => {
        const runtimeErrors =
          monitorRuntimeErrors(
            page,
          );

        await openHome(
          page,
        );

        await expect(
          page.getByText(
            "SQL Statement",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Your Database",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Local and private",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        const expectedTables = [
          "Customers",
          "Categories",
          "Employees",
          "OrderDetails",
          "Orders",
          "Products",
          "Shippers",
          "Suppliers",
        ];

        for (
          const tableName
          of expectedTables
        ) {
          await expect(
            page.getByText(
              tableName,
              {
                exact: true,
              },
            ).first(),
          ).toBeVisible();
        }

        await setMonacoSql(
          page,
          "SELECT COUNT(*) AS customer_count FROM Customers;",
        );

        await page
          .getByRole(
            "button",
            {
              name:
                /Run SQL/i,
            },
          )
          .click();

        const customerHeader =
          page.getByRole(
            "columnheader",
            {
              name:
                "customer_count",
            },
          );

        await expect(
          customerHeader,
        ).toBeVisible();

        const resultTable =
          customerHeader.locator(
            "xpath=ancestor::table",
          );

        await expect(
          resultTable.getByRole(
            "cell",
            {
              name:
                "91",
            },
          ),
        ).toBeVisible();

        await setMonacoSql(
          page,
          "CREATE TABLE E2E_Page_Test (id INTEGER PRIMARY KEY, value TEXT);",
        );

        await page
          .getByRole(
            "button",
            {
              name:
                /Run SQL/i,
            },
          )
          .click();

        await expect(
          page.getByText(
            "E2E_Page_Test",
            {
              exact: true,
            },
          ).first(),
        ).toBeVisible();

        page.once(
          "dialog",
          (dialog) => {
            void dialog.accept();
          },
        );

        await page
          .getByRole(
            "button",
            {
              name:
                /Restore Database/i,
            },
          )
          .click();

        await expect(
          page.getByText(
            "E2E_Page_Test",
            {
              exact: true,
            },
          ),
        ).toHaveCount(0);

        await expect(
          page.getByText(
            "Customers",
            {
              exact: true,
            },
          ).first(),
        ).toBeVisible();

        await expectNoHorizontalOverflow(
          page,
        );

        expectNoRuntimeErrors(
          runtimeErrors,
        );
      },
    );

    test(
      "mystery starts at Level 1 and remains usable at 1024x768",
      async ({
        page,
      }) => {
        const runtimeErrors =
          monitorRuntimeErrors(
            page,
          );

        await page.setViewportSize({
          width: 1024,
          height: 768,
        });

        await installBrowserState(
          page,
        );

        await openMystery(
          page,
        );

        await expect(
          page.getByText(
            /Mystery Level 1/i,
          ).first(),
        ).toBeVisible();

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

        await expect(
          page.getByRole(
            "button",
            {
              name:
                /^▶ Run SQL$/i,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByRole(
            "button",
            {
              name:
                /Check Answer/i,
            },
          ),
        ).toBeVisible();

        const purchaseHistoryButton =
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
          purchaseHistoryButton,
        ).toBeVisible();

        const purchaseHistoryText =
          await purchaseHistoryButton
            .innerText();

        // The table may already be expanded when the
        // responsive Case Database opens.
        if (
          !purchaseHistoryText.includes(
            "▲",
          )
        ) {
          await purchaseHistoryButton.click();
        }

        const previewButton =
          page.getByRole(
            "button",
            {
              name:
                /Preview first 3 rows/i,
            },
          );

        await expect(
          previewButton,
        ).toBeVisible();

        await previewButton.click();

        await expectNoHorizontalOverflow(
          page,
        );

        expectNoRuntimeErrors(
          runtimeErrors,
        );
      },
    );

    test(
      "Level 19 CREATE TABLE sandbox and evidence update work",
      async ({
        page,
      }) => {
        const runtimeErrors =
          monitorRuntimeErrors(
            page,
          );

        await installBrowserState(
          page,
          buildMysteryProgress(
            94,
            19,
            95,
          ),
        );

        await openMystery(
          page,
        );

        await expect(
          page.getByText(
            "Lock Down the Evidence Rules",
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
            /Solution loaded/i,
          ),
        ).toBeVisible();

        await page
          .getByRole(
            "button",
            {
              name:
                /^▶ Run SQL$/i,
            },
          )
          .click();

        await expect(
          page.getByText(
            /not.?null.?columns/i,
          ).first(),
        ).toBeVisible();

        await expect(
          page.getByText(
            /foreign.?keys/i,
          ).first(),
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

        await expect(
          page.getByText(
            /Level 19 Solved/i,
          ),
        ).toBeVisible();

        await expect(
          page.getByRole(
            "heading",
            {
              name:
                "The Motive",
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Klara Meier",
            {
              exact: true,
            },
          ).first(),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Adrian Voss",
            {
              exact: true,
            },
          ).first(),
        ).toBeVisible();

        expectNoRuntimeErrors(
          runtimeErrors,
        );
      },
    );

    test(
      "Task 100 produces the final case and Master Detective screen",
      async ({
        page,
      }) => {
        const runtimeErrors =
          monitorRuntimeErrors(
            page,
          );

        await installBrowserState(
          page,
          buildMysteryProgress(
            99,
            20,
            100,
          ),
        );

        await openMystery(
          page,
        );

        await expect(
          page.getByRole(
            "heading",
            {
              name:
                "Create the Final Case File",
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
            /Solution loaded/i,
          ),
        ).toBeVisible();

        await page
          .getByRole(
            "button",
            {
              name:
                /^▶ Run SQL$/i,
            },
          )
          .click();

        const murdererHeader =
          page.getByRole(
            "columnheader",
            {
              name:
                "murderer",
            },
          );

        await expect(
          murdererHeader,
        ).toBeVisible();

        const finalResult =
          murdererHeader.locator(
            "xpath=ancestor::table",
          );

        for (
          const person
          of [
            "Elias Vogel",
            "Klara Meier",
            "Adrian Voss",
            "Nora Keller",
          ]
        ) {
          await expect(
            finalResult.getByText(
              person,
              {
                exact: true,
              },
            ),
          ).toBeVisible();
        }

        await page
          .getByRole(
            "button",
            {
              name:
                /Check Answer/i,
            },
          )
          .click();

        await expect(
          page.getByText(
            /Evidence Update · Level 20/i,
          ),
        ).toBeVisible();

        await expect(
          page.getByRole(
            "heading",
            {
              name:
                "CASE CLOSED",
            },
          ),
        ).toBeVisible();

        await page
          .getByRole(
            "button",
            {
              name:
                /Continue Investigation/i,
            },
          )
          .click();

        await expect(
          page.getByText(
            "Master Detective",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "100 / 100",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByRole(
            "button",
            {
              name:
                /Return to Case File/i,
            },
          ),
        ).toBeVisible();

        for (
          const person
          of [
            "Elias Vogel",
            "Klara Meier",
            "Adrian Voss",
            "Nora Keller",
          ]
        ) {
          await expect(
            page.getByText(
              person,
              {
                exact: true,
              },
            ).first(),
          ).toBeVisible();
        }

        await expectNoHorizontalOverflow(
          page,
        );

        expectNoRuntimeErrors(
          runtimeErrors,
        );
      },
    );
  },
);
