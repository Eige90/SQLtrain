import {
  defineConfig,
  devices,
} from "@playwright/test";

const baseUse = {
  baseURL:
    "http://127.0.0.1:3001",

  headless: true,

  trace: "off" as const,
  screenshot: "off" as const,
  video: "off" as const,
};

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

  projects: [
    {
      name:
        "functional-chromium",

      testIgnore:
        /responsive\.spec\.ts/,

      use: {
        ...baseUse,

        browserName:
          "chromium",

        viewport: {
          width: 1366,
          height: 768,
        },
      },
    },

    {
      name:
        "responsive-chromium",

      testMatch:
        /responsive\.spec\.ts/,

      use: {
        ...baseUse,

        ...devices[
          "Desktop Chrome"
        ],

        viewport: {
          width: 1366,
          height: 768,
        },
      },
    },

    {
      name:
        "responsive-firefox",

      testMatch:
        /responsive\.spec\.ts/,

      use: {
        ...baseUse,

        ...devices[
          "Desktop Firefox"
        ],

        viewport: {
          width: 1366,
          height: 768,
        },
      },
    },

    {
      name:
        "responsive-webkit",

      testMatch:
        /responsive\.spec\.ts/,

      use: {
        ...baseUse,

        ...devices[
          "Desktop Safari"
        ],

        viewport: {
          width: 1366,
          height: 768,
        },
      },
    },

    {
      name:
        "android-chrome",

      testMatch:
        /responsive\.spec\.ts/,

      use: {
        ...baseUse,

        ...devices[
          "Pixel 5"
        ],
      },
    },

    {
      name:
        "android-firefox-size",

      testMatch:
        /responsive\.spec\.ts/,

      use: {
        ...baseUse,

        browserName:
          "firefox",

        viewport: {
          width: 393,
          height: 851,
        },
      },
    },

    {
      name:
        "iphone-safari",

      testMatch:
        /responsive\.spec\.ts/,

      use: {
        ...baseUse,

        ...devices[
          "iPhone 13"
        ],
      },
    },

    {
      name:
        "small-mobile-320",

      testMatch:
        /responsive\.spec\.ts/,

      use: {
        ...baseUse,

        browserName:
          "chromium",

        viewport: {
          width: 320,
          height: 700,
        },
      },
    },

    {
      name:
        "large-mobile-430",

      testMatch:
        /responsive\.spec\.ts/,

      use: {
        ...baseUse,

        browserName:
          "chromium",

        viewport: {
          width: 430,
          height: 932,
        },
      },
    },

    {
      name:
        "tablet-webkit",

      testMatch:
        /responsive\.spec\.ts/,

      use: {
        ...baseUse,

        browserName:
          "webkit",

        viewport: {
          width: 768,
          height: 1024,
        },
      },
    },

    {
      name:
        "wide-desktop",

      testMatch:
        /responsive\.spec\.ts/,

      use: {
        ...baseUse,

        browserName:
          "chromium",

        viewport: {
          width: 1920,
          height: 1080,
        },
      },
    },
  ],

  webServer: {
    command:
      "npm run dev -- --hostname 127.0.0.1 --port 3001",

    url:
      "http://127.0.0.1:3001",

    reuseExistingServer: true,

    timeout: 120_000,
  },
});
