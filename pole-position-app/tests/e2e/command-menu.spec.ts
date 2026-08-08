import { expect, test } from "@playwright/test";
import { mockApi } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test("command palette opens, searches and closes", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /search drivers, circuits, races/i }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await dialog.getByPlaceholder(/search drivers/i).fill("silverstone");

  await expect(
    dialog.getByRole("option", { name: /^Silverstone Circuit/i })
  ).toBeVisible();
  await expect(
    dialog.getByRole("option", { name: /^British Grand Prix/i })
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("command palette opens with the keyboard shortcut", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: /search drivers, circuits, races/i })
  ).toBeVisible();

  await page.keyboard.press("Control+K");

  const dialog = page.locator('[data-slot="dialog-content"]');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("combobox")).toBeFocused();
});
