export type Stats = {
  exploredCount: number;
  pathLength: number;
  durationMs: number;
};

export function computeStats(
  exploredCount: number,
  pathLength: number,
  startTime: number,
  endTime: number
): Stats {
  return {
    exploredCount,
    pathLength,
    durationMs: Math.max(0, endTime - startTime),
  };
}
