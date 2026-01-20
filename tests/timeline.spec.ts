import { expect, test } from "@playwright/test";

test("has account info", async ({ page }) => {
  await page.goto("/login");
  await page.locator("#email").fill("testuser101@example.com");
  await page.locator("#password").fill("じゃすた・いぐざんぽぅ");
  await page.locator("#password + [type='submit']").click();
  await page.waitForURL("/");

  await page.goto("/timeline");
  await page.locator("#content").fill("test-post");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("test post")).toBeVisible();

  await page.goto("/logout");
  await page.locator("form button[type='submit']").click();
});
