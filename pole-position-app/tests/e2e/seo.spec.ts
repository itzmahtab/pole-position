import { expect, test } from "@playwright/test";

test("serves a robots.txt that points at the sitemap", async ({ page }) => {
  const response = await page.request.get("/robots.txt");
  expect(response.ok()).toBeTruthy();

  const body = await response.text();
  expect(body).toContain("User-Agent: *");
  expect(body).toContain("Sitemap:");
  expect(body).toContain("/sitemap.xml");
  expect(body).toContain("Disallow: /api/");
});

test("serves a sitemap.xml with the homepage", async ({ page }) => {
  const response = await page.request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();

  const body = await response.text();
  expect(body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  expect(body).toContain("<loc>");
});

test("embeds WebSite JSON-LD structured data", async ({ page }) => {
  await page.goto("/");

  const jsonLd = page.locator('script[type="application/ld+json"]');
  await expect(jsonLd).toHaveCount(1);

  const content = await jsonLd.textContent();
  const parsed = JSON.parse(content ?? "");
  expect(parsed["@type"]).toBe("WebSite");
  expect(parsed.name).toBe("Pole Position");
  expect(parsed["@context"]).toBe("https://schema.org");
});

test("renders an opengraph image endpoint", async ({ page }) => {
  const response = await page.request.get("/opengraph-image");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("image/png");
});
