import p5 from "p5";
import { CellType, CityData, COLOR } from "../type";
import { Cell } from "../util/cell";
import { colors } from "../util/colors";

export class City implements Cell {
  name: string
  location: { x: number, y: number }
  canvasPosition: { x: number, y: number }
  project: Function

  radius = 30
  color
  neighbors: City[] = []
  type: CellType = "normal"

  arrowColor: string = "black"
  arrowSize: number = 2

  constructor(data: CityData, project: Function) {
    this.name = data.name
    this.location = { x: data.location[0], y: data.location[1] }
    this.canvasPosition = project(this.location)
    this.project = project
    this.color = colors.background as COLOR
  }
  makeConnection(city: City, weight: number): void {
    this.neighbors.push(city)
  }

  beEnd(): void {
    this.type = "end"
    this.color = colors.end as COLOR
  }
  beStart(): void {
    this.type = "start"
    this.color = colors.start as COLOR
  }
  beObstacle(): void {
    this.type = "obstacle"
    this.color = colors.obstacle as COLOR
  }
  beInPath(): void {
    this.type = "path"
    this.color = colors.path as COLOR
  }
  beNormal(): void {
    this.type = "normal"
    this.color = colors.background as COLOR
  }


  getObstacles(): Cell[] {
    return this.neighbors.filter(city => city.type === "obstacle")
  }
  getType() {
    return this.type
  }
  highlight(color: COLOR): void {
    this.color = color
  }
  isInCell(x: number, y: number) {
    return Math.sqrt((x - this.canvasPosition.x) ** 2 + (y - this.canvasPosition.y) ** 2) <= this.radius
  }


  drawArrow(startX: number, startY: number, endX: number, endY: number, p: p5) {
    const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2)
    const angle = Math.atan2((endY - startY), (endX - startX))
    const triangleSize = 10
    p.push()
    p.translate(startX, startY)
    p.rotate(angle)
    p.strokeWeight(this.arrowSize)
    // p.fill(this.arrowColor)
    p.stroke(colors.accent as COLOR)
    p.line(0, 0, radius, 0)
    p.triangle(radius, 0, radius - triangleSize, triangleSize / 2, radius - triangleSize, -triangleSize / 2)
    p.pop()
  }
  show(p: p5) {
    p.fill(this.color)
    p.circle(this.canvasPosition.x, this.canvasPosition.y, this.radius)
    for (let city of this.neighbors) {
      this.drawArrow(this.canvasPosition.x, this.canvasPosition.y, city.canvasPosition.x, city.canvasPosition.y, p)
    }
  }
  showText(text: string, p: p5): void {
    this.name = text
    p.fill("black")
    p.textSize(30)
    p.textAlign(p.CENTER)
    p.text(this.name, this.canvasPosition.x, this.canvasPosition.y)
  }

  resize() {
    this.canvasPosition = this.project(this.location)
  }
}
