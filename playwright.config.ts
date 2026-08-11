import {
  defineConfig,
} from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",

  timeout: 60_000,

  expect: {
    timeout: 15_000,
  },

  fullyParallel: false,
  workers: 1,

  reporter: [
    ["line"],
  ],

  outputDir:
    "/tmp/sqltrain-playwright-results",

  use: {
    baseURL:
      "http://127.0.0.1:3001",

    headless: true,

    viewport: {
      width: 1366,
      height: 768,
    },

    trace: "off",
    screenshot: "off",
    video: "off",
  },

  webServer: {
    command:
      "npm run dev -- --hostname 127.0.0.1 --port 3001",

    url:
      "http://127.0.0.1:3001",

    reuseExistingServer: true,

    timeout: 120_000,
  },
});
