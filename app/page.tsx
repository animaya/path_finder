"use client";

import { useState, useCallback } from "react";
import Grid from "@/components/Grid";
import { createGrid, Cell } from "@/lib/grid";
import { handleCellClick, InteractionMode } from "@/lib/interaction";

const DEFAULT_SIZE = 20;

const btnStyle = (active: boolean): React.CSSProperties => ({
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  border: active ? "1px solid #6366f1" : "1px solid #2a2a3a",
  background: active ? "#6366f1" : "#1a1a24",
  color: "#e8e8f0",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: active ? 600 : 400,
});

export default function Home() {
  const [gridSize, setGridSize] = useState(DEFAULT_SIZE);
  const [grid, setGrid] = useState<Cell[][]>(() => createGrid(DEFAULT_SIZE));
  const [mode, setMode] = useState<InteractionMode>("set-points");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const cellSize = Math.floor(560 / gridSize) - 1;

  const handleSizeChange = useCallback((newSize: number) => {
    setGridSize(newSize);
    setGrid(createGrid(newSize));
  }, []);

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      setIsMouseDown(true);
      setGrid((g) => handleCellClick(g, row, col, mode));
    },
    [mode]
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isMouseDown || mode !== "draw-walls") return;
      setGrid((g) => handleCellClick(g, row, col, mode));
    },
    [isMouseDown, mode]
  );

  return (
    <main
      onMouseUp={() => setIsMouseDown(false)}
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        padding: "2rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h1
          style={{
            color: "var(--foreground)",
            fontSize: "1.5rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textAlign: "center",
          }}
        >
          PathFinder Visualizer
        </h1>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            style={btnStyle(mode === "set-points")}
            onClick={() => setMode("set-points")}
          >
            Set Start / End
          </button>
          <button
            style={btnStyle(mode === "draw-walls")}
            onClick={() => setMode("draw-walls")}
          >
            Draw Walls
          </button>
        </div>

        <Grid
          grid={grid}
          cellSize={cellSize}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            color: "var(--foreground)",
            fontSize: "0.875rem",
          }}
        >
          <label>Grid size: {gridSize}×{gridSize}</label>
          <input
            type="range"
            min={10}
            max={50}
            value={gridSize}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            style={{ flex: 1 }}
          />
        </div>
      </div>
    </main>
  );
}
