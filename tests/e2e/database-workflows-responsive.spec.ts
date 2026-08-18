import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";

import * as XLSX from "xlsx";


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


async function openDatabaseManager(
  page: Page,
): Promise<Locator> {
  await page.goto("/");

  const button =
    page.getByRole(
      "button",
      {
        name: /Your Database/i,
      },
    );

  await expect(button).toBeVisible({
    timeout: 30_000,
  });

  await button.click();

  const manager =
    page.getByRole(
      "dialog",
      {
        name: /Database Manager/i,
      },
    );

  await expect(manager).toBeVisible();

  return manager;
}


function tableSummary(
  manager: Locator,
  tableName: string,
): Locator {
  return manager.locator(
    `[data-testid="database-table-summary"][data-table-name="${tableName}"]`,
  );
}


async function openImport(
  manager: Locator,
): Promise<Locator> {
  const importButton =
    manager.getByRole(
      "button",
      {
        name: "Import Excel or CSV",
      },
    );

  /*
   * On the tablet layout the import card can sit far below the
   * table/data content inside the Database Manager's own scroll
   * container. WebKit is more sensitive to an automatic
   * click+scroll happening in one action.
   *
   * Bring the real button into view first, verify that it is
   * actually usable, and only then perform the normal click.
   */
  await importButton.scrollIntoViewIfNeeded();

  await expect(
    importButton,
  ).toBeVisible({
    timeout: 30_000,
  });

  await expect(
    importButton,
  ).toBeEnabled();

  await importButton.click({
    timeout: 30_000,
  });

  const dialog =
    manager.page().getByRole(
      "dialog",
      {
        name: "Import Excel or CSV",
      },
    );

  await expect(
    dialog,
  ).toBeVisible({
    timeout: 30_000,
  });

  return dialog;
}


async function importCsv({
  page,
  manager,
  tableName,
  fileName,
  csv,
  mode = "create",
  encoding = "utf8",
}: {
  page: Page;
  manager: Locator;
  tableName: string;
  fileName: string;
  csv: string;
  mode?: "create" | "append" | "replace";
  encoding?: "utf8" | "latin1";
}): Promise<void> {
  const dialog =
    await openImport(manager);

  await dialog
    .locator('input[type="file"]')
    .setInputFiles({
      name: fileName,
      mimeType: "text/csv",
      buffer: Buffer.from(
        csv,
        encoding,
      ),
    });

  await expect(
    dialog.getByText(
      fileName,
      {
        exact: true,
      },
    ),
  ).toBeVisible({
    timeout: 30_000,
  });

  const modeSelect =
    dialog.getByLabel(
      "Import mode",
    );

  await modeSelect.selectOption(
    mode,
  );

  if (mode === "create") {
    await dialog
      .getByLabel(
        "New table name",
      )
      .fill(tableName);
  } else {
    await dialog
      .getByLabel(
        "Existing table",
      )
      .selectOption(
        tableName,
      );
  }

  const importButton =
    dialog.getByRole(
      "button",
      {
        name: /^Import [0-9,]+ Rows$/,
      },
    );

  await expect(importButton).toBeEnabled();

  if (mode === "replace") {
    page.once(
      "dialog",
      async (confirmation) => {
        await confirmation.accept();
      },
    );
  }

  await importButton.click();

  await expect(dialog).toBeHidden({
    timeout: 30_000,
  });

  await expect(
    tableSummary(
      manager,
      tableName,
    ),
  ).toBeVisible({
    timeout: 30_000,
  });
}


function createTestExcelBuffer(
  bookType: "xlsx" | "biff8",
): Buffer {
  const workbook =
    XLSX.utils.book_new();

  const peopleSheet =
    XLSX.utils.aoa_to_sheet([
      [
        "PersonId",
        "Name",
        "City",
        "JoinedOn",
      ],
      [
        1,
        "Alpha GmbH",
        "Munich",
        "2026-08-13",
      ],
      [
        2,
        "Beta AG",
        "Berlin",
        "2026-08-14",
      ],
    ]);

  const metricsSheet =
    XLSX.utils.aoa_to_sheet([
      [
        "MetricId",
        "MetricName",
        "Amount",
      ],
      [
        10,
        "Revenue",
        1234.5,
      ],
      [
        11,
        "Sessions",
        42,
      ],
    ]);

  XLSX.utils.book_append_sheet(
    workbook,
    peopleSheet,
    "People",
  );

  XLSX.utils.book_append_sheet(
    workbook,
    metricsSheet,
    "Metrics",
  );

  const bytes =
    XLSX.write(
      workbook,
      {
        type: "array",
        bookType,
      },
    );

  return Buffer.from(
    bytes as ArrayBuffer,
  );
}


async function importExcelWorkbook({
  manager,
  tableName,
  extension,
  bookType,
  mimeType,
  worksheet,
  expectedColumns,
  expectedRows,
}: {
  manager: Locator;
  tableName: string;
  extension: "xlsx" | "xls";
  bookType: "xlsx" | "biff8";
  mimeType: string;
  worksheet: "People" | "Metrics";
  expectedColumns: number;
  expectedRows: number;
}): Promise<void> {
  const dialog =
    await openImport(
      manager,
    );

  const fileName =
    `user-owned-test.${extension}`;

  const fileInput =
    dialog.locator(
      'input[type="file"]',
    );

  await fileInput.setInputFiles({
    name: fileName,
    mimeType,
    buffer:
      createTestExcelBuffer(
        bookType,
      ),
  });

  await expect(
    dialog.getByText(
      fileName,
      {
        exact: true,
      },
    ),
  ).toBeVisible({
    timeout: 30_000,
  });

  const worksheetSelect =
    dialog.getByLabel(
      "Worksheet",
    );

  await expect(
    worksheetSelect,
  ).toBeVisible();

  await expect(
    worksheetSelect.locator(
      'option[value="People"]',
    ),
  ).toHaveCount(1);

  await expect(
    worksheetSelect.locator(
      'option[value="Metrics"]',
    ),
  ).toHaveCount(1);

  await worksheetSelect.selectOption(
    worksheet,
  );

  await expect(
    dialog.getByText(
      new RegExp(
        `${expectedColumns} columns and ${expectedRows} rows`,
      ),
    ),
  ).toBeVisible({
    timeout: 30_000,
  });

  await dialog
    .getByLabel(
      "Import mode",
    )
    .selectOption(
      "create",
    );

  await dialog
    .getByLabel(
      "New table name",
    )
    .fill(
      tableName,
    );

  const importButton =
    dialog.getByRole(
      "button",
      {
        name:
          new RegExp(
            `^Import ${expectedRows} Rows$`,
          ),
      },
    );

  await expect(
    importButton,
  ).toBeEnabled();

  await importButton.click();

  await expect(
    dialog,
  ).toBeHidden({
    timeout: 30_000,
  });

  await expect(
    tableSummary(
      manager,
      tableName,
    ),
  ).toBeVisible({
    timeout: 30_000,
  });

  await expect(
    tableSummary(
      manager,
      tableName,
    ),
  ).toContainText(
    `${expectedRows} records`,
  );
}


test.describe(
  "SQLTrain database workflows",
  () => {
    test(
      "Create Table hands a responsive SQL template to the workbench",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        await manager
          .getByRole(
            "button",
            {
              name: "Create Table",
            },
          )
          .click();

        await expect(
          manager,
        ).toBeHidden();

        const editor =
          page.locator(
            ".monaco-editor",
          ).first();

        await expect(editor).toBeVisible();

        await expect(
          editor.locator(
            ".view-lines",
          ),
        ).toContainText(
          "CREATE TABLE NewTable",
        );

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "CSV create, append and replace work without breaking responsive layout",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        const tableName =
          "ResponsiveImport";

        await importCsv({
          page,
          manager,
          tableName,
          fileName:
            "responsive-create.csv",
          csv:
            "Id,Name,Score\n1,Alpha,10\n2,Beta,20\n",
        });

        await expect(
          tableSummary(
            manager,
            tableName,
          ),
        ).toContainText(
          "2 records",
        );

        await importCsv({
          page,
          manager,
          tableName,
          fileName:
            "responsive-append.csv",
          csv:
            "Id,Name,Score\n3,Gamma,30\n",
          mode: "append",
        });

        await expect(
          tableSummary(
            manager,
            tableName,
          ),
        ).toContainText(
          "3 records",
        );

        await importCsv({
          page,
          manager,
          tableName,
          fileName:
            "responsive-replace.csv",
          csv:
            "Id,Name,Score\n9,Replacement,99\n",
          mode: "replace",
        });

        await expect(
          tableSummary(
            manager,
            tableName,
          ),
        ).toContainText(
          "1 records",
        );

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "user CSV upload handles quoted commas, unicode and empty values",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        const tableName =
          "UserCsvImport";

        await importCsv({
          page,
          manager,
          tableName,
          fileName:
            "my-own-data.csv",
          csv: `Id,Company,City,Note
1,"Müller, GmbH",München,"contains, comma"
2,Ångström,Göteborg,
3,"O'Brien",Zürich,"Unicode test"
`,
        });

        await expect(
          tableSummary(
            manager,
            tableName,
          ),
        ).toContainText(
          "3 records",
        );

        const panel =
          manager.getByTestId(
            "database-table-panel",
          );

        await expect(
          panel.getByText(
            "Müller, GmbH",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "München",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Ångström",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Göteborg",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "O'Brien",
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
      "user CSV upload accepts German Excel semicolon CSV with UTF-8 BOM",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        const tableName =
          "GermanExcelCsv";

        await importCsv({
          page,
          manager,
          tableName,
          fileName:
            "german-excel-export.csv",
          csv:
            "\uFEFFId;Company;City;Amount\r\n"
            + "1;Müller GmbH;München;12.5\r\n"
            + "2;Größe AG;Köln;42\r\n"
            + "3;Bäckerei König;Düsseldorf;7.25\r\n",
        });

        await expect(
          tableSummary(
            manager,
            tableName,
          ),
        ).toContainText(
          "3 records",
        );

        const panel =
          manager.getByTestId(
            "database-table-panel",
          );

        await expect(
          panel.getByText(
            "Müller GmbH",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "München",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Größe AG",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Köln",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Bäckerei König",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Düsseldorf",
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
      "user CSV upload accepts legacy Windows-1252 CSV",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        const tableName =
          "LegacyWindowsCsv";

        await importCsv({
          page,
          manager,
          tableName,
          fileName:
            "old-windows-export.csv",
          encoding:
            "latin1",
          csv:
            "Id;Name;City\r\n"
            + "1;Müller;München\r\n"
            + "2;Größe;Köln\r\n"
            + "3;Jürgen;Nürnberg\r\n",
        });

        await expect(
          tableSummary(
            manager,
            tableName,
          ),
        ).toContainText(
          "3 records",
        );

        const panel =
          manager.getByTestId(
            "database-table-panel",
          );

        await expect(
          panel.getByText(
            "Müller",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "München",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Größe",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Köln",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Jürgen",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Nürnberg",
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
      "user XLSX workbook can select a worksheet and import its data",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        const tableName =
          "UserXlsxImport";

        await importExcelWorkbook({
          manager,
          tableName,
          extension:
            "xlsx",
          bookType:
            "xlsx",
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          worksheet:
            "Metrics",
          expectedColumns:
            3,
          expectedRows:
            2,
        });

        const panel =
          manager.getByTestId(
            "database-table-panel",
          );

        await expect(
          panel.getByText(
            "Revenue",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "1234.5",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Sessions",
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
      "legacy XLS workbook can be imported like a user file",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        const tableName =
          "UserLegacyXlsImport";

        await importExcelWorkbook({
          manager,
          tableName,
          extension:
            "xls",
          bookType:
            "biff8",
          mimeType:
            "application/vnd.ms-excel",
          worksheet:
            "People",
          expectedColumns:
            4,
          expectedRows:
            2,
        });

        const panel =
          manager.getByTestId(
            "database-table-panel",
          );

        await expect(
          panel.getByText(
            "Alpha GmbH",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Munich",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "Beta AG",
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
      "Add, edit and delete a row and then delete the custom table",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        const tableName =
          "ResponsiveCrud";

        await importCsv({
          page,
          manager,
          tableName,
          fileName:
            "responsive-crud.csv",
          csv:
            "Id,Name,Score\n1,Alpha,10\n2,Beta,20\n",
        });

        const panel =
          manager.getByTestId(
            "database-table-panel",
          );

        await expect(panel).toBeVisible();

        await panel
          .getByRole(
            "button",
            {
              name: "Add Row",
            },
          )
          .click();

        const addEditor =
          page.getByRole(
            "dialog",
            {
              name: "Add Row",
            },
          );

        await expect(
          addEditor,
        ).toBeVisible();

        await addEditor
          .getByLabel(
            "Id",
            {
              exact: true,
            },
          )
          .fill("3");

        await addEditor
          .getByLabel(
            "Name",
            {
              exact: true,
            },
          )
          .fill("Gamma");

        await addEditor
          .getByLabel(
            "Score",
            {
              exact: true,
            },
          )
          .fill("30");

        await addEditor
          .getByRole(
            "button",
            {
              name: "Add Row",
            },
          )
          .click();

        await expect(
          addEditor,
        ).toBeHidden({
          timeout: 30_000,
        });

        const gammaRow =
          panel
            .locator("tbody tr")
            .filter({
              hasText: "Gamma",
            });

        await expect(
          gammaRow,
        ).toBeVisible();

        await gammaRow
          .getByRole(
            "button",
            {
              name: "Edit",
            },
          )
          .click();

        const editEditor =
          page.getByRole(
            "dialog",
            {
              name: "Edit Row",
            },
          );

        await expect(
          editEditor,
        ).toBeVisible();

        await editEditor
          .getByLabel(
            "Name",
            {
              exact: true,
            },
          )
          .fill(
            "Gamma Edited",
          );

        await editEditor
          .getByRole(
            "button",
            {
              name:
                "Save Changes",
            },
          )
          .click();

        await expect(
          editEditor,
        ).toBeHidden({
          timeout: 30_000,
        });

        const editedRow =
          panel
            .locator("tbody tr")
            .filter({
              hasText:
                "Gamma Edited",
            });

        await expect(
          editedRow,
        ).toBeVisible();

        page.once(
          "dialog",
          async (confirmation) => {
            await confirmation.accept();
          },
        );

        await editedRow
          .getByRole(
            "button",
            {
              name: "Delete",
            },
          )
          .click();

        await expect(
          editedRow,
        ).toHaveCount(0, {
          timeout: 30_000,
        });

        page.once(
          "dialog",
          async (confirmation) => {
            await confirmation.accept();
          },
        );

        await manager
          .getByRole(
            "button",
            {
              name:
                `Delete table ${tableName}`,
            },
          )
          .click();

        await expect(
          tableSummary(
            manager,
            tableName,
          ),
        ).toHaveCount(0, {
          timeout: 30_000,
        });

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "relationship validation and creation remain usable",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        const parentTable =
          "RelationshipParents";

        const childTable =
          "RelationshipChildren";

        await importCsv({
          page,
          manager,
          tableName: parentTable,
          fileName:
            "relationship-parents.csv",
          csv:
            `ParentId,ParentName
1,Alpha
2,Beta
3,Gamma
`,
        });

        await importCsv({
          page,
          manager,
          tableName: childTable,
          fileName:
            "relationship-children.csv",
          csv:
            `ChildId,ParentId,Description
10,1,First
11,2,Second
12,3,Third
`,
        });

        const panel =
          manager.getByTestId(
            "database-relationships-panel",
          );

        await expect(
          panel,
        ).toBeVisible();

        const parent =
          panel.getByRole(
            "group",
            {
              name: "Parent table",
            },
          );

        const child =
          panel.getByRole(
            "group",
            {
              name: "Child table",
            },
          );

        const parentTableSelect =
          parent.getByLabel(
            "Table",
          );

        await parentTableSelect.selectOption(
          parentTable,
        );

        const parentColumnSelect =
          parent.getByLabel(
            "Unique key column",
          );

        await expect(
          parentColumnSelect.locator(
            'option[value="ParentId"]',
          ),
        ).toHaveCount(
          1,
          {
            timeout: 30_000,
          },
        );

        await parentColumnSelect.selectOption(
          "ParentId",
        );

        const childTableSelect =
          child.getByLabel(
            "Table",
          );

        await childTableSelect.selectOption(
          childTable,
        );

        const childColumnSelect =
          child.getByLabel(
            "Foreign key column",
          );

        await expect(
          childColumnSelect.locator(
            'option[value="ParentId"]',
          ),
        ).toHaveCount(
          1,
          {
            timeout: 30_000,
          },
        );

        await childColumnSelect.selectOption(
          "ParentId",
        );

        const validateButton =
          panel.getByRole(
            "button",
            {
              name:
                "Validate Relationship",
            },
          );

        await expect(
          validateButton,
        ).toBeEnabled();

        await validateButton.click();

        await expect(
          panel.getByText(
            "The relationship is valid and can be created.",
            {
              exact: true,
            },
          ),
        ).toBeVisible({
          timeout: 30_000,
        });

        await expect(
          panel.getByText(
            "Missing parent rows",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          panel.getByText(
            "0",
            {
              exact: true,
            },
          ).last(),
        ).toBeVisible();

        const createButton =
          panel.getByRole(
            "button",
            {
              name:
                "Create Relationship",
            },
          );

        await expect(
          createButton,
        ).toBeEnabled();

        await createButton.click();

        await expect(
          panel.getByText(
            new RegExp(
              `Relationship created: ${childTable}\\.ParentId → ${parentTable}\\.ParentId`,
            ),
          ),
        ).toBeVisible({
          timeout: 30_000,
        });

        const existingRelationship =
          panel.getByText(
            `${childTable}.ParentId`,
            {
              exact: true,
            },
          );

        await expect(
          existingRelationship,
        ).toBeVisible({
          timeout: 30_000,
        });

        await expect(
          panel.getByText(
            `references ${parentTable}.ParentId`,
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        const refreshButton =
          panel.getByRole(
            "button",
            {
              name: "Refresh",
            },
          );

        await refreshButton.click();

        await expect(
          existingRelationship,
        ).toBeVisible();

        await expectNoBodyOverflow(
          page,
        );
      },
    );


    test(
      "long table and column names stay inside the database viewport",
      async ({ page }) => {
        const manager =
          await openDatabaseManager(
            page,
          );

        const tableName =
          "VeryLongResponsiveDatabaseTableNameForTesting";

        await importCsv({
          page,
          manager,
          tableName,
          fileName:
            "very-long-responsive.csv",
          csv:
            "ExtremelyLongIdentifierColumnNameThatMustScroll,AnotherExtremelyLongColumnNameForTesting\nA very long value that should remain inside the scroll container,Second value\n",
        });

        const panel =
          manager.getByTestId(
            "database-table-panel",
          );

        const scrollArea =
          panel.getByTestId(
            "database-table-scroll",
          );

        await expect(
          scrollArea,
        ).toBeVisible();

        const sizes =
          await scrollArea.evaluate(
            (element) => ({
              clientWidth:
                element.clientWidth,
              scrollWidth:
                element.scrollWidth,
            }),
          );

        expect(
          sizes.scrollWidth,
        ).toBeGreaterThanOrEqual(
          sizes.clientWidth,
        );

        await expectNoBodyOverflow(
          page,
        );
      },
    );
  },
);
