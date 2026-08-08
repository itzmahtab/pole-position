import { expect, test } from "@playwright/test";
import { mockApi } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test("page loads and renders the hero with the upcoming race", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Pole Position/);
  await expect(
    page.getByRole("heading", { level: 1, name: /British Grand Prix/i })
  ).toBeVisible();
});

test("core sections are present", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#weekend-timeline")).toBeVisible();
  await expect(page.locator("#calendar")).toBeVisible();
  await expect(page.locator("#circuit-explorer")).toBeVisible();
  await expect(page.locator("#championship")).toBeVisible();
  await expect(page.locator("#newsletter")).toBeVisible();
});

test("search trigger is accessible", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("button", { name: /search drivers, circuits, races/i })
  ).toBeVisible();
});
