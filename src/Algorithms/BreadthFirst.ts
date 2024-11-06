import { CELL } from "../type";
import { Grid } from "../util/grid";
import { PathFindingAlgorithm } from "../util/pathFindingAlgorithms";
import { Queue } from "../dataStructures/Queue";
export class BreadthFirst implements PathFindingAlgorithm {
  visited: Set<number> = new Set();
  queue: Queue<CELL> = new Queue();
  previous: Map<number, CELL> = new Map();
  findPath(grid: Grid, start: CELL, end: CELL): CELL[] {
    this.visited.add(grid.toNumber(start));
    this.queue.enqueue(start);
    let found = false;
    console.log("enterd algorithm");
    while (!this.queue.isEmpty() && !found) {
      const current = this.queue.dequeue();
      console.log(current, "current cell checking");
      if (!current) break;
      const neighbors = grid.getNeighbors(current);
      neighbors.forEach((cell: CELL) => {
        if (this.visited.has(grid.toNumber(cell))) return;
        this.visited.add(grid.toNumber(cell));
        this.queue.enqueue(cell);
        const color = this.calculateHighlightColor(grid, cell, end);
        this.previous.set(grid.toNumber(cell), current);
        grid.highlightCell.push({ cell, color });
        console.log("neighbors of ", current, " is ", cell);
        if (cell.row === end.row && cell.col === end.col) {
          found = true;
        }
      });
    }
    return this.reconstructPath(grid, start, end);
  }
  calculateHighlightColor(grid: Grid, cell: CELL, end: CELL, initalColor: [number, number, number] = [0, 255, 255]): [number, number, number, number] {
    if (grid.toNumber(cell) === grid.toNumber(end)) return [255, 0, 0, 255];
    const distanceToEnd = Math.sqrt(Math.abs(end.row - cell.row) ** 2 + Math.abs(end.col - cell.col) ** 2)
    const maxDistance = Math.sqrt(grid.numRow ** 2 + grid.numCol ** 2)
    const alpha = distanceToEnd / maxDistance
    const color: [number, number, number, number] = [...initalColor, alpha * 255]
    return color

  }
  reconstructPath(grid: Grid, start: CELL, end: CELL) {
    let prevCell = this.previous.get(grid.toNumber(end));
    let path: CELL[] = [];
    if (!prevCell) return [];
    console.log("reconstructing path", prevCell);
    while (grid.toNumber(prevCell) !== grid.toNumber(start)) {
      if (!prevCell) break;
      console.log("reconstructing path", prevCell);
      grid.algorithsmPathCells.push(prevCell);
      path.push(prevCell);
      prevCell = this.previous.get(grid.toNumber(prevCell));
    }
    path.push(start);
    return path;
  }
}
