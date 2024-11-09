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

      const neighbors = current.neighbors
        .map(neighbor => neighbor.cell)
        .filter((cell: Cell) => cell.type !== "obstacle")
        .filter((cell: Cell) => !this.visited.has(graph.toNumber(cell)));

      this.visited.add(graph.toNumber(current));

      for (const cell of neighbors) {
        if (this.visited.has(graph.toNumber(cell))) continue;


        const currentWeight = graph.getWeight(current, cell)
        const runningWeight = currentWeight + this.shortestDistance.get(graph.toNumber(current))
        const prevWeight = this.shortestDistance.get(graph.toNumber(cell))

        console.log("running weight", runningWeight, "prev Weight", prevWeight, cell)

        let color: COLOR
        let weight: number

        if (!prevWeight || prevWeight > runningWeight) { // if there is prev weight and it is greater than the current
          this.previous.set(graph.toNumber(cell), current);
          this.shortestDistance.set(graph.toNumber(cell), runningWeight)

          color = colors.primary as COLOR
          weight = runningWeight

          this.queue.enqueue(cell);
          console.log("Found shortest", runningWeight, "at ", cell);
        }
        else {

          color = colors.secondary as COLOR
          weight = prevWeight

          console.log("shortest", prevWeight, "at ", cell);
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
    this.queue = new Queue();
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

