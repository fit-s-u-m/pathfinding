import p5 from "p5";
import { Cell } from "../util/cell";
import { colors } from "../util/colors";
import { COLOR } from "../type";
import { ArrowType } from "../type";

export class Arrow {
  arrowType: ArrowType = "normal"
  color: COLOR = colors.secondary as COLOR
  thickness: number = 5
  weight: number
  start: Cell | null
  end: Cell | null
  triangleSize: number = 10
  constructor(start: Cell, end: Cell, weight: number) {
    this.start = start
    this.end = end
    this.weight = weight
  }
  drawTraingle(p: p5, color: COLOR) {
    if (!this.start || !this.end) return
    const startX = this.start.location.x
    const startY = this.start.location.y
    const endX = this.end.location.x
    const endY = this.end.location.y

    // const radius = Math.abs(Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2) - this.end.cellSize / 2)
    const radius = Math.abs(Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2))
    const angle = Math.atan2((endY - startY), (endX - startX))
    p.push()

    p.stroke(color)
    p.strokeWeight(this.thickness)

    p.translate(startX, startY)
    p.rotate(angle)
    if (this.arrowType === "path")
      p.strokeWeight(this.thickness * 1.5)
    p.line(0, 0, radius, 0)
    p.fill(color)
    p.triangle(radius, 0, radius - this.triangleSize, this.triangleSize / 2, radius - this.triangleSize, -this.triangleSize / 2)

    p.pop()

  }
  drawDistance(p: p5, distance: string, size: number) {
    if (!this.start || !this.end) return
    const startX = this.start.location.x
    const startY = this.start.location.y
    const endX = this.end.location.x
    const endY = this.end.location.y

    const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2)
    const angle = Math.atan2((endY - startY), (endX - startX))
    p.push()

    p.translate(startX, startY)
    p.rotate(angle)
    p.textSize(size)
    //TODO: find nice colors
    p.stroke("black")
    p.fill("black")
    p.textAlign(p.CENTER)

    if (Math.abs(angle) <= Math.PI * 3 / 2 && Math.abs(angle) >= Math.PI / 2) { // rotate 180
      p.translate(radius / 2, 0)
      p.rotate(Math.PI)
      p.text(distance, 0, 0)
    }
    else
      p.text(distance, radius / 2, 0)

    p.pop()
  }

  show(p: p5) {
    const alpha = p.map(this.weight, 0, 1, 255, 0) // TODO: make it have contrast
    let color = this.color.slice(0, 3) as number[]

    this.drawTraingle(p, [...color, alpha] as COLOR)
  }
  showHighlight(p: p5) {
    if (this.arrowType == "path") return

    this.drawTraingle(p, colors.background_color[100] as COLOR)
  }
  bePath() {
    this.arrowType = "path"
    this.color = colors.path as COLOR
    this.thickness = 10
  }
  clearData() {
    this.start = null
    this.end = null
    this.weight = 0
    this.arrowType = "normal"
    this.color = colors.secondary as COLOR
    this.thickness = 1
  }
  beNormal() {
    this.arrowType = "normal"
    this.color = colors.secondary as COLOR
    this.thickness = 1
  }
  resize(width: number, height: number) {
    this.thickness = Math.min(width, height) / 200
    this.triangleSize = Math.min(width, height) / 100
  }

}
