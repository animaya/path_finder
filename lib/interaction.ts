import { Cell, CellState, setCell } from "./grid";

export type InteractionMode = "set-points" | "draw-walls";

function hasState(grid: Cell[][], state: CellState): boolean {
  return grid.some((row) => row.some((cell) => cell.state === state));
}

export function handleCellClick(
  grid: Cell[][],
  row: number,
  col: number,
  mode: InteractionMode
): Cell[][] {
  if (mode === "draw-walls") {
    const current = grid[row][col].state;
    if (current === "start" || current === "end") return grid;
    return setCell(grid, row, col, "wall");
  }

  // set-points mode
  if (!hasState(grid, "start")) {
    return setCell(grid, row, col, "start");
  }

  if (!hasState(grid, "end") && grid[row][col].state !== "start") {
    return setCell(grid, row, col, "end");
  }

  return grid;
}
