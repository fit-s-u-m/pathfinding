import { ALGORITHMS, State } from "../type";
import { BreadthFirst } from "../Algorithms/BreadthFirst";
import { Dijkstra } from "../Algorithms/Dijkstra";
import { Gready } from "../Algorithms/Gready.ts"
import { Graph } from "../dataStructures/Graph";
import { Cell } from "./cell";
export interface PathFindingAlgorithm {
  findPath: (grid: Graph, start: Cell, end: Cell) => Generator<State, Cell[]>;
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
      case "Greedy Best first algorithm":
        return new Gready()
      case "Bellman-Ford Algorithm":
      case "Floyd-Warshall Algorithm":
      default:
        return new BreadthFirst();
    }
  }
}
