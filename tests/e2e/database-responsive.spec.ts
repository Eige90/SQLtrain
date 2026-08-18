import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";


async function expectNoBodyOverflow(
  page: Page,
): Promise<void> {
  await expect
    .poll(
      async () =>
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


async function expectLocatorInsideViewport(
  locator: Locator,
  page: Page,
): Promise<void> {
  await expect(locator).toBeVisible();

  const box =
    await locator.boundingBox();

  expect(box).not.toBeNull();

  if (!box) {
    return;
  }

  const viewport =
    page.viewportSize();

  expect(viewport).not.toBeNull();

  if (!viewport) {
    return;
  }

  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.y).toBeGreaterThanOrEqual(-1);

  expect(
    box.x + box.width,
  ).toBeLessThanOrEqual(
    viewport.width + 1,
  );
}


async function expectVisibleControlsUsable(
  container: Locator,
  page: Page,
): Promise<void> {
  const controls =
    container.locator(
      [
        "button",
        "input",
        "select",
        "textarea",
      ].join(","),
    );

  const count =
    await controls.count();

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const control =
      controls.nth(index);

    if (
      !(await control.isVisible())
    ) {
      continue;
    }

    await expectLocatorInsideViewport(
      control,
      page,
    );
  }
}


async function openDatabaseManager(
  page: Page,
): Promise<Locator> {
  await page.goto("/");

  const databaseButton =
    page.getByRole("button", {
      name: /Your Database/i,
    });

  await expect(
    databaseButton,
  ).toBeVisible({
    timeout: 30_000,
  });

  await databaseButton.click();

  const dialog =
    page.getByRole("dialog", {
      name: /Database Manager/i,
    });

  await expect(dialog).toBeVisible();

  return dialog;
}


test.describe(
  "SQLTrain responsive database",
  () => {
    test(
      "database manager fits the viewport and exposes all primary tools",
      async ({ page }) => {
        const dialog =
          await openDatabaseManager(
            page,
          );

        await expect(
          dialog.getByText(
            "Tables",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          dialog.getByRole(
            "button",
            {
              name: "Create Table",
            },
          ),
        ).toBeVisible();

        await expect(
          dialog.getByRole(
            "button",
            {
              name: "Import Excel or CSV",
            },
          ),
        ).toBeVisible();

        await expect(
          dialog.getByText(
            /Relationships/i,
          ).first(),
        ).toBeVisible();

        await expectNoBodyOverflow(
          page,
        );

        const primaryControls = [
          dialog.getByRole(
            "button",
            {
              name: "Create Table",
            },
          ),
          dialog.getByRole(
            "button",
            {
              name: "Import Excel or CSV",
            },
          ),
          dialog.getByRole(
            "button",
            {
              name: /Close database manager/i,
            },
          ),
        ];

        for (const control of primaryControls) {
          await control.scrollIntoViewIfNeeded();

          await expectLocatorInsideViewport(
            control,
            page,
          );
        }
      },
    );


    test(
      "table data stays inside an internal horizontal scroll area",
      async ({ page }) => {
        const dialog =
          await openDatabaseManager(
            page,
          );

        const customers =
          dialog.getByText(
            "Customers",
            {
              exact: true,
            },
          ).first();

        await expect(
          customers,
        ).toBeVisible();

        const scrollArea =
          dialog.getByTestId(
            "database-table-scroll",
          );

        await expect(
          scrollArea,
        ).toBeVisible({
          timeout: 30_000,
        });

        const measurements =
          await scrollArea.evaluate(
            (element) => ({
              clientWidth:
                element.clientWidth,
              scrollWidth:
                element.scrollWidth,
              overflowX:
                getComputedStyle(
                  element,
                ).overflowX,
            }),
          );

        expect(
          [
            "auto",
            "scroll",
          ],
        ).toContain(
          measurements.overflowX,
        );

        expect(
          measurements.scrollWidth,
        ).toBeGreaterThanOrEqual(
          measurements.clientWidth,
        );

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "table toolbar, paging, refresh and CRUD controls remain usable",
      async ({ page }) => {
        const dialog =
          await openDatabaseManager(
            page,
          );

        const tablePanel =
          dialog.getByTestId(
            "database-table-panel",
          );

        await expect(
          tablePanel,
        ).toBeVisible({
          timeout: 30_000,
        });

        await expect(
          tablePanel.getByRole(
            "button",
            {
              name: "Add Row",
            },
          ),
        ).toBeVisible({
          timeout: 30_000,
        });

        await expect(
          tablePanel.getByRole(
            "button",
            {
              name: "Refresh",
            },
          ),
        ).toBeVisible();

        await expect(
          tablePanel.getByRole(
            "button",
            {
              name:
                "Previous page",
            },
          ),
        ).toBeVisible();

        await expect(
          tablePanel.getByRole(
            "button",
            {
              name:
                "Next page",
            },
          ),
        ).toBeVisible();

        await expect(
          tablePanel.getByRole(
            "button",
            {
              name: "Edit",
            },
          ).first(),
        ).toBeVisible();

        await expect(
          tablePanel.getByRole(
            "button",
            {
              name: "Delete",
            },
          ).first(),
        ).toBeVisible();

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "add row editor is usable on the current viewport",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        await manager
          .getByRole(
            "button",
            {
              name: "Add Row",
            },
          )
          .click();

        const editor =
          page.getByRole(
            "dialog",
            {
              name: /Add Row/i,
            },
          );

        await expect(
          editor,
        ).toBeVisible();

        await expect(
          editor.getByRole(
            "button",
            {
              name:
                /Close row editor/i,
            },
          ),
        ).toBeVisible();

        await expectVisibleControlsUsable(
          editor,
          page,
        );

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "edit row editor is usable on the current viewport",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        const tablePanel =
          manager.getByTestId(
            "database-table-panel",
          );

        await expect(
          tablePanel,
        ).toBeVisible({
          timeout: 30_000,
        });

        const editButton =
          tablePanel.getByRole(
            "button",
            {
              name: "Edit",
            },
          ).first();

        await expect(
          editButton,
        ).toBeVisible({
          timeout: 30_000,
        });

        await editButton.click();

        const editor =
          page.getByRole(
            "dialog",
            {
              name: /Edit Row/i,
            },
          );

        await expect(
          editor,
        ).toBeVisible();

        await expectVisibleControlsUsable(
          editor,
          page,
        );

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "import dialog opens without viewport overflow",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        await manager
          .getByRole(
            "button",
            {
              name:
                "Import Excel or CSV",
            },
          )
          .click();

        const dialogs =
          page.getByRole("dialog");

        const importDialog =
          dialogs.filter({
            hasText:
              /Import/i,
          }).last();

        await expect(
          importDialog,
        ).toBeVisible();

        await expectVisibleControlsUsable(
          importDialog,
          page,
        );

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "open in editor remains reachable and returns to the SQL workbench",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        const openButton =
          manager.getByRole(
            "button",
            {
              name:
                "Open in Editor",
            },
          ).first();

        await expect(
          openButton,
        ).toBeVisible();

        await openButton.click();

        await expect(
          page.getByRole(
            "dialog",
            {
              name:
                /Database Manager/i,
            },
          ),
        ).toBeHidden();

        await expectNoBodyOverflow(
          page,
        );
      },
    );
  },
);
