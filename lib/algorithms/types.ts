import { Cell } from "../grid";

export type AlgorithmResult = {
  explored: [number, number][];
  path: [number, number][];
};

export type Algorithm = (
  grid: Cell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
) => AlgorithmResult;
