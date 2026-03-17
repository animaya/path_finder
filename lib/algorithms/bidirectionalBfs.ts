import { Cell } from "../grid";
import { AlgorithmResult } from "./types";

export function bidirectionalBfs(
  grid: Cell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): AlgorithmResult {
  const size = grid.length;
  const key = (r: number, c: number) => `${r},${c}`;
  const explored: [number, number][] = [];

  const frontParent = new Map<string, [number, number] | null>();
  const backParent = new Map<string, [number, number] | null>();
  const frontVisited = Array.from({ length: size }, () => new Array(size).fill(false));
  const backVisited = Array.from({ length: size }, () => new Array(size).fill(false));

  frontParent.set(key(startRow, startCol), null);
  backParent.set(key(endRow, endCol), null);
  frontVisited[startRow][startCol] = true;
  backVisited[endRow][endCol] = true;

  let frontQueue: [number, number][] = [[startRow, startCol]];
  let backQueue: [number, number][] = [[endRow, endCol]];
  let meetRow = -1;
  let meetCol = -1;

  while (frontQueue.length > 0 && backQueue.length > 0) {
    // Expand front
    const nextFront: [number, number][] = [];
    for (const [r, c] of frontQueue) {
      explored.push([r, c]);
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
        if (grid[nr][nc].state === "wall") continue;
        if (frontVisited[nr][nc]) continue;
        frontVisited[nr][nc] = true;
        frontParent.set(key(nr, nc), [r, c]);
        nextFront.push([nr, nc]);
        if (backVisited[nr][nc]) { meetRow = nr; meetCol = nc; break; }
      }
      if (meetRow !== -1) break;
    }
    if (meetRow !== -1) break;
    frontQueue = nextFront;

    // Expand back
    const nextBack: [number, number][] = [];
    for (const [r, c] of backQueue) {
      explored.push([r, c]);
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
        if (grid[nr][nc].state === "wall") continue;
        if (backVisited[nr][nc]) continue;
        backVisited[nr][nc] = true;
        backParent.set(key(nr, nc), [r, c]);
        nextBack.push([nr, nc]);
        if (frontVisited[nr][nc]) { meetRow = nr; meetCol = nc; break; }
      }
      if (meetRow !== -1) break;
    }
    if (meetRow !== -1) break;
    backQueue = nextBack;
  }

  if (meetRow === -1) return { explored, path: [] };

  // Reconstruct path: front half + back half
  const frontPath: [number, number][] = [];
  let cur: [number, number] | null = [meetRow, meetCol];
  while (cur !== null) {
    frontPath.unshift(cur);
    const p = frontParent.get(key(cur[0], cur[1]));
    if (p === undefined) break;
    cur = p;
  }

  const backPath: [number, number][] = [];
  cur = backParent.get(key(meetRow, meetCol)) ?? null;
  while (cur !== null) {
    backPath.push(cur);
    const p = backParent.get(key(cur[0], cur[1]));
    if (p === undefined) break;
    cur = p;
  }

  return { explored, path: [...frontPath, ...backPath] };
}
