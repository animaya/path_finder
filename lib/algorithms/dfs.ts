import { Cell } from "../grid";
import { AlgorithmResult } from "./types";

export function dfs(
  grid: Cell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): AlgorithmResult {
  const size = grid.length;
  const visited = Array.from({ length: size }, () => new Array(size).fill(false));
  const parent = new Map<string, [number, number] | null>();
  const explored: [number, number][] = [];
  const key = (r: number, c: number) => `${r},${c}`;

  parent.set(key(startRow, startCol), null);

  function dfsRecurse(r: number, c: number): boolean {
    visited[r][c] = true;
    explored.push([r, c]);

    if (r === endRow && c === endCol) return true;

    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
      if (visited[nr][nc]) continue;
      if (grid[nr][nc].state === "wall") continue;
      parent.set(key(nr, nc), [r, c]);
      if (dfsRecurse(nr, nc)) return true;
    }
    return false;
  }

  const found = dfsRecurse(startRow, startCol);
  if (!found) return { explored, path: [] };

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
