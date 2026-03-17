import { describe, it, expect } from "bun:test";
import { computeStats } from "./stats";

describe("computeStats", () => {
  it("returns correct exploredCount and pathLength", () => {
    const stats = computeStats(42, 15, 1000, 1250);
    expect(stats.exploredCount).toBe(42);
    expect(stats.pathLength).toBe(15);
  });

  it("returns correct durationMs", () => {
    const stats = computeStats(10, 5, 1000, 1350);
    expect(stats.durationMs).toBe(350);
  });

  it("durationMs is never negative", () => {
    const stats = computeStats(0, 0, 1000, 999);
    expect(stats.durationMs).toBe(0);
  });
});
