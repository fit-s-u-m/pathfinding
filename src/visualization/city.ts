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

  constructor(data: CityData, project: Function) {
    this.name = data.name
    this.location = { x: data.location[0], y: data.location[1] }
    this.canvasPosition = project(this.location)
    this.project = project
    // const random = (x: number) => x * Math.random()
    this.color = colors.background as COLOR
  }
  makeConnection(city: City) {
    this.neighbors.push(city)
  }

  beEnd(): void {
    this.type = "end"
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
  arrow(startX: number, startY: number, endX: number, endY: number, p: p5) {
    const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2)
    const angle = Math.atan2((endY - startY), (endX - startX))
    const triangleSize = 10
    p.push()
    p.rotate(angle)
    p.stroke(this.color)
    p.line(startX, startY, startX + radius, startY)
    p.triangle(startX + radius, startY, startX + radius - triangleSize, startY + triangleSize, startX + radius - triangleSize, startY - triangleSize)
    p.pop()
  }
  show(p: p5) {
    p.fill(this.color)
    p.circle(this.canvasPosition.x, this.canvasPosition.y, this.radius)
    for (let city of this.neighbors) {
      this.arrow(this.canvasPosition.x, this.canvasPosition.y, city.canvasPosition.x, city.canvasPosition.y, p)
    }
  }
  showText(text: string, p: p5): void {
    this.name = text
    p.textAlign(p.CENTER)
    p.text(this.name, this.location.x, this.location.y)
  }
  isInCell(x: number, y: number) {
    return Math.sqrt((x - this.canvasPosition.x) ** 2 + (y - this.canvasPosition.y)) <= this.radius
  }

  resize() {
    this.canvasPosition = this.project(this.location)
  }
}
