import { Grid } from "./grid";
import { ALGORITHMS, CELL, State } from "../type";
import { BreadthFirst } from "../Algorithms/BreadthFirst";
import { Dijkstra } from "../Algorithms/Dijkstra";
export interface PathFindingAlgorithm {
  findPath: (grid: Grid, start: CELL, end: CELL) => Generator<State, CELL[]>;
}
export class Algorithms {
  static algorithms(algorithm: ALGORITHMS): PathFindingAlgorithm {
    switch (algorithm) {
      case "A* algorithms":
      case "Dijkstra’s algorithm":
        return new Dijkstra();
      case "Maximum Flow algorithm":
      case "Minimum Spanning Tree":
      case "Breadth-First Search":
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
