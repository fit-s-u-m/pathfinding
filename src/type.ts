export type CELL = { row: number; col: number };
export type SELECT = "start" | "end" | "obstacle";
export type ALGORITHMS =
  | "A* algorithms"
  | "Dijkstra’s algorithm"
  | "Maximum Flow algorithm"
  | "Minimum Spanning Tree"
  | "Breadth-First Search"
  | "Depth-First Search"
  | "Greedy Best-First Search"
  | "Bellman-Ford Algorithm"
  | "Floyd-Warshall Algorithm";
export type COLOR = [number, number, number, number];
export type HIGHLIGHTCELL = { cell: CELL; color: COLOR };
