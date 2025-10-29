import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { showMessage } from "../../script.js";

describe("Message Display", () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="message" class="message"></div>
    `;

    // Use fake timers to control setTimeout
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays message with default 'show' type", () => {
    const message = document.getElementById("message");

    showMessage("Test message");

    expect(message.textContent).toBe("Test message");
    expect(message.className).toBe("message show");
  });

  it("displays message with 'success' type", () => {
    const message = document.getElementById("message");

    showMessage("Success!", "success");

    expect(message.textContent).toBe("Success!");
    expect(message.className).toBe("message success");
  });

  it("displays message with 'error' type", () => {
    const message = document.getElementById("message");

    showMessage("Error occurred", "error");

    expect(message.textContent).toBe("Error occurred");
    expect(message.className).toBe("message error");
  });

  it("clears message after timeout", () => {
    const message = document.getElementById("message");

    showMessage("Temporary message");

    expect(message.textContent).toBe("Temporary message");
    expect(message.className).toBe("message show");

    // Fast-forward time by 2 seconds
    vi.advanceTimersByTime(2000);

    expect(message.textContent).toBe("");
    expect(message.className).toBe("message");
  });

  it("updates message content on subsequent calls", () => {
    const message = document.getElementById("message");

    showMessage("First message", "show");
    expect(message.textContent).toBe("First message");

    showMessage("Second message", "error");
    expect(message.textContent).toBe("Second message");
    expect(message.className).toBe("message error");
  });

  it("message element exists in DOM", () => {
    const message = document.getElementById("message");
    expect(message).toBeTruthy();
    expect(message.id).toBe("message");
  });

  it("handles empty message text", () => {
    const message = document.getElementById("message");

    showMessage("");

    expect(message.textContent).toBe("");
    expect(message.className).toBe("message show");
  });

  it("preserves message for 2 seconds before clearing", () => {
    const message = document.getElementById("message");

    showMessage("Wait for it...");

    // Before timeout
    vi.advanceTimersByTime(1999);
    expect(message.textContent).toBe("Wait for it...");

    // After timeout
    vi.advanceTimersByTime(1);
    expect(message.textContent).toBe("");
  });
});
