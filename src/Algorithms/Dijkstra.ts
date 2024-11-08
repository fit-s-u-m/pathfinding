import { COLOR, State } from "../type";
import { Graph } from "../dataStructures/Graph";
import { PathFindingAlgorithm } from "../util/pathFindingAlgorithms";
import { Queue } from "../dataStructures/Queue";
import { Cell } from "../util/cell";
import { colors } from "../util/colors";

export class Dijkstra implements PathFindingAlgorithm {
  private visited: Set<number> = new Set();
  private shortestDistance: Map<number, number> = new Map(); // map(index,dist)
  private queue: Queue<Cell> = new Queue();
  private previous: Map<number, Cell> = new Map();

  // Correctly defining the generator function
  *findPath(graph: Graph, start: Cell, end: Cell): Generator<State> {
    console.log("running dijkstra")

    // clear prev data
    this.visited = new Set();
    this.queue = new Queue();
    this.previous = new Map();
    this.shortestDistance = new Map(); // map(index,dist)

    this.visited.add(graph.toNumber(start));
    this.queue.enqueue(start);
    this.shortestDistance.set(graph.toNumber(start), 0)
    let found = false;

    while (!this.queue.isEmpty() && !found) {
      const current = this.queue.dequeue();
      console.log(current, "current cell checking");
      if (!current) break;

      const neighbors = current.neighbors.filter((cell: Cell) => cell.type !== "obstacle");
      this.visited.add(graph.toNumber(current));
      for (const cell of neighbors) {
        if (this.visited.has(graph.toNumber(cell))) continue;


        const currentWeight = graph.getWeight(current, cell)
        const runningWeight = currentWeight + this.shortestDistance.get(graph.toNumber(current))
        const prevWeight = this.shortestDistance.get(graph.toNumber(cell))

        console.log("running weight", runningWeight, "prev Weight", prevWeight, cell)
        if (!prevWeight || prevWeight > runningWeight) { // if there is prev weight and it is greater than the current
          this.previous.set(graph.toNumber(cell), current);
          this.shortestDistance.set(graph.toNumber(cell), runningWeight)
          cell.highlight(colors.primary as COLOR);// FIXME: this is not working
          cell.name = runningWeight.toFixed(1)
          this.queue.enqueue(cell);
          console.log("Found shortest", runningWeight, "at ", cell);
        }
        else {
          cell.highlight(colors.secondary as COLOR);// FIXME: this is not working
          cell.name = prevWeight.toFixed(1)
          console.log("shortest", prevWeight, "at ", cell);
        }
        graph.currentScan = cell

        // Constructing the state to yield
        if (start && end) {
          const state: State = {
            start,
            end,
            obstacles: graph.getObstacles(),
            highlightCell: graph.getHighlights(),
            algorithsmPathCells: graph.algorithsmPathCells,
          };

          yield state;

        }

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
  // calculateHighlightColor(graph: Graph, cell: Cell, end: Cell, initialColor: [number, number, number] = [0, 255, 255]): HIGHLIGHT {
  //   if (graph.toNumber(cell) === graph.toNumber(end)) return { color: [255, 0, 0, 255], text: "End" };
  //
  //   const distanceToEnd = graph.getWeight(cell, end);
  //   const maxDistance = 5
  //   const alpha = 1 - distanceToEnd / maxDistance;
  //   const color: [number, number, number, number] = [...initialColor, alpha * 255];
  //
  //   return { color, text: distanceToEnd.toFixed(1).toString() };
  // }
  //
  *reconstructPath(graph: Graph, start: Cell, end: Cell) {
    let prevCell = this.previous.get(graph.toNumber(end));
    let path: Cell[] = [];
    if (!prevCell) return [];

    console.log("reconstructing path", prevCell);
    while (prevCell && graph.toNumber(prevCell) !== graph.toNumber(start)) {
      console.log("reconstructing path", prevCell);
      graph.addPathCell(prevCell);
      path.push(prevCell);
      const state: State = {
        start,
        end,
        obstacles: graph.getObstacles(),
        highlightCell: graph.getHighlights(),
        algorithsmPathCells: graph.algorithsmPathCells,
      };

      yield state;
      prevCell = this.previous.get(graph.toNumber(prevCell));
    }
    path.push(start);
    return path;
  }
}

