import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { mockApi } from "./fixtures";

test("homepage has no automatic accessibility violations", async ({ page }) => {
  await mockApi(page);
  await page.goto("/");

  await expect(page.locator("h1").first()).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
