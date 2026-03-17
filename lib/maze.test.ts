import { describe, it, expect } from "bun:test";
import { isReachable, generateMaze } from "./maze";
import { createGrid, setCell } from "./grid";

describe("generateMaze", () => {
  it("preserves start and end cells", () => {
    let grid = createGrid(10);
    grid = setCell(grid, 0, 0, "start");
    grid = setCell(grid, 9, 9, "end");
    const maze = generateMaze(grid, 0.5);
    expect(maze[0][0].state).toBe("start");
    expect(maze[9][9].state).toBe("end");
  });

  it("always generates a solvable maze (start reachable to end)", () => {
    let grid = createGrid(15);
    grid = setCell(grid, 0, 0, "start");
    grid = setCell(grid, 14, 14, "end");
    for (let i = 0; i < 5; i++) {
      const maze = generateMaze(grid, 0.8);
      expect(isReachable(maze, 0, 0, 14, 14)).toBe(true);
    }
  });

  it("higher difficulty produces more walls than lower difficulty", () => {
    const base = createGrid(20);
    const countWalls = (g: ReturnType<typeof createGrid>) =>
      g.flat().filter((c) => c.state === "wall").length;

    const easyMaze = generateMaze(base, 0.0);
    const hardMaze = generateMaze(base, 1.0);
    expect(countWalls(hardMaze)).toBeGreaterThan(countWalls(easyMaze));
  });
});

describe("isReachable", () => {
  it("returns true when path exists between two cells", () => {
    const grid = createGrid(5);
    expect(isReachable(grid, 0, 0, 4, 4)).toBe(true);
  });

  it("returns false when path is fully blocked by walls", () => {
    let grid = createGrid(5);
    // Build a wall across the entire column 2
    for (let r = 0; r < 5; r++) {
      grid = setCell(grid, r, 2, "wall");
    }
    expect(isReachable(grid, 0, 0, 0, 4)).toBe(false);
  });
});
