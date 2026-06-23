import { test, expect } from "@playwright/test";

test.describe("Home to game detail flow", () => {
  test("search for a game, navigate to its detail page, verify data", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "SteamInsights" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Test Game" })).toBeVisible();

    const searchInput = page.getByPlaceholder("Search games…");
    await searchInput.click();

    await page.evaluate(() => {
      const input = document.querySelector("input");
      if (!input) return;
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )!.set!;
      setter.call(input, "Test Game");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    await expect(searchInput).toHaveValue("Test Game");
    await expect(
      page.getByRole("heading", { name: "Supported games (1)" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Another Game" })
    ).not.toBeVisible();

    await page.getByRole("link", { name: "Test Game" }).click();

    await page.waitForURL("**/games/123456");
    await expect(
      page.getByRole("heading", { name: "Test Game" })
    ).toBeVisible();

    await expect(page.getByText("Test Publisher")).toBeVisible();
    await expect(page.getByText("$19.99")).toBeVisible();
    await expect(page.getByText("tag1")).toBeVisible();
    await expect(page.getByText("tag2")).toBeVisible();
    await expect(page.getByText("tag3")).toBeVisible();
    await expect(page.getByText("5,000")).toBeVisible();
    await expect(page.getByText("123456")).toBeVisible();
  });
});
