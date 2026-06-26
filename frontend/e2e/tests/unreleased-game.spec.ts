import { test, expect } from "@playwright/test";

test.describe("Unreleased game display", () => {
  test("shows no player chart and em dash for current players, but follower chart visible", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "SteamInsights" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Unreleased Game" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Unreleased Game" }).click();

    await page.waitForURL("**/games/654321");
    await expect(
      page.getByRole("heading", { name: "Unreleased Game" })
    ).toBeVisible();

    await expect(page.getByText("Current players")).toBeVisible();
    await expect(page.getByText("—")).toBeVisible();

    await expect(
      page.getByText("Player Count History")
    ).not.toBeVisible();
    await expect(
      page.locator("text=No historical data yet.")
    ).not.toBeVisible();

    await expect(
      page.getByText("Follower Count History")
    ).toBeVisible();
    await expect(
      page.locator(".recharts-wrapper")
    ).toBeAttached();
  });
});
