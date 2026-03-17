import { Cell, CellState, createGrid, setCell } from "./grid";

export function isReachable(
  grid: Cell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): boolean {
  const size = grid.length;
  const visited = Array.from({ length: size }, () => new Array(size).fill(false));
  const queue: [number, number][] = [[startRow, startCol]];
  visited[startRow][startCol] = true;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === endRow && c === endCol) return true;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
      if (visited[nr][nc]) continue;
      if (grid[nr][nc].state === "wall") continue;
      visited[nr][nc] = true;
      queue.push([nr, nc]);
    }
  }
  return false;
}

export function generateMaze(grid: Cell[][], difficulty: number): Cell[][] {
  const size = grid.length;

  // Find existing start/end positions
  let startPos: [number, number] | null = null;
  let endPos: [number, number] | null = null;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c].state === "start") startPos = [r, c];
      if (grid[r][c].state === "end") endPos = [r, c];
    }
  }

  // Start with all walls
  let newGrid: Cell[][] = createGrid(size);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      newGrid = setCell(newGrid, r, c, "wall");
    }
  }

  // Recursive Backtracker — carve passages from top-left
  const visited = Array.from({ length: size }, () => new Array(size).fill(false));

  function carve(r: number, c: number) {
    visited[r][c] = true;
    newGrid = setCell(newGrid, r, c, "empty");

    const dirs = shuffle([[-2, 0], [2, 0], [0, -2], [0, 2]]);
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
      if (visited[nr][nc]) continue;
      // Carve passage between current and neighbor
      newGrid = setCell(newGrid, r + dr / 2, c + dc / 2, "empty");
      carve(nr, nc);
    }
  }

  carve(0, 0);

  // At lower difficulty, knock down extra walls to open up the maze
  // At difficulty=0: remove up to 40% of walls; at difficulty=1: remove none
  const extraOpenings = Math.floor((1 - difficulty) * 0.4 * size * size);
  if (extraOpenings > 0) {
    const wallCells: [number, number][] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (newGrid[r][c].state === "wall") wallCells.push([r, c]);
      }
    }
    const shuffled = shuffle(wallCells);
    let opened = 0;
    for (const [r, c] of shuffled) {
      if (opened >= extraOpenings) break;
      newGrid = setCell(newGrid, r, c, "empty");
      opened++;
    }
  }

  // Restore start/end
  if (startPos) newGrid = setCell(newGrid, startPos[0], startPos[1], "start");
  if (endPos) newGrid = setCell(newGrid, endPos[0], endPos[1], "end");

  return newGrid;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
