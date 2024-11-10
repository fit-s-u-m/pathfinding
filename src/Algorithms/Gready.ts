import { COLOR, State } from "../type";
import { Graph } from "../dataStructures/Graph";
import { PathFindingAlgorithm } from "../util/pathFindingAlgorithms";
import { Queue } from "../dataStructures/Queue";
import { PQueue } from "../dataStructures/PriorityQueue";
import { Cell } from "../util/cell";
import { colors } from "../util/colors";

export class Gready implements PathFindingAlgorithm {
  private visited: Set<number> = new Set();
  private Pqueue: PQueue<Cell> = new PQueue();
  private previous: Map<number, Cell> = new Map();

  // Correctly defining the generator function
  *findPath(graph: Graph, start: Cell, end: Cell): Generator<State> {
    console.log("running dijkstra")

    // clear prev data
    this.reset()

    this.visited.add(graph.toNumber(start));
    this.Pqueue.enqueue(start, 0);

    let found = false;

    while (!this.Pqueue.isEmpty() && !found) {
      const current = this.Pqueue.dequeue();
      graph.currentScan = current


      console.log(current, "current cell checking");
      if (!current) break;

      const neighbors = current.neighbors
        .map(neighbor => neighbor.cell)
        .filter((cell: Cell) => cell.type !== "obstacle")
        .filter((cell: Cell) => !this.visited.has(graph.toNumber(cell)));


      for (const cell of neighbors) {
        if (this.visited.has(graph.toNumber(cell))) continue;


        const currentWeight = graph.getWeight(end, cell)

        let color: COLOR = colors.secondary as COLOR

        this.Pqueue.enqueue(cell, currentWeight);
        this.visited.add(graph.toNumber(cell));
        this.previous.set(graph.toNumber(cell), current)

        if (graph.toNumber(cell) === graph.toNumber(end)) {
          found = true
          break
        }

        cell.highlight(color)
        cell.text = currentWeight.toFixed(1)

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


