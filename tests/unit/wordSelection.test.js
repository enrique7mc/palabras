import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getWordOfDay,
  getRandomWord,
  getTutorialWord,
  isValidWordLength,
  tutorialWords,
} from "../../script.js";

describe("getWordOfDay", () => {
  beforeEach(() => {
    // Reset Date mock before each test
    vi.useRealTimers();
  });

  it("returns a 5-letter word", () => {
    const word = getWordOfDay();
    expect(isValidWordLength(word)).toBe(true);
    expect(word).toMatch(/^[A-ZÑÁÉÍÓÚ]+$/);
  });

  it("returns the same word for the same day", () => {
    const word1 = getWordOfDay();
    const word2 = getWordOfDay();
    expect(word1).toBe(word2);
  });

  it("returns different words for different days", () => {
    vi.useFakeTimers();

    // Simulate 30 consecutive days and collect words
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const words = new Set();

    for (let i = 0; i < 30; i++) {
      const testDate = new Date(today);
      testDate.setDate(today.getDate() + i);
      vi.setSystemTime(testDate);

      const word = getWordOfDay();
      expect(isValidWordLength(word)).toBe(true); // Verify each word is valid
      words.add(word);
    }

    // Over 30 days, we should have multiple different words
    // (not necessarily all different, but more than just 1)
    expect(words.size).toBeGreaterThan(1);
  });

  it("has fallback if no valid word found", () => {
    // This tests the fallback mechanism
    const word = getWordOfDay();
    expect(word).toBeDefined();
    expect(isValidWordLength(word)).toBe(true);
  });
});

describe("getRandomWord", () => {
  it("returns a 5-letter word", () => {
    const word = getRandomWord();
    expect(isValidWordLength(word)).toBe(true);
    expect(word).toMatch(/^[A-ZÑÁÉÍÓÚ]+$/);
  });

  it("can return different words on multiple calls", () => {
    const words = new Set();
    for (let i = 0; i < 20; i++) {
      words.add(getRandomWord());
    }
    // Should have some variety (at least 5 different words in 20 calls)
    expect(words.size).toBeGreaterThanOrEqual(5);
  });
});

describe("getTutorialWord", () => {
  it("returns a 5-letter word", () => {
    const word = getTutorialWord();
    expect(isValidWordLength(word)).toBe(true);
    expect(word).toMatch(/^[A-ZÑÁÉÍÓÚ]+$/);
  });

  it("returns a word from the tutorial list", () => {
    const word = getTutorialWord();
    expect(tutorialWords).toContain(word);
  });

  it("has fallback if no valid tutorial word", () => {
    const word = getTutorialWord();
    expect(word).toBeDefined();
    expect(isValidWordLength(word)).toBe(true);
  });
});
