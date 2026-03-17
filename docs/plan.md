# PathFinder Visualizer — Plan

## Stack
- Next.js + TypeScript + Bun
- Tailwind CSS
- GitHub: https://github.com/animaya/path_finder.git (public, branch: main)

## Grid
- Size controlled by slider
- Cells styled as convex "candy" shapes via CSS box-shadow/gradient
- Click 1 = point A (green), Click 2 = point B (red)
- Wall drawing mode via dedicated button toggle

## Pathfinding Algorithms
1. BFS (Breadth-First Search)
2. DFS (Depth-First Search)
3. Dijkstra
4. A* (A-star)
5. Greedy Best-First Search
6. Bidirectional BFS

## Maze Generation
- Algorithm: Recursive Backtracker (guarantees solvable maze)
- Difficulty slider = wall density (low = few walls, high = dense narrow corridors)
- Generate button triggers maze creation

## Visualization
- Explored cells → blue
- Final path → yellow
- Animation speed slider
- Pause button (cannot switch algorithm mid-run)
- Reset button → clears only cell colors, maze stays intact

## Statistics Panel
- Number of explored cells
- Path length
- Execution time

## Visual Style
- Dark theme inspired by pathfinding.js
- Cells look like convex candy pieces (CSS gradient + shadow)

## Target
- Desktop only
- No mobile support needed
