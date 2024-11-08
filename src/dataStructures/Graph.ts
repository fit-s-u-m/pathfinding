import p5 from "p5";
import { HIGHLIGHT } from "../type";
import { Cell } from "../util/cell";

export interface Graph {
  start: Cell | null
  end: Cell | null
  currentScan: Cell | null
  highlightCell: Map<number, HIGHLIGHT>
  algorithsmPathCells: Cell[]

  getWeight(cell1: Cell, cell2: Cell): number

  toNumber(cell: Cell): number
  toCell(num: number): Cell | undefined

  getObstacles(): Cell[]

  setStart(x: number, y: number): void
  setEnd(x: number, y: number): void
  addObstacle(x: number, y: number): void
  addPathCell(cell: Cell): void

  show(p: p5): void
  resize(width: number, height: number): void
}
