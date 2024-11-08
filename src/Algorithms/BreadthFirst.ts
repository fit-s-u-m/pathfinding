import { HIGHLIGHT, State } from "../type";
import { PathFindingAlgorithm } from "../util/pathFindingAlgorithms";
import { Queue } from "../dataStructures/Queue";
import { Graph } from "../dataStructures/Graph";
import { Cell } from "../util/cell";

export class BreadthFirst implements PathFindingAlgorithm {
  visited: Set<number> = new Set();
  queue: Queue<Cell> = new Queue();
  previous: Map<number, Cell> = new Map();

  // Correctly defining the generator function
  *findPath(graph: Graph, start: Cell, end: Cell): Generator<State> {
    console.log("running breadthFirst")
    // clear prev data
    this.visited = new Set();
    this.queue = new Queue();
    this.previous = new Map();

    this.visited.add(graph.toNumber(start));
    this.queue.enqueue(start);
    let found = false;
    console.log("entered algorithm");

    while (!this.queue.isEmpty() && !found) {
      const current = this.queue.dequeue();
      if (!current) break;

      const neighbors = current.neighbors
        .filter((cell: Cell) => cell.type !== "obstacle")
        .filter((cell: Cell) => !this.visited.has(graph.toNumber(cell)));
      for (const cell of neighbors) {
        if (this.visited.has(graph.toNumber(cell))) continue;

        this.visited.add(graph.toNumber(cell));
        this.queue.enqueue(cell);
        this.previous.set(graph.toNumber(cell), current);
        cell.highlight([198, 199, 196, 255]);// FIXME: this is not working


        // Constructing the state to yield
        const state: State = {
          obstacles: graph.getObstacles(),
          highlightCell: graph.highlightCell,
          algorithsmPathCells: graph.algorithsmPathCells,
        };

        yield state;

        console.log("neighbors of ", current, " is ", cell);
        if (graph.toNumber(cell) === graph.toNumber(end)) {
          found = true
          break
        }
      }
    }

    // At the end of the pathfinding, reconstruct the path
    yield* this.reconstructPath(graph, start, end);

  }
  reset() {
    this.visited = new Set();
    this.queue = new Queue();
    this.previous = new Map();

  }

  // calculateHighlightColor(grid: Grid, cell: CELL, end: CELL, initialColor: [number, number, number] = [0, 255, 255]): HIGHLIGHT {
  //   if (grid.toNumber(cell) === grid.toNumber(end)) return { color: [255, 0, 0, 255], text: "End" };
  //
  //   const distanceToEnd = Math.sqrt(Math.abs(end.row - cell.row) ** 2 + Math.abs(end.col - cell.col) ** 2);
  //   const maxDistance = Math.sqrt(grid.numRow ** 2 + grid.numCol ** 2);
  //   const alpha = 1 - distanceToEnd / maxDistance;
  //   const color: [number, number, number, number] = [...initialColor, alpha * 255];
  //
  //   return { color, text: distanceToEnd.toFixed(1).toString() };
  // }

  *reconstructPath(graph: Graph, start: Cell, end: Cell) {
    let prevCell = this.previous.get(graph.toNumber(end));
    let path: Cell[] = [];
    if (!prevCell) return [];

    console.log("reconstructing path", prevCell);
    while (graph.toNumber(prevCell) !== graph.toNumber(start)) {
      if (!prevCell) break;
      console.log("reconstructing path", prevCell);
      graph.addPathCell(prevCell);
      path.push(prevCell);
      const state: State = {
        obstacles: graph.getObstacles(),
        highlightCell: graph.highlightCell,
        algorithsmPathCells: graph.algorithsmPathCells,
      };

      yield state;
      prevCell = this.previous.get(graph.toNumber(prevCell));
    }
    path.push(start);
    return path;
  }
}

