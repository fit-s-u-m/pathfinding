import { Graph } from "../dataStructures/Graph";
import { PathFindingAlgorithm } from "../util/pathFindingAlgorithms";
import { PQueue } from "../dataStructures/PriorityQueue";
import { Cell } from "../util/cell";
import { History } from "../util/history";
import { ComposedAction } from "../util/action";

export class Gready implements PathFindingAlgorithm {
  private visited: Set<number> = new Set();
  private Pqueue: PQueue<Cell> = new PQueue();
  private previous: Map<number, Cell> = new Map();

  *findPath(graph: Graph, start: Cell, end: Cell): Generator<void> {
    // clear prev data
    this.reset()

    this.visited.add(graph.toNumber(start));
    this.Pqueue.enqueue(start, 0);

    let found = false;

    while (!this.Pqueue.isEmpty() && !found) {
      const current = this.Pqueue.dequeue();
      graph.currentScan = current


      if (!current) break;

      const neighbors = current.neighbors
        .map(neighbor => neighbor.cell)
        .filter((cell: Cell) => cell.type !== "obstacle")
        .filter((cell: Cell) => !this.visited.has(graph.toNumber(cell)));

      const composedAction = new ComposedAction()
      for (const cell of neighbors) {
        if (this.visited.has(graph.toNumber(cell))) continue;


        const heuristic = graph.getDistance(cell, end)


        this.Pqueue.enqueue(cell, heuristic);
        this.visited.add(graph.toNumber(cell));
        this.previous.set(graph.toNumber(cell), current)

        if (graph.toNumber(cell) === graph.toNumber(end)) {
          found = true
          break
        }

        const endDist = graph.getDistance(cell, end)
        const startDist = graph.getDistance(start, end)
        const percent = Math.min(endDist, startDist) / Math.max(endDist, startDist)
        const action = cell.highlight(percent)
        composedAction.addAction(action)
        cell.text = heuristic.toFixed(1)
      }
      History.getInstance().saveState(composedAction)

    }

    // At the end of the pathfinding, reconstruct the path
    yield* this.reconstructPath(graph, start, end);

  }
  reset() {
    this.visited = new Set();
    this.Pqueue = new PQueue();
    this.previous = new Map();

  }
  *reconstructPath(graph: Graph, start: Cell, end: Cell) {
    let prevCell = this.previous.get(graph.toNumber(end));
    let path: Cell[] = [];
    if (!prevCell) return [];
    console.log("reconstructing path");

    const composedAction = new ComposedAction();
    const action = graph.highlighightConnection(prevCell, end)
    composedAction.addAction(action)


    while (prevCell && graph.toNumber(prevCell) !== graph.toNumber(start)) {

      const action = graph.addPathCell(prevCell);
      composedAction.addAction(action)
      path.push(prevCell);
      yield
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


