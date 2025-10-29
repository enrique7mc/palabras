import { test, expect } from "@playwright/test";

test.describe("Game Modes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Close tutorial modal if it appears
    const tutorialModal = page.locator("#tutorial-modal");
    const skipButton = page.locator("#skip-tutorial-btn");

    // Wait for modal to potentially appear, then close it
    try {
      await skipButton.waitFor({ state: "visible", timeout: 2000 });
      await skipButton.click();
      await tutorialModal.waitFor({ state: "hidden", timeout: 2000 });
    } catch {
      // Modal didn't appear, continue
    }
  });

  test("daily mode is active by default", async ({ page }) => {
    const dailyBtn = page.locator("#daily-mode-btn");
    await expect(dailyBtn).toHaveClass(/active/);

    const subtitle = page.locator("#subtitle");
    await expect(subtitle).toContainText("palabra del día");

    // Show answer button should be hidden in daily mode
    const showAnswerBtn = page.locator("#show-answer-btn");
    await expect(showAnswerBtn).toHaveClass(/hidden/);
  });

  test("switching to practice mode updates UI", async ({ page }) => {
    await page.click("#practice-mode-btn");

    const practiceBtn = page.locator("#practice-mode-btn");
    await expect(practiceBtn).toHaveClass(/active/);

    const subtitle = page.locator("#subtitle");
    await expect(subtitle).toContainText(/Práctica/);

    // New game button should be visible in practice mode
    const newGameBtn = page.locator("#new-game-btn");
    await expect(newGameBtn).not.toHaveClass(/hidden/);

    // Show answer button should be visible in practice mode
    const showAnswerBtn = page.locator("#show-answer-btn");
    await expect(showAnswerBtn).not.toHaveClass(/hidden/);
  });

  test("switching back to daily mode from practice", async ({ page }) => {
    // Go to practice mode first
    await page.click("#practice-mode-btn");
    await expect(page.locator("#practice-mode-btn")).toHaveClass(/active/);

    // Switch back to daily
    await page.click("#daily-mode-btn");

    const dailyBtn = page.locator("#daily-mode-btn");
    await expect(dailyBtn).toHaveClass(/active/);

    // Show answer button should be hidden again
    const showAnswerBtn = page.locator("#show-answer-btn");
    await expect(showAnswerBtn).toHaveClass(/hidden/);
  });

  test("show answer button works in practice mode", async ({ page }) => {
    await page.click("#practice-mode-btn");

    const showAnswerBtn = page.locator("#show-answer-btn");
    await showAnswerBtn.click();

    // Message should show the answer
    const message = page.locator("#message");
    await expect(message).toContainText(/respuesta es:/i);

    // Button text should change
    await expect(showAnswerBtn).toContainText(/Ocultar/);

    // Click again to hide
    await showAnswerBtn.click();
    await expect(message).not.toContainText(/respuesta es:/i);
    await expect(showAnswerBtn).toContainText(/Ver Respuesta/);
  });

  test("new game button resets board in practice mode", async ({ page }) => {
    await page.click("#practice-mode-btn");

    // Type a word
    await page.click('[data-key="M"]');
    await page.click('[data-key="U"]');
    await page.click('[data-key="N"]');

    // Click new game
    await page.click("#new-game-btn");

    // Board should be cleared
    const firstTile = page.locator("#tile-0-0");
    await expect(firstTile).toHaveText("");
  });

  test("game resets when switching modes", async ({ page }) => {
    // Make a guess in daily mode
    await page.click('[data-key="M"]');
    await page.click('[data-key="U"]');
    await page.click('[data-key="N"]');

    // Switch to practice mode
    await page.click("#practice-mode-btn");

    // Board should be cleared
    const firstTile = page.locator("#tile-0-0");
    await expect(firstTile).toHaveText("");
  });
});
