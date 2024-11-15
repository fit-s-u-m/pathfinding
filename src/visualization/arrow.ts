import p5 from "p5";
import { Cell } from "../util/cell";
import { colors } from "../util/colors";
import { COLOR } from "../type";
import { ArrowType } from "../type";

export class Arrow {
  arrowType: ArrowType = "normal"
  color: COLOR = colors.secondary as COLOR
  thickness: number = 1
  weight: number
  start: Cell
  end: Cell
  constructor(start: Cell, end: Cell, weight: number) {
    this.start = start
    this.end = end
    this.weight = weight
  }
  drawTraingle(p: p5, color: COLOR, thickness: number) {
    const startX = this.start.location.x
    const startY = this.start.location.y
    const endX = this.end.location.x
    const endY = this.end.location.y

    const radius = Math.abs(Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2) - this.end.cellSize / 2)
    const angle = Math.atan2((endY - startY), (endX - startX))
    const triangleSize = 10
    p.push()

    p.stroke(color)
    p.strokeWeight(thickness)
    p.fill("black")

    p.translate(startX, startY)
    p.rotate(angle)
    if (this.arrowType === "path") {
      p.strokeWeight(this.thickness)
      p.fill(this.color)
    }
    p.line(0, 0, radius, 0)
    p.triangle(radius, 0, radius - triangleSize, triangleSize / 2, radius - triangleSize, -triangleSize / 2)

    p.pop()

  }
  drawDistance(p: p5, distance: string, size: number) {
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
    p.stroke(colors.primary)
    p.noFill()
    p.textAlign(p.CENTER)
    if (Math.abs(angle) <= Math.PI * 3 / 2 && Math.abs(angle) >= Math.PI / 2) { // rotate 180
      p.translate(radius / 2, 0)
      p.rotate(Math.PI)
      p.text(distance, 0, 0)
    }
    else {
      p.text(distance, radius / 2, 0)
    }

    p.pop()
  }

  show(p: p5) {

    const alpha = p.map(this.weight, 0, 1, 200, 0)
    let color = this.color.slice(0, 3) as number[]
    const thickness = p.map(this.weight, 0, 1, 5, 0)

    this.drawTraingle(p, [...color, alpha] as COLOR, thickness)

  }
  showHighlight(p: p5) {
    if (this.arrowType == "path") return
    // const alpha = p.map(this.weight, 0, 1, 200, 0)
    let color = colors.accent.slice(0, 3) as number[]
    const thickness = p.map(this.weight, 0, 1, 5, 0)

    this.drawTraingle(p, [...color, 255] as COLOR, thickness)
  }
  bePath() {
    this.arrowType = "path"
    this.color = colors.path as COLOR
    this.thickness = 10
  }
  beNormal() {
    this.arrowType = "normal"
    this.color = colors.secondary as COLOR
    this.thickness = 1
  }

}
