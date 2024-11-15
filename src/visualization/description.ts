import p5 from "p5"
import { colors } from "../util/colors"
import { Cell } from "../util/cell"
export class Description {
  xPos: number = 0
  yPos: number = 0
  width: number = 0
  height: number = 0
  project: Function
  startLong: number
  endLat: number
  margin: number = 10
  fontSize: number = 16
  constructor(startLong: number, endLat: number, canvasWidth: number, canvasHeight: number, project: Function) {
    this.startLong = startLong
    this.endLat = endLat
    this.project = project

    this.updateSize(canvasWidth, canvasHeight)
  }
  show(p: p5, city: Cell, neighbors: { cell: Cell, dist: number }[]) {
    if (this.width < 300) return

    p.fill("black")
    p.stroke("white")
    p.translate(this.xPos, this.yPos)
    p.rect(0, 0, this.width, this.height)

    p.fill("white")
    p.textAlign(p.CENTER)
    p.textSize(this.fontSize * 2)
    p.text(city.name, this.width / 2, this.margin * 4)


    p.textAlign(p.LEFT)
    p.translate(this.margin * 3, this.width / 4)
    p.textSize(this.fontSize)

    // Neighbors
    p.fill(colors.secondary)
    p.stroke(colors.secondary)
    p.textSize(this.fontSize * 1.5)
    p.text("Neighbors", 0, 0)

    for (let i = 0; i < neighbors.length; i++) {
      let yPos = (p.textSize() * 1.5 + this.margin) * (i + 1)
      let xPos = this.margin * 2
      p.textSize(this.fontSize)

      p.textAlign(p.LEFT)
      p.text(neighbors[i].cell.name, xPos, yPos)

      p.textAlign(p.RIGHT)
      p.text(neighbors[i].dist.toFixed(1), this.width - this.margin * 4, yPos)
    }
  }
  resize(canvasWidth: number, canvasHeight: number) {
    this.updateSize(canvasWidth, canvasHeight)
  }
  updateSize(canvasWidth: number, canvasHeight: number) {
    this.xPos = this.project({ x: this.startLong, y: 0 }).x + this.margin
    this.yPos = this.margin
    this.width = canvasWidth - this.xPos - (this.margin * 2)
    this.height = canvasHeight - (this.margin * 2)
    this.fontSize = Math.max(16, Math.min(this.width / 30, this.height / 20))
  }

}
