import { Cell } from "../grid";
import { AlgorithmResult } from "./types";

export function bfs(
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
  const queue: [number, number][] = [[startRow, startCol]];
  const key = (r: number, c: number) => `${r},${c}`;

  visited[startRow][startCol] = true;
  parent.set(key(startRow, startCol), null);

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    explored.push([r, c]);

    if (r === endRow && c === endCol) {
      return { explored, path: reconstructPath(parent, startRow, startCol, endRow, endCol) };
    }

    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
      if (visited[nr][nc]) continue;
      if (grid[nr][nc].state === "wall") continue;
      visited[nr][nc] = true;
      parent.set(key(nr, nc), [r, c]);
      queue.push([nr, nc]);
    }
  }

  return { explored, path: [] };
}

function reconstructPath(
  parent: Map<string, [number, number] | null>,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): [number, number][] {
  const path: [number, number][] = [];
  let current: [number, number] | null = [endRow, endCol];
  const key = (r: number, c: number) => `${r},${c}`;

  while (current !== null) {
    path.unshift(current);
    const p = parent.get(key(current[0], current[1]));
    if (p === undefined) break;
    current = p;
  }

  if (path[0]?.[0] !== startRow || path[0]?.[1] !== startCol) return [];
  return path;
}
