import { describe, it, expect, beforeEach } from "vitest";
import { createBoard } from "../../script.js";

describe("Game Board", () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="game-board"></div>
    `;
  });

  it("creates 6 rows", () => {
    createBoard();
    const rows = document.querySelectorAll(".row");
    expect(rows).toHaveLength(6);
  });

  it("creates 5 tiles per row", () => {
    createBoard();
    const rows = document.querySelectorAll(".row");

    rows.forEach((row) => {
      const tiles = row.querySelectorAll(".tile");
      expect(tiles).toHaveLength(5);
    });
  });

  it("creates tiles with correct IDs", () => {
    createBoard();

    // Check first tile
    const firstTile = document.getElementById("tile-0-0");
    expect(firstTile).toBeTruthy();
    expect(firstTile.className).toBe("tile");

    // Check last tile
    const lastTile = document.getElementById("tile-5-4");
    expect(lastTile).toBeTruthy();
    expect(lastTile.className).toBe("tile");

    // Check middle tile
    const middleTile = document.getElementById("tile-3-2");
    expect(middleTile).toBeTruthy();
  });

  it("creates exactly 30 tiles total (6 rows × 5 tiles)", () => {
    createBoard();
    const allTiles = document.querySelectorAll(".tile");
    expect(allTiles).toHaveLength(30);
  });

  it("tiles are initially empty", () => {
    createBoard();
    const allTiles = document.querySelectorAll(".tile");

    allTiles.forEach((tile) => {
      expect(tile.textContent).toBe("");
    });
  });

  it("appends board to game-board element", () => {
    const board = document.getElementById("game-board");
    expect(board.children).toHaveLength(0);

    createBoard();

    expect(board.children).toHaveLength(6);
    expect(board.children[0].className).toBe("row");
  });
});
