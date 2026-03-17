import { describe, it, expect } from "bun:test";
import { handleCellClick } from "./interaction";
import { createGrid } from "./grid";

describe("handleCellClick - set-points mode", () => {
  it("first click sets start", () => {
    const grid = createGrid(5);
    const next = handleCellClick(grid, 1, 2, "set-points");
    expect(next[1][2].state).toBe("start");
  });

  it("third click when both start and end exist does nothing", () => {
    const grid = createGrid(5);
    const withStart = handleCellClick(grid, 0, 0, "set-points");
    const withEnd = handleCellClick(withStart, 4, 4, "set-points");
    const after = handleCellClick(withEnd, 2, 2, "set-points");
    expect(after[2][2].state).toBe("empty");
  });

  it("second click on different cell sets end", () => {
    const grid = createGrid(5);
    const withStart = handleCellClick(grid, 1, 2, "set-points");
    const withEnd = handleCellClick(withStart, 3, 4, "set-points");
    expect(withEnd[1][2].state).toBe("start");
    expect(withEnd[3][4].state).toBe("end");
  });
});

describe("handleCellClick - draw-walls mode", () => {
  it("click on empty cell sets wall", () => {
    const grid = createGrid(5);
    const next = handleCellClick(grid, 2, 3, "draw-walls");
    expect(next[2][3].state).toBe("wall");
  });

  it("click on start cell does not overwrite it", () => {
    const grid = createGrid(5);
    const withStart = handleCellClick(grid, 0, 0, "set-points");
    const after = handleCellClick(withStart, 0, 0, "draw-walls");
    expect(after[0][0].state).toBe("start");
  });

  it("click on end cell does not overwrite it", () => {
    const grid = createGrid(5);
    const withStart = handleCellClick(grid, 0, 0, "set-points");
    const withEnd = handleCellClick(withStart, 4, 4, "set-points");
    const after = handleCellClick(withEnd, 4, 4, "draw-walls");
    expect(after[4][4].state).toBe("end");
  });
});
