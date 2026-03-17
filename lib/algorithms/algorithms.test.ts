import { describe, it, expect } from "bun:test";
import { createGrid, setCell } from "../grid";
import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";
import { aStar } from "./aStar";
import { greedyBestFirst } from "./greedyBestFirst";
import { bidirectionalBfs } from "./bidirectionalBfs";

describe("bfs", () => {
  it("finds a path on an open grid", () => {
    const grid = createGrid(5);
    const result = bfs(grid, 0, 0, 4, 4);
    expect(result.path.length).toBeGreaterThan(0);
  });

  it("returns empty path when blocked", () => {
    let grid = createGrid(5);
    for (let r = 0; r < 5; r++) grid = setCell(grid, r, 2, "wall");
    const result = bfs(grid, 0, 0, 0, 4);
    expect(result.path).toEqual([]);
  });

  it("finds the shortest path", () => {
    const grid = createGrid(5);
    const result = bfs(grid, 0, 0, 0, 4);
    // Shortest path along row 0: 5 cells
    expect(result.path.length).toBe(5);
  });
});

describe("dfs", () => {
  it("finds a path on an open grid", () => {
    const grid = createGrid(5);
    const result = dfs(grid, 0, 0, 4, 4);
    expect(result.path.length).toBeGreaterThan(0);
  });

  it("returns empty path when blocked", () => {
    let grid = createGrid(5);
    for (let r = 0; r < 5; r++) grid = setCell(grid, r, 2, "wall");
    const result = dfs(grid, 0, 0, 0, 4);
    expect(result.path).toEqual([]);
  });
});

describe("dijkstra", () => {
  it("finds a path on an open grid", () => {
    const grid = createGrid(5);
    const result = dijkstra(grid, 0, 0, 4, 4);
    expect(result.path.length).toBeGreaterThan(0);
  });

  it("finds the shortest path", () => {
    const grid = createGrid(5);
    const result = dijkstra(grid, 0, 0, 0, 4);
    expect(result.path.length).toBe(5);
  });
});

describe("aStar", () => {
  it("finds a path on an open grid", () => {
    const grid = createGrid(5);
    const result = aStar(grid, 0, 0, 4, 4);
    expect(result.path.length).toBeGreaterThan(0);
  });

  it("finds the shortest path", () => {
    const grid = createGrid(5);
    const result = aStar(grid, 0, 0, 0, 4);
    expect(result.path.length).toBe(5);
  });
});

describe("greedyBestFirst", () => {
  it("finds a path on an open grid", () => {
    const grid = createGrid(5);
    const result = greedyBestFirst(grid, 0, 0, 4, 4);
    expect(result.path.length).toBeGreaterThan(0);
  });
});

describe("bidirectionalBfs", () => {
  it("finds a path on an open grid", () => {
    const grid = createGrid(5);
    const result = bidirectionalBfs(grid, 0, 0, 4, 4);
    expect(result.path.length).toBeGreaterThan(0);
  });

  it("returns empty path when blocked", () => {
    let grid = createGrid(5);
    for (let r = 0; r < 5; r++) grid = setCell(grid, r, 2, "wall");
    const result = bidirectionalBfs(grid, 0, 0, 0, 4);
    expect(result.path).toEqual([]);
  });
});
