import { Grid } from "./grid";
import { ALGORITHMS, CELL } from "../type";
import { BreadthFirst } from "../Algorithms/BreadthFirst";
export interface PathFindingAlgorithm {
  * findPath: (grid: Grid, start: CELL, end: CELL) => Iterator<CELL[]>;
}
export class Algorithms {
  static algorithms(algorithm: ALGORITHMS): PathFindingAlgorithm {
    switch (algorithm) {
      case "A* algorithms":
      case "Dijkstra\u2019s algorithm":
      case "Maximum Flow algorithm":
      case "Minimum Spanning Tree ":
      case "Breadth-First Search ":
        return new BreadthFirst();
      case "Depth-First Search":
      case "Greedy Best-First Search":
      case "Bellman-Ford Algorithm":
      case "Floyd-Warshall Algorithm":
      default:
        return new BreadthFirst();
    }
  }
}
