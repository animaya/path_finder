import { Cell } from "../grid";
import { AlgorithmResult } from "./types";

export function dijkstra(
  grid: Cell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): AlgorithmResult {
  const size = grid.length;
  const dist = Array.from({ length: size }, () => new Array(size).fill(Infinity));
  const parent = new Map<string, [number, number] | null>();
  const explored: [number, number][] = [];
  const key = (r: number, c: number) => `${r},${c}`;

  dist[startRow][startCol] = 0;
  parent.set(key(startRow, startCol), null);

  // Min-heap via sorted array (sufficient for grid sizes up to 50x50)
  const queue: [number, number, number][] = [[0, startRow, startCol]];

  while (queue.length > 0) {
    queue.sort((a, b) => a[0] - b[0]);
    const [d, r, c] = queue.shift()!;

    if (d > dist[r][c]) continue;
    explored.push([r, c]);

    if (r === endRow && c === endCol) break;

    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
      if (grid[nr][nc].state === "wall") continue;
      const nd = d + 1;
      if (nd < dist[nr][nc]) {
        dist[nr][nc] = nd;
        parent.set(key(nr, nc), [r, c]);
        queue.push([nd, nr, nc]);
      }
    }
  }

  if (dist[endRow][endCol] === Infinity) return { explored, path: [] };

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
