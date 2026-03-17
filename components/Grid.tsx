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
  empty: "radial-gradient(circle at 35% 35%, #2a2a3e, #141420)",
  wall: "radial-gradient(circle at 35% 35%, #3d3d52, #1a1a2a)",
  start: "radial-gradient(circle at 35% 35%, #4ade80, #15803d)",
  end: "radial-gradient(circle at 35% 35%, #f87171, #b91c1c)",
  explored: "radial-gradient(circle at 35% 35%, #7dd3fc, #0369a1)",
  path: "radial-gradient(circle at 35% 35%, #fde047, #a16207)",
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
          cell.state === "empty" || cell.state === "wall"
            ? "inset 0 1px 2px rgba(255,255,255,0.05), inset 0 -1px 2px rgba(0,0,0,0.4)"
            : `inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.4), 0 0 8px ${CELL_COLORS[cell.state]}88`,
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
