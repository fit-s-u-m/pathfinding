import { Graph } from "../dataStructures/Graph";
import { PathFindingAlgorithm } from "../util/pathFindingAlgorithms";
import { PQueue } from "../dataStructures/PriorityQueue";
import { Cell } from "../util/cell";

import { History } from "../util/history";
import { ComposedAction } from "../util/action";

export class Dijkstra implements PathFindingAlgorithm {
  private visited: Set<number> = new Set();
  private shortestDistance: Map<number, number> = new Map(); // map(index,dist)
  private Pqueue: PQueue<Cell> = new PQueue();
  private previous: Map<number, Cell> = new Map();

  *findPath(graph: Graph, start: Cell, end: Cell): Generator<void> {

    // clear prev data
    this.reset()

    this.visited.add(graph.toNumber(start));
    this.Pqueue.enqueue(start, 0);
    this.shortestDistance.set(graph.toNumber(start), 0)
    let found = false;

    while (!this.Pqueue.isEmpty() && !found) {
      const current = this.Pqueue.dequeue();
      if (!current) break;

      const neighbors = current.neighbors
        .map(neighbor => neighbor.cell)
        .filter((cell: Cell) => cell.type !== "obstacle")
        .filter((cell: Cell) => !this.visited.has(graph.toNumber(cell)));

      this.visited.add(graph.toNumber(current));

      const composedAction = new ComposedAction();

      // if (graph.toNumber(current) !== graph.toNumber(start)) {
      //   const action = current.highlight()
      //   composedAction.addAction(action)
      // }

      for (const cell of neighbors) {
        if (this.visited.has(graph.toNumber(cell))) continue;


        const currentWeight = graph.getDistance(current, cell)
        const runningWeight = currentWeight + (this.shortestDistance.get(graph.toNumber(current)) || 0)
        const prevWeight = this.shortestDistance.get(graph.toNumber(cell))


        if (!prevWeight || prevWeight > runningWeight) { // if there is prev weight and it is greater than the current
          this.shortestDistance.set(graph.toNumber(cell), runningWeight)

          const weight = runningWeight

          this.previous.set(graph.toNumber(cell), current);
          this.Pqueue.enqueue(cell, runningWeight)

          if (graph.toNumber(cell) === graph.toNumber(end)) {
            found = true
            break
          }

          cell.text = weight.toFixed(1)
          const endDist = graph.getDistance(cell,end)
          const startDist = graph.getDistance(start,end)
          const percent = Math.min(endDist,startDist) / Math.max(endDist,startDist)
          const action = cell.highlight(percent)
          composedAction.addAction(action)

        }
        else {
          const weight = prevWeight
          if (graph.toNumber(cell) === graph.toNumber(end)) {
            found = true
            break
          }

          cell.text = weight.toFixed(1)
          const endDist = graph.getDistance(cell,end)
          const startDist = graph.getDistance(start,end)
          const percent = Math.min(endDist,startDist) / Math.max(endDist,startDist)
          const action = cell.highlight(percent)
          composedAction.addAction(action)
        }

        graph.currentScan = cell

        yield;
      }
      History.getInstance().saveState(composedAction)
    }

    yield* this.reconstructPath(graph, start, end);

  }
  reset() {
    this.visited = new Set();
    this.Pqueue = new PQueue();
    this.previous = new Map();
    this.shortestDistance = new Map(); // map(index,dist)

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
      yield;
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
    path.push(start);
    History.getInstance().saveState(composedAction)
    return path;
  }
}

