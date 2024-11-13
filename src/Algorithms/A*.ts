import { COLOR } from "../type";
import { Graph } from "../dataStructures/Graph";
import { PathFindingAlgorithm } from "../util/pathFindingAlgorithms";
import { PQueue } from "../dataStructures/PriorityQueue";
import { Cell } from "../util/cell";
import { colors } from "../util/colors";
import { ComposedAction } from "../util/action";
import { History } from "../util/history";

export class Astar implements PathFindingAlgorithm {
  private visited: Set<number> = new Set();
  private gScore: Map<number, number> = new Map(); // map(index,dist)
  private Pqueue: PQueue<Cell> = new PQueue();
  private previous: Map<number, Cell> = new Map();

  *findPath(graph: Graph, start: Cell, end: Cell): Generator<void> {
    console.log("running A*")

    // clear prev data
    this.reset()
    this.gScore = new Map(); // map(index,dist)

    this.visited.add(graph.toNumber(start));

    const hScore = graph.getDistance(start, end)
    const fScore = 0 + hScore
    this.Pqueue.enqueue(start, fScore);
    this.gScore.set(graph.toNumber(start), 0)
    let found = false;

    while (!this.Pqueue.isEmpty() && !found) {
      const current = this.Pqueue.dequeue();
      if (!current) break;

      const neighbors = current.neighbors
        .map(neighbor => neighbor.cell)
        .filter((cell: Cell) => cell.type !== "obstacle")
        .filter((cell: Cell) => !this.visited.has(graph.toNumber(cell)));

      const composedAction = new ComposedAction();
      this.visited.add(graph.toNumber(current));

      for (const cell of neighbors) {
        if (this.visited.has(graph.toNumber(cell))) continue;


        const currentWeight = graph.getDistance(current, cell)
        const runningWeight = currentWeight + (this.gScore.get(graph.toNumber(current)) || 0)
        const prevWeight = this.gScore.get(graph.toNumber(cell))

        let color: COLOR
        let weight: number

        if (!prevWeight || prevWeight > runningWeight) { // if there is prev weight and it is greater than the current
          this.gScore.set(graph.toNumber(cell), runningWeight)
          const hScore = graph.getDistance(cell, end)

          const fScore = (this.gScore.get(graph.toNumber(cell)) || 0) + hScore

          color = colors.primary as COLOR
          weight = fScore

          this.previous.set(graph.toNumber(cell), current);
          this.Pqueue.enqueue(cell, fScore)
        }
        else {

          color = colors.secondary as COLOR
          const hScore = graph.getDistance(cell, end)
          weight = prevWeight + hScore
        }
        if (graph.toNumber(cell) === graph.toNumber(end)) {
          found = true
          break
        }

        const action = cell.highlight(color)
        composedAction.addAction(action)
        cell.text = weight.toFixed(1)
        graph.currentScan = cell

        yield
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
    const composedAction = new ComposedAction()

    const action = graph.highlighightConnection(prevCell, end)
    composedAction.addAction(action)

    console.log("reconstructing path");

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

