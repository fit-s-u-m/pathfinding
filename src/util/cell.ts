import p5 from "p5"
import { CellType } from "../type"
import { Arrow } from "../visualization/arrow"
import { Action } from "./action"

export interface Cell {
  location: { x: number, y: number }
  neighbors: { cell: Cell, weight: number, arrow: Arrow }[]
  type: CellType
  name: string
  text: string
  cellSize: number

  show(p: p5): void

  beStart(): void
  beEnd(): void
  beObstacle(): void
  beNormal(): void
  beInPath(): void

  isInCell(x: number, y: number): void

  showText(text: string, size: number, p: p5): void
  highlight(distance:number): Action

}
