import { CELL, HIGHLIGHT, State } from "../type";
import { Grid } from "../util/grid";
import { PathFindingAlgorithm } from "../util/pathFindingAlgorithms";
import { Queue } from "../dataStructures/Queue";

export class Dijkstra implements PathFindingAlgorithm {
  private visited: Set<number> = new Set();
  private shortestDistance: Map<number, number> = new Map(); // map(index,dist)
  private queue: Queue<CELL> = new Queue();
  private previous: Map<number, CELL> = new Map();

  // Correctly defining the generator function
  *findPath(grid: Grid, start: CELL, end: CELL): Generator<State> {
    console.log("running dijkstra")

    // clear prev data
    this.visited = new Set();
    this.queue = new Queue();
    this.previous = new Map();
    this.shortestDistance = new Map(); // map(index,dist)

    this.visited.add(grid.toNumber(start));
    this.queue.enqueue(start);
    this.shortestDistance.set(grid.toNumber(start), 0)
    let found = false;

    while (!this.queue.isEmpty() && !found) {
      const current = this.queue.dequeue();
      console.log(current, "current cell checking");
      if (!current) break;

      const neighbors = grid.getNeighbors(current);
      this.visited.add(grid.toNumber(current));
      for (const cell of neighbors) {
        if (this.visited.has(grid.toNumber(cell))) continue;


        const currentWeight = this.calculateWeight(current, cell)
        const runningWeight = currentWeight + this.shortestDistance.get(grid.toNumber(current))
        const prevWeight = this.shortestDistance.get(grid.toNumber(cell))

        console.log("running weight", runningWeight, "prev Weight", prevWeight, cell)
        if (!prevWeight || prevWeight > runningWeight) { // if there is prev weight and it is greater than the current
          this.previous.set(grid.toNumber(cell), current);
          this.shortestDistance.set(grid.toNumber(cell), runningWeight)
          const highlight = this.calculateHighlightColor(grid, cell, end, [0, 0, 196]);
          grid.highlightCell.set(grid.toNumber(cell), highlight);
          this.queue.enqueue(cell);
          console.log("Found shortest", runningWeight, "at ", cell);
        }
        else {
          const highlight = this.calculateHighlightColor(grid, cell, end, [198, 0, 0]);
          grid.highlightCell.set(grid.toNumber(cell), highlight);
          console.log("shortest", prevWeight, "at ", cell);
        }
        grid.currentScan = cell

        // Constructing the state to yield
        const state: State = {
          obstacles: grid.obstacles,
          highlightCell: grid.highlightCell,
          algorithsmPathCells: grid.algorithsmPathCells,
        };

        yield state;

        if (cell.row === end.row && cell.col === end.col) {
          found = true
          break
        }
      }
    }

    // At the end of the pathfinding, reconstruct the path
    yield* this.reconstructPath(grid, start, end);

  }
  reset() {
    this.visited = new Set();
    this.queue = new Queue();
    this.previous = new Map();

  }
  calculateWeight(cell1: CELL, cell2: CELL) {
    return Math.sqrt(Math.abs(cell1.row - cell2.row) ** 2 + Math.abs(cell1.col - cell2.col) ** 2);
  }

  calculateHighlightColor(grid: Grid, cell: CELL, end: CELL, initialColor: [number, number, number] = [0, 255, 255]): HIGHLIGHT {
    if (grid.toNumber(cell) === grid.toNumber(end)) return { color: [255, 0, 0, 255], text: "End" };

    const distanceToEnd = this.calculateWeight(cell, end)
    const maxDistance = Math.sqrt(grid.numRow ** 2 + grid.numCol ** 2);
    const alpha = 1 - distanceToEnd / maxDistance;
    const color: [number, number, number, number] = [...initialColor, alpha * 255];

    return { color, text: distanceToEnd.toFixed(1).toString() };
  }

  *reconstructPath(grid: Grid, start: CELL, end: CELL) {
    let prevCell = this.previous.get(grid.toNumber(end));
    let path: CELL[] = [];
    if (!prevCell) return [];

    console.log("reconstructing path", prevCell);
    while (grid.toNumber(prevCell) !== grid.toNumber(start)) {
      if (!prevCell) break;
      console.log("reconstructing path", prevCell);
      grid.algorithsmPathCells.push(prevCell);
      path.push(prevCell);
      const state: State = {
        obstacles: grid.obstacles,
        highlightCell: grid.highlightCell,
        algorithsmPathCells: grid.algorithsmPathCells,
      };

      yield state;
      prevCell = this.previous.get(grid.toNumber(prevCell));
    }
    path.push(start);
    return path;
  }
}

