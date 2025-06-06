import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: "http://localhost:5173",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    port: 5173,
  },
});
