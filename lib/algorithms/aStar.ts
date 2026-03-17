import { Cell } from "../grid";
import { AlgorithmResult } from "./types";

function heuristic(r: number, c: number, endRow: number, endCol: number): number {
  return Math.abs(r - endRow) + Math.abs(c - endCol);
}

export function aStar(
  grid: Cell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): AlgorithmResult {
  const size = grid.length;
  const gScore = Array.from({ length: size }, () => new Array(size).fill(Infinity));
  const parent = new Map<string, [number, number] | null>();
  const explored: [number, number][] = [];
  const closed = Array.from({ length: size }, () => new Array(size).fill(false));
  const key = (r: number, c: number) => `${r},${c}`;

  gScore[startRow][startCol] = 0;
  parent.set(key(startRow, startCol), null);

  const queue: [number, number, number][] = [
    [heuristic(startRow, startCol, endRow, endCol), startRow, startCol],
  ];

  while (queue.length > 0) {
    queue.sort((a, b) => a[0] - b[0]);
    const [, r, c] = queue.shift()!;

    if (closed[r][c]) continue;
    closed[r][c] = true;
    explored.push([r, c]);

    if (r === endRow && c === endCol) break;

    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
      if (grid[nr][nc].state === "wall") continue;
      if (closed[nr][nc]) continue;
      const ng = gScore[r][c] + 1;
      if (ng < gScore[nr][nc]) {
        gScore[nr][nc] = ng;
        parent.set(key(nr, nc), [r, c]);
        queue.push([ng + heuristic(nr, nc, endRow, endCol), nr, nc]);
      }
    }
  }

  if (!closed[endRow][endCol]) return { explored, path: [] };

  const path: [number, number][] = [];
  let current: [number, number] | null = [endRow, endCol];
  while (current !== null) {
    path.unshift(current);
    const p = parent.get(key(current[0], current[1]));
    if (p === undefined) break;
    current = p;
  }
  return { explored, path };
}
