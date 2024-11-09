import p5 from "p5";
import { Cell } from "../util/cell";

export interface Graph {
  start: Cell | null
  end: Cell | null
  currentScan: Cell | null
  algorithsmPathCells: Cell[]

  createNeighbors(): void

  getWeight(cell1: Cell, cell2: Cell): number

  toNumber(cell: Cell): number
  toCell(num: number): Cell | undefined

  getObstacles(): Cell[]

  setStart(x: number, y: number): void
  setEnd(x: number, y: number): void
  addObstacle(x: number, y: number): void
  addPathCell(cell: Cell): void

  onMouseMove(x: number, y: number, p: p5): void

  clearHighlight(): void
  clearGraph(): void

  show(p: p5): void
  resize(width: number, height: number): void
}