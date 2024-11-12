import { COLOR } from "../type";
import { colors } from "../util/colors";
import { PathFindingAlgorithm } from "../util/pathFindingAlgorithms";
import { Queue } from "../dataStructures/Queue";
import { Graph } from "../dataStructures/Graph";
import { Cell } from "../util/cell";

import { History } from "../util/history";
import { ComposedAction } from "../util/action";

export class BreadthFirst implements PathFindingAlgorithm {
  visited: Set<number> = new Set();
  queue: Queue<Cell> = new Queue();
  previous: Map<number, Cell> = new Map();

  *findPath(graph: Graph, start: Cell, end: Cell): Generator<void> {
    console.log("running breadthFirst")

    // clear prev data
    this.visited = new Set();
    this.queue = new Queue();
    this.previous = new Map();

    this.visited.add(graph.toNumber(start));
    this.queue.enqueue(start);
    let found = false;

    while (!this.queue.isEmpty() && !found) {
      const current = this.queue.dequeue();
      if (!current) break;

      const neighbors = current.neighbors
        .map(neighbor => neighbor.cell)
        .filter((cell: Cell) => cell.type !== "obstacle")
        .filter((cell: Cell) => !this.visited.has(graph.toNumber(cell)));

      const composedAction = new ComposedAction();

      if (current !== start) {
        const action = current.highlight(colors.secondary as COLOR)
        composedAction.addAction(action)
      }

      for (const cell of neighbors) {
        if (this.visited.has(graph.toNumber(cell))) continue;

        this.visited.add(graph.toNumber(cell));
        this.queue.enqueue(cell);
        this.previous.set(graph.toNumber(cell), current);

        if (graph.toNumber(cell) === graph.toNumber(end)) {
          found = true
          break
        }
        const color = colors.primary as COLOR
        cell.text = graph.getWeight(current, cell).toFixed(1)

        const action = cell.highlight(color)
        composedAction.addAction(action)

        yield;
      }
      History.getInstance().saveState(composedAction)
    }

    // At the end of the pathfinding, reconstruct the path
    yield* this.reconstructPath(graph, start, end);

  }
  reset() {
    this.visited = new Set();
    this.queue = new Queue();
    this.previous = new Map();

  }

  *reconstructPath(graph: Graph, start: Cell, end: Cell) {
    let prevCell = this.previous.get(graph.toNumber(end));
    let path: Cell[] = [];
    if (!prevCell) return [];
    const composedAction = new ComposedAction();
    const action = graph.highlighightConnection(prevCell, end)
    composedAction.addAction(action)

    while (prevCell && graph.toNumber(prevCell) !== graph.toNumber(start)) {

      const action = graph.addPathCell(prevCell);
      composedAction.addAction(action)

      path.push(prevCell);

      if (start && end) {
        yield;
      }
      const nextCell = this.previous.get(graph.toNumber(prevCell));
      if (nextCell) {
        const action = graph.highlighightConnection(nextCell, prevCell)
        composedAction.addAction(action)
      }
      prevCell = nextCell
    }
    if (prevCell) {
      const action = graph.highlighightConnection(start, prevCell)
      composedAction.addAction(action)
    }
    History.getInstance().saveState(composedAction)
    path.push(start);
    return path;
  }
}

