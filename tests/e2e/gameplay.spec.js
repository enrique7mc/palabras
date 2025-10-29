import { test, expect } from "@playwright/test";

test.describe("Gameplay", () => {
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

  test("user can type letters using on-screen keyboard", async ({ page }) => {
    // Click on practice mode
    await page.click("#practice-mode-btn");

    // Type a word using on-screen keyboard
    const letters = ["M", "U", "N", "D", "O"];
    for (const letter of letters) {
      await page.click(`[data-key="${letter}"]`);
    }

    // Verify tiles are filled
    for (let i = 0; i < 5; i++) {
      const tile = page.locator(`#tile-0-${i}`);
      await expect(tile).toHaveClass(/filled/);
      await expect(tile).toHaveText(letters[i]);
    }
  });

  test("user can delete letters with backspace", async ({ page }) => {
    await page.click("#practice-mode-btn");

    // Type some letters
    await page.click('[data-key="M"]');
    await page.click('[data-key="U"]');

    // Delete one
    await page.click('[data-key="⌫"]');

    // First tile should still be filled, second should be empty
    await expect(page.locator("#tile-0-0")).toHaveText("M");
    await expect(page.locator("#tile-0-1")).toHaveText("");
  });

  test("submitting incomplete word shows error", async ({ page }) => {
    await page.click("#practice-mode-btn");

    // Type only 3 letters
    await page.click('[data-key="M"]');
    await page.click('[data-key="U"]');
    await page.click('[data-key="N"]');

    // Try to submit
    await page.click('[data-key="ENTER"]');

    // Should show error message
    const message = page.locator("#message");
    await expect(message).toHaveClass(/error/);
    await expect(message).toContainText(/suficientes letras/i);
  });

  test("submitting valid word shows color feedback", async ({ page }) => {
    await page.click("#practice-mode-btn");

    // Type a valid word
    const letters = ["M", "U", "N", "D", "O"];
    for (const letter of letters) {
      await page.click(`[data-key="${letter}"]`);
    }

    await page.click('[data-key="ENTER"]');

    // Wait for animation
    await page.waitForTimeout(2000);

    // Tiles should have color classes
    const firstTile = page.locator("#tile-0-0");
    const tileClass = await firstTile.getAttribute("class");
    expect(
      tileClass.includes("correct") ||
        tileClass.includes("present") ||
        tileClass.includes("absent"),
    ).toBeTruthy();
  });

  test("keyboard keys update colors after submission", async ({ page }) => {
    await page.click("#practice-mode-btn");

    // Type and submit a word
    const letters = ["M", "U", "N", "D", "O"];
    for (const letter of letters) {
      await page.click(`[data-key="${letter}"]`);
    }

    await page.click('[data-key="ENTER"]');

    // Wait for animation
    await page.waitForTimeout(2000);

    // At least one key should have a color class
    const keyM = page.locator('[data-key="M"]');
    const keyClass = await keyM.getAttribute("class");
    expect(
      keyClass.includes("correct") ||
        keyClass.includes("present") ||
        keyClass.includes("absent"),
    ).toBeTruthy();
  });

  test("user can play multiple guesses", async ({ page }) => {
    await page.click("#practice-mode-btn");

    // First guess
    const word1 = ["M", "U", "N", "D", "O"];
    for (const letter of word1) {
      await page.click(`[data-key="${letter}"]`);
    }
    await page.click('[data-key="ENTER"]');
    await page.waitForTimeout(2000);

    // Second guess
    const word2 = ["P", "E", "R", "R", "O"];
    for (const letter of word2) {
      await page.click(`[data-key="${letter}"]`);
    }
    await page.click('[data-key="ENTER"]');
    await page.waitForTimeout(2000);

    // Verify both rows are filled
    await expect(page.locator("#tile-0-0")).not.toHaveText("");
    await expect(page.locator("#tile-1-0")).not.toHaveText("");
  });
});
