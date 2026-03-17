import { bfs } from "./algorithms/bfs";
import { dfs } from "./algorithms/dfs";
import { dijkstra } from "./algorithms/dijkstra";
import { aStar } from "./algorithms/aStar";
import { greedyBestFirst } from "./algorithms/greedyBestFirst";
import { bidirectionalBfs } from "./algorithms/bidirectionalBfs";
import { Algorithm } from "./algorithms/types";

export type AlgorithmName =
  | "bfs"
  | "dfs"
  | "dijkstra"
  | "aStar"
  | "greedyBestFirst"
  | "bidirectionalBfs";

export type VisualizationState = "idle" | "running" | "paused" | "completed";

const ALGORITHMS: Record<AlgorithmName, Algorithm> = {
  bfs,
  dfs,
  dijkstra,
  aStar,
  greedyBestFirst,
  bidirectionalBfs,
};

export const ALGORITHM_LABELS: Record<AlgorithmName, string> = {
  bfs: "BFS (Breadth-First Search)",
  dfs: "DFS (Depth-First Search)",
  dijkstra: "Dijkstra",
  aStar: "A* (A-Star)",
  greedyBestFirst: "Greedy Best-First",
  bidirectionalBfs: "Bidirectional BFS",
};

export function getAlgorithm(name: AlgorithmName): Algorithm {
  return ALGORITHMS[name];
}

export function canStart(state: VisualizationState): boolean {
  return state === "idle" || state === "completed";
}

export function canPause(state: VisualizationState): boolean {
  return state === "running";
}

export function canResume(state: VisualizationState): boolean {
  return state === "paused";
}

export function canClear(state: VisualizationState): boolean {
  return state === "completed";
}
