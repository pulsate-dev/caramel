import { expect, test } from "@playwright/test";

test("has account info", async ({ page }) => {
  await page.goto("/login");
  await page.locator("#email").fill("john@example.com");
  await page.locator("#password").fill("じゃすた・いぐざんぽぅ");
  await page.locator("#password + [type='submit']").click();
  await page.waitForURL("/");

  await page.goto("/accounts/@johndoe@example.com");
  // Development nicknames include a generated Snowflake ID, not a fixed ID.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /^test user \d+ @johndoe@example\.com$/
  );
  await expect(
    page.getByText("@johndoe@example.com", { exact: true })
  ).toBeVisible();
  await expect(page.getByText("this is test user")).toBeVisible();

  await page.goto("/logout");
  await page.locator("form button[type='submit']").click();
});
