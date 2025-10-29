import { describe, it, expect, beforeEach } from "vitest";

describe("Modal Behavior", () => {
  beforeEach(() => {
    // Setup DOM with modals
    document.body.innerHTML = `
      <div id="stats-modal" class="modal hidden">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>Estadísticas</h2>
        </div>
      </div>
      <div id="help-modal" class="modal hidden">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>Cómo jugar</h2>
        </div>
      </div>
      <div id="tutorial-modal" class="modal hidden">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>Tutorial</h2>
        </div>
      </div>
    `;
  });

  it("modals have 'hidden' class by default", () => {
    const statsModal = document.getElementById("stats-modal");
    const helpModal = document.getElementById("help-modal");
    const tutorialModal = document.getElementById("tutorial-modal");

    expect(statsModal.className).toContain("hidden");
    expect(helpModal.className).toContain("hidden");
    expect(tutorialModal.className).toContain("hidden");
  });

  it("modals have 'modal' class", () => {
    const statsModal = document.getElementById("stats-modal");
    const helpModal = document.getElementById("help-modal");
    const tutorialModal = document.getElementById("tutorial-modal");

    expect(statsModal.className).toContain("modal");
    expect(helpModal.className).toContain("modal");
    expect(tutorialModal.className).toContain("modal");
  });

  it("can show modal by removing hidden class", () => {
    const modal = document.getElementById("stats-modal");

    expect(modal.className).toContain("hidden");

    modal.classList.remove("hidden");

    expect(modal.className).not.toContain("hidden");
    expect(modal.className).toBe("modal");
  });

  it("can hide modal by adding hidden class", () => {
    const modal = document.getElementById("stats-modal");

    // First show the modal
    modal.classList.remove("hidden");
    expect(modal.className).not.toContain("hidden");

    // Then hide it
    modal.classList.add("hidden");

    expect(modal.className).toContain("hidden");
  });

  it("all modals have close button", () => {
    const statsModal = document.getElementById("stats-modal");
    const helpModal = document.getElementById("help-modal");
    const tutorialModal = document.getElementById("tutorial-modal");

    const statsClose = statsModal.querySelector(".close");
    const helpClose = helpModal.querySelector(".close");
    const tutorialClose = tutorialModal.querySelector(".close");

    expect(statsClose).toBeTruthy();
    expect(helpClose).toBeTruthy();
    expect(tutorialClose).toBeTruthy();

    // In the test DOM with happy-dom, &times; remains as the entity string
    expect(statsClose.textContent).toBe("&times;");
    expect(helpClose.textContent).toBe("&times;");
    expect(tutorialClose.textContent).toBe("&times;");
  });

  it("all modals have modal-content container", () => {
    const statsModal = document.getElementById("stats-modal");
    const helpModal = document.getElementById("help-modal");
    const tutorialModal = document.getElementById("tutorial-modal");

    const statsContent = statsModal.querySelector(".modal-content");
    const helpContent = helpModal.querySelector(".modal-content");
    const tutorialContent = tutorialModal.querySelector(".modal-content");

    expect(statsContent).toBeTruthy();
    expect(helpContent).toBeTruthy();
    expect(tutorialContent).toBeTruthy();
  });

  it("modals contain proper headings", () => {
    const statsModal = document.getElementById("stats-modal");
    const helpModal = document.getElementById("help-modal");
    const tutorialModal = document.getElementById("tutorial-modal");

    const statsHeading = statsModal.querySelector("h2");
    const helpHeading = helpModal.querySelector("h2");
    const tutorialHeading = tutorialModal.querySelector("h2");

    expect(statsHeading.textContent).toBe("Estadísticas");
    expect(helpHeading.textContent).toBe("Cómo jugar");
    expect(tutorialHeading.textContent).toBe("Tutorial");
  });
});
