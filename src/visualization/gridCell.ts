import p5 from "p5"
import { CellType, COLOR } from "../type"
import { Cell } from "../util/cell"
import { colors } from "../util/colors"

export class GridCell implements Cell {
  location: { x: number, y: number }
  neighbors: GridCell[] = []
  name: string = ""
  type: CellType = "normal"
  color: COLOR = [255, 255, 255, 255]
  cellSize: number
  row: number
  col: number

  constructor(x: number, y: number, cellSize: number, row: number, col: number) {
    this.location = { x, y }
    this.cellSize = cellSize
    this.row = row
    this.col = col
  }
  show(p: p5) {
    p.fill(this.color)
    p.square(this.location.x, this.location.y, this.cellSize)

  }
  beNormal(): void {
    this.type = "normal"
    this.color = colors.background as COLOR
  }

  beStart(): void {
    this.type = "start"
    this.color = colors.start as COLOR
  }
  beEnd(): void {
    this.type = "end"
    this.color = colors.end as COLOR
  }
  beObstacle(): void {
    this.type = "obstacle"
    this.color = colors.obstacle as COLOR
  }
  beInPath(): void {
    this.type = "path"
    this.color = colors.path as COLOR
  }
  highlight(color: COLOR) {
    this.type = "highlight"
    this.color = color
  }
  isInCell(x: number, y: number) {
    const xBound = x - this.location.x > 0 && x - this.location.x < this.cellSize
    const yBound = y - this.location.y > 0 && y - this.location.y < this.cellSize
    return xBound && yBound
  }

  showText(text: string, p: p5) {
    this.name = text
    p.fill("black")
    p.textAlign(p.CENTER)
    p.text(this.name, this.location.x + this.cellSize / 2, this.location.y + this.cellSize / 2)
  }

}
