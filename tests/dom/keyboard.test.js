import { describe, it, expect, beforeEach } from "vitest";
import { createKeyboard, keys } from "../../script.js";

describe("Keyboard", () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="keyboard"></div>
    `;
  });

  it("creates 3 keyboard rows", () => {
    createKeyboard();
    const rows = document.querySelectorAll(".keyboard-row");
    expect(rows).toHaveLength(3);
  });

  it("includes the Ñ key in Spanish layout", () => {
    createKeyboard();
    const nKey = document.querySelector('[data-key="Ñ"]');

    expect(nKey).toBeTruthy();
    expect(nKey.textContent).toBe("Ñ");
  });

  it("creates all expected keys from layout", () => {
    createKeyboard();

    // Flatten keys array to get all expected keys
    const allKeys = keys.flat();

    allKeys.forEach((key) => {
      const keyElement = document.querySelector(`[data-key="${key}"]`);
      expect(keyElement).toBeTruthy();
      expect(keyElement.textContent).toBe(key);
    });
  });

  it("marks ENTER as wide key", () => {
    createKeyboard();

    const enterKey = document.querySelector('[data-key="ENTER"]');
    expect(enterKey.className).toContain("wide");
  });

  it("backspace is a single character (⌫) so not marked as wide", () => {
    createKeyboard();

    const backspaceKey = document.querySelector('[data-key="⌫"]');
    // ⌫ is a single unicode character, so it doesn't get the 'wide' class
    expect(backspaceKey.className).toBe("key");
    expect(backspaceKey.className).not.toContain("wide");
  });

  it("marks regular keys with 'key' class only", () => {
    createKeyboard();

    const regularKey = document.querySelector('[data-key="A"]');
    expect(regularKey.className).toBe("key");
    expect(regularKey.className).not.toContain("wide");
  });

  it("creates correct number of keys", () => {
    createKeyboard();

    // Count all expected keys
    const expectedKeyCount = keys.flat().length;
    const actualKeys = document.querySelectorAll(".key");

    expect(actualKeys).toHaveLength(expectedKeyCount);
  });

  it("creates first row with correct keys", () => {
    createKeyboard();

    const firstRow = document.querySelectorAll(".keyboard-row")[0];
    const firstRowKeys = firstRow.querySelectorAll(".key");

    expect(firstRowKeys).toHaveLength(10); // Q-P
    expect(firstRowKeys[0].textContent).toBe("Q");
    expect(firstRowKeys[9].textContent).toBe("P");
  });

  it("creates second row with correct keys including Ñ", () => {
    createKeyboard();

    const secondRow = document.querySelectorAll(".keyboard-row")[1];
    const secondRowKeys = secondRow.querySelectorAll(".key");

    expect(secondRowKeys).toHaveLength(10); // A-Ñ
    expect(secondRowKeys[0].textContent).toBe("A");
    expect(secondRowKeys[9].textContent).toBe("Ñ");
  });

  it("creates third row with ENTER, letters, and backspace", () => {
    createKeyboard();

    const thirdRow = document.querySelectorAll(".keyboard-row")[2];
    const thirdRowKeys = thirdRow.querySelectorAll(".key");

    expect(thirdRowKeys).toHaveLength(9); // ENTER + Z-M + ⌫
    expect(thirdRowKeys[0].textContent).toBe("ENTER");
    expect(thirdRowKeys[8].textContent).toBe("⌫");
  });

  it("all keys have data-key attribute", () => {
    createKeyboard();

    const allKeys = document.querySelectorAll(".key");

    allKeys.forEach((key) => {
      expect(key.getAttribute("data-key")).toBeTruthy();
    });
  });
});
