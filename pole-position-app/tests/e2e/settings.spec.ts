import { expect, test } from "@playwright/test";
import { mockApi } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test("settings drawer persists timezone and theme in localStorage", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open settings" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Settings")).toBeVisible();

  await dialog.locator("select").selectOption("Europe/London");
  await dialog.getByRole("button", { name: "light" }).click();
  await page.keyboard.press("Escape");

  const prefs = await page.evaluate(() =>
    localStorage.getItem("pole-position-prefs")
  );
  expect(prefs).not.toBeNull();
  expect(prefs).toContain("Europe/London");
  expect(prefs).toContain('"theme":"light"');
});

test("preferences survive a reload", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open settings" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.locator("select").selectOption("Asia/Tokyo");
  await page.keyboard.press("Escape");

  await page.reload();

  await page.getByRole("button", { name: "Open settings" }).click();
  await expect(page.getByRole("dialog").locator("select")).toHaveValue(
    "Asia/Tokyo"
  );
});
