import { expect, test } from "@playwright/test";

test("has account info", async ({ page }) => {
  await page.goto("/login");
  await page.locator("#name").fill("@john@example.com");
  await page.locator("#password").fill("じゃすた・いぐざんぽぅ");
  await page.locator("#password + [type='submit']").click();
  await page.waitForURL("/");

  await page.goto("/accounts/@johndoe@example.com");
  const accountDataQuery = "body > div > div > div:nth-child(2) > div";
  expect(page.locator(`${accountDataQuery} > h1`)).toHaveText("test user 101");
  expect(page.locator(`${accountDataQuery} > h1 > span`)).toHaveText(
    "@john@example.com"
  );
  expect(page.locator(`${accountDataQuery} > p:nth-child(3)`)).toHaveText(
    "this is test user"
  );

  await page.goto("/logout");
  await page.locator("form > button[type='submit']").click();
});
