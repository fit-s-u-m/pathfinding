import { COLOR, State } from "../type";
import { Graph } from "../dataStructures/Graph";
import { PathFindingAlgorithm } from "../util/pathFindingAlgorithms";
import { PQueue } from "../dataStructures/PriorityQueue";
import { Cell } from "../util/cell";
import { colors } from "../util/colors";

export class Astar implements PathFindingAlgorithm {
  private visited: Set<number> = new Set();
  private gScore: Map<number, number> = new Map(); // map(index,dist)
  private Pqueue: PQueue<Cell> = new PQueue();
  private previous: Map<number, Cell> = new Map();

  // Correctly defining the generator function
  *findPath(graph: Graph, start: Cell, end: Cell): Generator<State> {
    console.log("running A*")

    // clear prev data
    this.reset()
    this.gScore = new Map(); // map(index,dist)

    this.visited.add(graph.toNumber(start));

    const hScore = graph.getWeight(start, end)
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

      this.visited.add(graph.toNumber(current));

      for (const cell of neighbors) {
        if (this.visited.has(graph.toNumber(cell))) continue;


        const currentWeight = graph.getWeight(current, cell)
        const runningWeight = currentWeight + this.gScore.get(graph.toNumber(current))
        const prevWeight = this.gScore.get(graph.toNumber(cell))

        let color: COLOR
        let weight: number

        if (!prevWeight || prevWeight > runningWeight) { // if there is prev weight and it is greater than the current
          this.gScore.set(graph.toNumber(cell), runningWeight)
          const hScore = graph.getWeight(cell, end)

          const fScore = this.gScore.get(graph.toNumber(cell)) + hScore

          color = colors.primary as COLOR
          weight = fScore

          this.previous.set(graph.toNumber(cell), current);
          this.Pqueue.enqueue(cell, fScore)
        }
        else {

          color = colors.secondary as COLOR
          const hScore = graph.getWeight(cell, end)
          weight = prevWeight + hScore
        }
        if (graph.toNumber(cell) === graph.toNumber(end)) {
          found = true
          break
        }

        cell.highlight(color)
        cell.text = weight.toFixed(1)
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
      }
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

    graph.highlighightConnection(prevCell, end)
    console.log("reconstructing path");

    while (prevCell && graph.toNumber(prevCell) !== graph.toNumber(start)) {

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
      const nextCell = this.previous.get(graph.toNumber(prevCell));
      if (nextCell)
        graph.highlighightConnection(nextCell, prevCell)
      prevCell = nextCell
    }

    if (prevCell)
      graph.highlighightConnection(start, prevCell)
    path.push(start);
    return path;
  }
}

