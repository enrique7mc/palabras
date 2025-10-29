import { describe, it, expect } from "vitest";
import { isValidWordLength } from "../../script.js";

describe("isValidWordLength", () => {
  it("returns true for 5-letter words", () => {
    expect(isValidWordLength("MUNDO")).toBe(true);
    expect(isValidWordLength("PERRO")).toBe(true);
    expect(isValidWordLength("GATOS")).toBe(true);
  });

  it("returns false for words shorter than 5 letters", () => {
    expect(isValidWordLength("CASA")).toBe(false);
    expect(isValidWordLength("SOL")).toBe(false);
    expect(isValidWordLength("")).toBe(false);
  });

  it("returns false for words longer than 5 letters", () => {
    expect(isValidWordLength("PERRITO")).toBe(false);
    expect(isValidWordLength("CASITA")).toBe(false);
    expect(isValidWordLength("GUITARRA")).toBe(false);
  });
});
