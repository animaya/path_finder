"use client";

import { Cell, CellState } from "@/lib/grid";

const CELL_COLORS: Record<CellState, string> = {
  empty: "#1e1e2e",
  wall: "#2d2d3d",
  start: "#22c55e",
  end: "#ef4444",
  explored: "#38bdf8",
  path: "#facc15",
};

const CELL_GRADIENTS: Record<CellState, string> = {
  empty: "radial-gradient(circle at 35% 35%, #1a1a22, #0d0d14)",
  wall: "radial-gradient(circle at 35% 35%, #4a4a52, #2e2e36)",
  start: "radial-gradient(circle at 30% 28%, #bbf7d0 0%, #22c55e 35%, #15803d 100%)",
  end: "radial-gradient(circle at 30% 28%, #fecaca 0%, #ef4444 35%, #b91c1c 100%)",
  explored: "radial-gradient(circle at 30% 28%, #e0f2fe 0%, #38bdf8 35%, #0369a1 100%)",
  path: "radial-gradient(circle at 30% 28%, #fef9c3 0%, #facc15 35%, #a16207 100%)",
};

function CandyCell({
  cell,
  size,
  onMouseDown,
  onMouseEnter,
}: {
  cell: Cell;
  size: number;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
}) {
  return (
    <div
      onMouseDown={() => onMouseDown(cell.row, cell.col)}
      onMouseEnter={() => onMouseEnter(cell.row, cell.col)}
      style={{
        width: size,
        height: size,
        background: CELL_GRADIENTS[cell.state],
        borderRadius: "4px",
        boxShadow:
          cell.state === "empty"
            ? "inset 0 1px 2px rgba(255,255,255,0.04), inset 0 -1px 2px rgba(0,0,0,0.5)"
            : cell.state === "wall"
            ? "inset 0 1px 3px rgba(255,255,255,0.12), inset 0 -2px 4px rgba(0,0,0,0.6)"
            : `inset 0 2px 0px rgba(255,255,255,1), inset 1px 0px 0px rgba(255,255,255,0.8), inset -1px 0px 0px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.45), 0 0 10px ${CELL_COLORS[cell.state]}aa`,
        cursor: "pointer",
        transition: "background 0.15s ease, box-shadow 0.15s ease",
        flexShrink: 0,
      }}
    />
  );
}

export default function Grid({
  grid,
  cellSize,
  onMouseDown,
  onMouseEnter,
}: {
  grid: Cell[][];
  cellSize: number;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        padding: "8px",
        background: "#0d0d18",
        borderRadius: "12px",
        border: "1px solid #2a2a3a",
        userSelect: "none",
      }}
    >
      {grid.map((row) => (
        <div key={row[0].row} style={{ display: "flex", gap: "1px" }}>
          {row.map((cell) => (
            <CandyCell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              size={cellSize}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
