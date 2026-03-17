"use client";

import { useState, useCallback, useRef } from "react";
import Grid from "@/components/Grid";
import StatsPanel from "@/components/StatsPanel";
import { createGrid, setCell, resetColors, reset, Cell } from "@/lib/grid";
import { handleCellClick, InteractionMode } from "@/lib/interaction";
import { generateMaze } from "@/lib/maze";
import { computeStats, Stats } from "@/lib/stats";
import {
  getAlgorithm,
  canStart,
  canPause,
  canResume,
  canClear,
  AlgorithmName,
  VisualizationState,
  ALGORITHM_LABELS,
} from "@/lib/visualization";

const DEFAULT_SIZE = 20;

const btn = (active = false, disabled = false): React.CSSProperties => ({
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  border: active ? "1px solid #6366f1" : "1px solid #d0d0d8",
  background: active ? "#6366f1" : disabled ? "#f5f5f8" : "#ffffff",
  color: disabled ? "#bbb" : active ? "#fff" : "#111118",
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: "0.875rem",
  fontWeight: active ? 600 : 400,
  width: "100%",
});

const sectionLabel: React.CSSProperties = {
  color: "#999",
  fontSize: "0.75rem",
  marginBottom: "0.25rem",
};

export default function Home() {
  const [gridSize, setGridSize] = useState(DEFAULT_SIZE);
  const [grid, setGrid] = useState<Cell[][]>(() => createGrid(DEFAULT_SIZE));
  const [mode, setMode] = useState<InteractionMode>("set-points");
  const [difficulty, setDifficulty] = useState(0.5);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState<AlgorithmName>("bfs");
  const [vizState, setVizState] = useState<VisualizationState>("idle");
  const [stats, setStats] = useState<Stats | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const isPausedRef = useRef(false);
  const cellSize = Math.floor(560 / gridSize) - 1;
  const isRunning = vizState === "running" || vizState === "paused";

  const handleSizeChange = useCallback((newSize: number) => {
    setGridSize(newSize);
    setGrid(createGrid(newSize));
    setVizState("idle");
    setStats(null);
  }, []);

  const handleGenerateMaze = useCallback(() => {
    setGrid((g) => generateMaze(g, difficulty));
    setVizState("idle");
    setStats(null);
  }, [difficulty]);

  const handleReset = useCallback(() => {
    setGrid((g) => resetColors(g));
    setVizState("idle");
    setStats(null);
  }, []);

  const handleClearCanvas = useCallback(() => {
    setGrid((g) => reset(g));
    setVizState("idle");
    setStats(null);
  }, []);

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      if (isRunning) return;
      setIsMouseDown(true);
      setGrid((g) => handleCellClick(g, row, col, mode));
    },
    [mode, isRunning]
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isMouseDown || mode !== "draw-walls" || isRunning) return;
      setGrid((g) => handleCellClick(g, row, col, mode));
    },
    [isMouseDown, mode, isRunning]
  );

  const handleStart = useCallback(() => {
    if (!canStart(vizState)) return;
    setStats(null);

    let startRow = -1, startCol = -1, endRow = -1, endCol = -1;
    setGrid((g) => {
      for (let r = 0; r < g.length; r++) {
        for (let c = 0; c < g[r].length; c++) {
          if (g[r][c].state === "start") { startRow = r; startCol = c; }
          if (g[r][c].state === "end") { endRow = r; endCol = c; }
        }
      }
      return resetColors(g);
    });

    setTimeout(() => {
      setGrid((g) => {
        if (startRow === -1 || endRow === -1) return g;

        const fn = getAlgorithm(algorithm);
        const startTime = Date.now();
        const result = fn(g, startRow, startCol, endRow, endCol);
        isPausedRef.current = false;
        setVizState("running");

        let i = 0;
        const stepDelay = speed;

        function animateExplored() {
          if (isPausedRef.current) {
            const resumeCheck = setInterval(() => {
              if (!isPausedRef.current) {
                clearInterval(resumeCheck);
                animateExplored();
              }
            }, 100);
            return;
          }

          if (i >= result.explored.length) {
            animatePath(0);
            return;
          }

          const [er, ec] = result.explored[i++];
          setGrid((prev) => {
            const cell = prev[er][ec];
            if (cell.state === "start" || cell.state === "end") return prev;
            return setCell(prev, er, ec, "explored");
          });
          setTimeout(animateExplored, stepDelay);
        }

        function animatePath(j: number) {
          if (j >= result.path.length) {
            const endTime = Date.now();
            setStats(computeStats(result.explored.length, result.path.length, startTime, endTime));
            setVizState("completed");
            return;
          }
          const [pr, pc] = result.path[j];
          setGrid((prev) => {
            const cell = prev[pr][pc];
            if (cell.state === "start" || cell.state === "end") return prev;
            return setCell(prev, pr, pc, "path");
          });
          setTimeout(() => animatePath(j + 1), stepDelay);
        }

        setTimeout(animateExplored, stepDelay);
        return g;
      });
    }, 50);
  }, [vizState, algorithm, speed]);

  const handlePause = useCallback(() => {
    if (!canPause(vizState)) return;
    isPausedRef.current = true;
    setVizState("paused");
  }, [vizState]);

  const handleResume = useCallback(() => {
    if (!canResume(vizState)) return;
    isPausedRef.current = false;
    setVizState("running");
  }, [vizState]);

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
      {/* Control Panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          width: "220px",
          background: "var(--panel-bg)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "1.25rem",
          flexShrink: 0,
        }}
      >
        <h1 style={{ color: "#111118", fontSize: "1rem", fontWeight: 700, margin: 0 }}>
          PathFinder
        </h1>

        {/* Algorithm */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={sectionLabel}>Algorithm</div>
          <select
            value={algorithm}
            disabled={isRunning}
            onChange={(e) => setAlgorithm(e.target.value as AlgorithmName)}
            style={{
              background: "#ffffff",
              border: "1px solid #d0d0d8",
              color: isRunning ? "#bbb" : "#111118",
              borderRadius: "8px",
              padding: "0.4rem 0.5rem",
              fontSize: "0.8rem",
              cursor: isRunning ? "not-allowed" : "pointer",
            }}
          >
            {(Object.keys(ALGORITHM_LABELS) as AlgorithmName[]).map((name) => (
              <option key={name} value={name}>
                {ALGORITHM_LABELS[name]}
              </option>
            ))}
          </select>
        </div>

        {/* Playback */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={sectionLabel}>Visualization</div>
          {canStart(vizState) && (
            <button style={btn(true)} onClick={handleStart}>Start</button>
          )}
          {canPause(vizState) && (
            <button style={btn(false)} onClick={handlePause}>Pause</button>
          )}
          {canResume(vizState) && (
            <button style={btn(false)} onClick={handleResume}>Resume</button>
          )}
          <button style={btn(false, vizState === "idle")} onClick={handleReset}>
            Reset Colors
          </button>
          {canClear(vizState) && (
            <button style={btn(false)} onClick={handleClearCanvas}>
              Clear Canvas
            </button>
          )}
        </div>

        {/* Stats */}
        {stats && <StatsPanel stats={stats} />}

        {/* Speed */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={sectionLabel}>
            Speed: {speed <= 10 ? "Fast" : speed <= 50 ? "Medium" : "Slow"}
          </div>
          <input
            type="range"
            min={5}
            max={200}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        {/* Interaction mode */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={sectionLabel}>Interaction</div>
          <button
            style={btn(mode === "set-points", isRunning)}
            disabled={isRunning}
            onClick={() => setMode("set-points")}
          >
            Set Start / End
          </button>
          <button
            style={btn(mode === "draw-walls", isRunning)}
            disabled={isRunning}
            onClick={() => setMode("draw-walls")}
          >
            Draw Walls
          </button>
        </div>

        {/* Maze */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={sectionLabel}>Difficulty: {Math.round(difficulty * 100)}%</div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(difficulty * 100)}
            disabled={isRunning}
            onChange={(e) => setDifficulty(Number(e.target.value) / 100)}
            style={{ width: "100%" }}
          />
          <button style={btn(false, isRunning)} disabled={isRunning} onClick={handleGenerateMaze}>
            Generate Maze
          </button>
        </div>

        {/* Grid size */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={sectionLabel}>Grid: {gridSize}×{gridSize}</div>
          <input
            type="range"
            min={10}
            max={50}
            value={gridSize}
            disabled={isRunning}
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
