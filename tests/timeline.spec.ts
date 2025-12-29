import { expect, test } from "@playwright/test";

test("has latest timeline info", async ({ page }) => {
  // 1. login
  await page.goto("/login");
  await page.locator("#email").fill("testuser101@example.com");
  await page.locator("#password").fill("じゃすた・いぐざんぽぅ");
  await page.locator("#password + [type='submit']").click();
  await page.waitForURL("/");

  // 2. open the timeline page
  await page.goto("/timeline");

  // 3. post a new note
  const rand = Math.random().toFixed(3);
  const content = `テスト投稿: ${rand}`;
  await page.locator("#content").fill(content);
  await page.locator("#visibility").selectOption("PUBLIC");
  await page.locator("#visibility + [type='submit']").click();

  // 4. test expectation about showing the latest note I just posted
  await page.reload();
  await expect(page.getByText(content)).toBeVisible();

  // 5. logout
  await page.goto("/logout");
  await page.locator("form button[type='submit']").click();
});
