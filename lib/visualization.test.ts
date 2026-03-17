import { describe, it, expect } from "bun:test";
import { getAlgorithm, canStart, canPause, canResume, canClear } from "./visualization";
import { createGrid } from "./grid";

describe("getAlgorithm", () => {
  it("returns a function that finds a path for bfs", () => {
    const fn = getAlgorithm("bfs");
    const grid = createGrid(5);
    const result = fn(grid, 0, 0, 4, 4);
    expect(result.path.length).toBeGreaterThan(0);
  });

  it("returns different functions for different algorithm names", () => {
    expect(getAlgorithm("bfs")).not.toBe(getAlgorithm("dfs"));
    expect(getAlgorithm("aStar")).not.toBe(getAlgorithm("dijkstra"));
  });
});

describe("canStart", () => {
  it("returns true for idle and completed", () => {
    expect(canStart("idle")).toBe(true);
    expect(canStart("completed")).toBe(true);
  });

  it("returns false for running and paused", () => {
    expect(canStart("running")).toBe(false);
    expect(canStart("paused")).toBe(false);
  });
});

describe("canPause", () => {
  it("returns true only for running", () => {
    expect(canPause("running")).toBe(true);
    expect(canPause("idle")).toBe(false);
    expect(canPause("paused")).toBe(false);
    expect(canPause("completed")).toBe(false);
  });
});

describe("canResume", () => {
  it("returns true only for paused", () => {
    expect(canResume("paused")).toBe(true);
    expect(canResume("idle")).toBe(false);
    expect(canResume("running")).toBe(false);
    expect(canResume("completed")).toBe(false);
  });
});

describe("canClear", () => {
  it("returns true only for completed", () => {
    expect(canClear("completed")).toBe(true);
    expect(canClear("idle")).toBe(false);
    expect(canClear("running")).toBe(false);
    expect(canClear("paused")).toBe(false);
  });
});
