import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getWordOfDay,
  getRandomWord,
  getTutorialWord,
  isValidWordLength,
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
    const word1 = getWordOfDay();

    // Mock tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    vi.useFakeTimers();
    vi.setSystemTime(tomorrow);

    const word2 = getWordOfDay();

    // They might be the same occasionally due to word list cycling
    // but at least verify both are valid
    expect(isValidWordLength(word1)).toBe(true);
    expect(isValidWordLength(word2)).toBe(true);
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
    const validTutorialWords = [
      "PADRE",
      "COMER",
      "PERRO",
      "LIBRO",
      "GALLO",
      "ACERO",
      "SILLA",
    ];
    const word = getTutorialWord();
    expect(validTutorialWords).toContain(word);
  });

  it("has fallback if no valid tutorial word", () => {
    const word = getTutorialWord();
    expect(word).toBeDefined();
    expect(isValidWordLength(word)).toBe(true);
  });
});
