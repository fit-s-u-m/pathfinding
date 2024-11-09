import p5 from "p5"
import { CellType, COLOR } from "../type"
import { Cell } from "../util/cell"
import { colors } from "../util/colors"
import { Arrow } from "./arrow"

export class GridCell implements Cell {
  location: { x: number, y: number }
  neighbors: { cell: GridCell, weight: number, arrow: Arrow }[] = []
  name: string = ""
  text: string = ""
  type: CellType = "normal"
  color: COLOR = colors.background as COLOR
  cellSize: number
  row: number
  col: number

  constructor(x: number, y: number, cellSize: number, row: number, col: number, name: string) {
    this.location = { x, y }
    this.cellSize = cellSize
    this.row = row
    this.col = col
    this.name = name
  }
  show(p: p5) {
    p.fill(this.color)
    p.square(this.location.x - this.cellSize / 2, this.location.y - this.cellSize / 2, this.cellSize)
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
    this.color = colors.path_grid as COLOR
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
  getNeighbor(name: string) {
    return this.neighbors.filter(neighbor => neighbor.cell.name === name).pop()
  }

  showText(text: string, size: number, p: p5) {
    this.text = text
    p.fill("black")
    p.textAlign(p.CENTER)
    p.textSize(size)
    p.text(this.text, this.location.x, this.location.y)

    if (this.type != "obstacle") {
      for (let neighbor of this.neighbors) {
        if (neighbor.cell.type != "obstacle") {
          neighbor.arrow.show(p)
          const size = this.cellSize / 4
          neighbor.arrow.drawDistance(p, neighbor.weight.toFixed(1), size)
        }
      }

    }
  }

}
