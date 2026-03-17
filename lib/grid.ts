export type CellState = "empty" | "wall" | "start" | "end" | "explored" | "path";

export type Cell = {
  row: number;
  col: number;
  state: CellState;
};

export function createGrid(size: number): Cell[][] {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => ({ row, col, state: "empty" as CellState }))
  );
}

export function setCell(grid: Cell[][], row: number, col: number, state: CellState): Cell[][] {
  return grid.map((r, ri) =>
    r.map((cell, ci) => (ri === row && ci === col ? { ...cell, state } : cell))
  );
}

export function getCell(grid: Cell[][], row: number, col: number): Cell {
  return grid[row][col];
}

export function reset(grid: Cell[][]): Cell[][] {
  return grid.map((r) => r.map((cell) => ({ ...cell, state: "empty" as CellState })));
}

export function resetColors(grid: Cell[][]): Cell[][] {
  return grid.map((r) =>
    r.map((cell) =>
      cell.state === "explored" || cell.state === "path"
        ? { ...cell, state: "empty" as CellState }
        : cell
    )
  );
}
