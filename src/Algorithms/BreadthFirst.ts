import { CELL, HIGHLIGHT, State } from "../type";
import { Grid } from "../util/grid";
import { PathFindingAlgorithm } from "../util/pathFindingAlgorithms";
import { Queue } from "../dataStructures/Queue";

export class BreadthFirst implements PathFindingAlgorithm {
  visited: Set<number> = new Set();
  queue: Queue<CELL> = new Queue();
  previous: Map<number, CELL> = new Map();

  // Correctly defining the generator function
  *findPath(grid: Grid, start: CELL, end: CELL): Generator<State, CELL[]> {
    this.visited.add(grid.toNumber(start));
    this.queue.enqueue(start);
    let found = false;
    console.log("entered algorithm");

    while (!this.queue.isEmpty() && !found) {
      const current = this.queue.dequeue();
      console.log(current, "current cell checking");
      if (!current) break;

      const neighbors = grid.getNeighbors(current);
      for (const cell of neighbors) {
        if (this.visited.has(grid.toNumber(cell))) continue;

        this.visited.add(grid.toNumber(cell));
        this.queue.enqueue(cell);
        const highlight = this.calculateHighlightColor(grid, cell, end);
        this.previous.set(grid.toNumber(cell), current);
        grid.highlightCell.set(grid.toNumber(cell), highlight);

        // Constructing the state to yield
        const state: State = {
          obstacles: grid.obstacles,
          highlightCell: grid.highlightCell,
          algorithsmPathCells: grid.algorithsmPathCells,
        };

        yield state;

        console.log("neighbors of ", current, " is ", cell);
        if (cell.row === end.row && cell.col === end.col) {
          found = true
          break
        }
      }
    }

    // At the end of the pathfinding, reconstruct the path
    yield* this.reconstructPath(grid, start, end);

  }

  calculateHighlightColor(grid: Grid, cell: CELL, end: CELL, initialColor: [number, number, number] = [0, 255, 255]): HIGHLIGHT {
    if (grid.toNumber(cell) === grid.toNumber(end)) return { color: [255, 0, 0, 255], text: "End" };

    const distanceToEnd = Math.sqrt(Math.abs(end.row - cell.row) ** 2 + Math.abs(end.col - cell.col) ** 2);
    const maxDistance = Math.sqrt(grid.numRow ** 2 + grid.numCol ** 2);
    const alpha = 1 - distanceToEnd / maxDistance;
    const color: [number, number, number, number] = [...initialColor, alpha * 255];

    return { color, text: distanceToEnd.toFixed(2).toString() };
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

