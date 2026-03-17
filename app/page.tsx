"use client";

import { useState, useCallback } from "react";
import Grid from "@/components/Grid";
import { createGrid, setCell, Cell } from "@/lib/grid";

const DEFAULT_SIZE = 20;

export default function Home() {
  const [gridSize, setGridSize] = useState(DEFAULT_SIZE);
  const [grid, setGrid] = useState<Cell[][]>(() => createGrid(DEFAULT_SIZE));
  const [isMouseDown, setIsMouseDown] = useState(false);
  const cellSize = Math.floor(560 / gridSize) - 1;

  const handleSizeChange = useCallback((newSize: number) => {
    setGridSize(newSize);
    setGrid(createGrid(newSize));
  }, []);

  const handleMouseDown = useCallback((row: number, col: number) => {
    setIsMouseDown(true);
    setGrid((g) => setCell(g, row, col, "wall"));
  }, []);

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isMouseDown) return;
      setGrid((g) => setCell(g, row, col, "wall"));
    },
    [isMouseDown]
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
