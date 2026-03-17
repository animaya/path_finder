"use client";

import { useState, useCallback } from "react";
import Grid from "@/components/Grid";
import { createGrid, Cell } from "@/lib/grid";
import { handleCellClick, InteractionMode } from "@/lib/interaction";
import { generateMaze } from "@/lib/maze";

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

const labelStyle: React.CSSProperties = {
  color: "#888",
  fontSize: "0.75rem",
  marginBottom: "0.25rem",
};

export default function Home() {
  const [gridSize, setGridSize] = useState(DEFAULT_SIZE);
  const [grid, setGrid] = useState<Cell[][]>(() => createGrid(DEFAULT_SIZE));
  const [mode, setMode] = useState<InteractionMode>("set-points");
  const [difficulty, setDifficulty] = useState(0.5);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const cellSize = Math.floor(560 / gridSize) - 1;

  const handleSizeChange = useCallback((newSize: number) => {
    setGridSize(newSize);
    setGrid(createGrid(newSize));
  }, []);

  const handleGenerateMaze = useCallback(() => {
    setGrid((g) => generateMaze(g, difficulty));
  }, [difficulty]);

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
        gap: "2.5rem",
        padding: "2rem",
      }}
    >
      {/* Control Panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          width: "220px",
          background: "var(--panel-bg)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "1.25rem",
        }}
      >
        <h1 style={{ color: "var(--foreground)", fontSize: "1rem", fontWeight: 700, margin: 0 }}>
          PathFinder Visualizer
        </h1>

        {/* Mode */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={labelStyle}>Interaction mode</div>
          <button style={btnStyle(mode === "set-points")} onClick={() => setMode("set-points")}>
            Set Start / End
          </button>
          <button style={btnStyle(mode === "draw-walls")} onClick={() => setMode("draw-walls")}>
            Draw Walls
          </button>
        </div>

        {/* Maze */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={labelStyle}>
            Difficulty: {Math.round(difficulty * 100)}%
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(difficulty * 100)}
            onChange={(e) => setDifficulty(Number(e.target.value) / 100)}
            style={{ width: "100%" }}
          />
          <button style={btnStyle(false)} onClick={handleGenerateMaze}>
            Generate Maze
          </button>
        </div>

        {/* Grid size */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={labelStyle}>Grid size: {gridSize}×{gridSize}</div>
          <input
            type="range"
            min={10}
            max={50}
            value={gridSize}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Grid */}
      <Grid
        grid={grid}
        cellSize={cellSize}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
      />
    </main>
  );
}
