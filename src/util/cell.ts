import p5 from "p5"
import { CellType, COLOR } from "../type"

export interface Cell {
  location: { x: number, y: number }
  neighbors: Cell[]
  type: CellType
  name: string

  show(p: p5): void

  beStart(): void
  beEnd(): void
  beObstacle(): void
  beNormal(): void
  beInPath(): void

  isInCell(x: number, y: number): void

  showText(text: string, p: p5): void
  highlight(color: COLOR): void

}
