import { describe, it, expect } from "bun:test";
import { createGrid, setCell, getCell, reset, resetColors } from "./grid";

describe("createGrid", () => {
  it("creates a grid of the given size with all cells empty", () => {
    const grid = createGrid(20);
    expect(grid.length).toBe(20);
    expect(grid[0].length).toBe(20);
    expect(grid[0][0]).toEqual({ row: 0, col: 0, state: "empty" });
    expect(grid[19][19]).toEqual({ row: 19, col: 19, state: "empty" });
  });
});

describe("setCell", () => {
  it("returns a new grid with the target cell updated", () => {
    const grid = createGrid(10);
    const updated = setCell(grid, 3, 5, "wall");
    expect(updated[3][5].state).toBe("wall");
    expect(grid[3][5].state).toBe("empty"); // original unchanged
  });
});

describe("getCell", () => {
  it("returns the cell at the given coordinates", () => {
    const grid = createGrid(10);
    const cell = getCell(grid, 2, 7);
    expect(cell).toEqual({ row: 2, col: 7, state: "empty" });
  });
});

describe("reset", () => {
  it("sets all cells to empty including walls, start, end", () => {
    let grid = createGrid(5);
    grid = setCell(grid, 0, 0, "start");
    grid = setCell(grid, 4, 4, "end");
    grid = setCell(grid, 2, 2, "wall");
    const cleared = reset(grid);
    expect(cleared[0][0].state).toBe("empty");
    expect(cleared[4][4].state).toBe("empty");
    expect(cleared[2][2].state).toBe("empty");
  });
});

describe("resetColors", () => {
  it("clears explored and path cells but keeps wall, start, end", () => {
    let grid = createGrid(5);
    grid = setCell(grid, 0, 0, "start");
    grid = setCell(grid, 4, 4, "end");
    grid = setCell(grid, 1, 1, "wall");
    grid = setCell(grid, 2, 2, "explored");
    grid = setCell(grid, 3, 3, "path");
    const cleared = resetColors(grid);
    expect(cleared[0][0].state).toBe("start");
    expect(cleared[4][4].state).toBe("end");
    expect(cleared[1][1].state).toBe("wall");
    expect(cleared[2][2].state).toBe("empty");
    expect(cleared[3][3].state).toBe("empty");
  });
});
