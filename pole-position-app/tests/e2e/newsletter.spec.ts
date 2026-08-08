import { expect, test } from "@playwright/test";
import { mockApi } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test("rejects an invalid email without submitting", async ({ page }) => {
  await page.goto("/");

  const form = page.locator("#newsletter form");
  await expect(form).toBeVisible();

  await form.locator("#newsletter-email").fill("not-an-email");
  await form.getByRole("button", { name: "Subscribe" }).click();

  await expect(form.getByText("Enter a valid email address")).toBeVisible();
});

test("shows a success state after subscribing", async ({ page }) => {
  await page.goto("/");

  const form = page.locator("#newsletter form");
  await expect(form).toBeVisible();

  await form.locator("#newsletter-email").fill("fan@example.com");
  await form.getByRole("button", { name: "Subscribe" }).click();

  await expect(page.getByText("You're on the grid")).toBeVisible();
});

test("requires at least one reminder window", async ({ page }) => {
  await page.goto("/");

  const form = page.locator("#newsletter form");
  await expect(form).toBeVisible();

  await form.getByRole("button", { name: "24 hours before" }).click();
  await form.getByRole("button", { name: "1 hour before" }).click();

  await form.locator("#newsletter-email").fill("fan@example.com");
  await form.getByRole("button", { name: "Subscribe" }).click();

  await expect(form.getByText(/Pick at least one reminder window/i)).toBeVisible();
});
