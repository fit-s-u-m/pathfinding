import p5 from "p5";
import { CellType, CityData, COLOR } from "../type";
import { Cell } from "../util/cell";
import { colors } from "../util/colors";
import { Arrow } from "./arrow";

export class City implements Cell {
  name: string
  coordLocation: { x: number, y: number }
  location: { x: number, y: number }
  project: Function

  radius = 30
  color
  neighbors: { cell: Cell, weight: number, arrow: Arrow }[] = []
  type: CellType = "normal"
  text: string = ""
  addGlow: boolean = false

  constructor(data: CityData, project: Function) {
    this.name = data.name
    this.coordLocation = { x: data.location[0], y: data.location[1] }
    this.location = project(this.coordLocation)
    this.project = project
    this.color = colors.background as COLOR
  }
  makeConnection(city: City, weight: number): void {
    const arrow = new Arrow(this, city, weight)
    this.neighbors.push({ cell: city, weight, arrow })
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
    this.addGlow = true
  }
  beNormal(): void {
    this.type = "normal"
    this.color = colors.background as COLOR
    this.addGlow = false
  }


  getObstacles(): Cell[] {
    return this.neighbors.filter(neighbor => neighbor.cell.type === "obstacle").map(neighbor => neighbor.cell)
  }
  getType() {
    return this.type
  }
  highlight(color: COLOR): void {
    this.color = color
    this.type = "highlight"
  }
  highlightArrow(p: p5) {
    this.neighbors.forEach(neighbor => {
      neighbor.arrow.showHighlight(p)
    })
  }
  showDistance(getDistance: Function, p: p5) {
    this.neighbors.forEach(neighbor => {
      const distance = getDistance(neighbor.cell, this) as number
      const size = 20
      neighbor.arrow.drawDistance(p, distance.toFixed(0), size, colors.accent as COLOR)
    })
  }
  isInCell(x: number, y: number) {
    return Math.sqrt((x - this.location.x) ** 2 + (y - this.location.y) ** 2) <= this.radius
  }
  show(p: p5) {
    p.push()
    if (this.addGlow) {
      p.drawingContext.shadowColor = "red"
      p.drawingContext.shadowBlur = 10
      p.drawingContext.shadowColor = "yellow"
      p.drawingContext.shadowBlur = 30
      p.drawingContext.shadowColor = "yellow"
      p.drawingContext.shadowBlur = 50
      p.circle(this.location.x, this.location.y, this.radius)
      p.circle(this.location.x, this.location.y, this.radius)
    }
    p.fill(this.color)
    p.circle(this.location.x, this.location.y, this.radius)
    p.pop()
    for (let neighbor of this.neighbors) {
      neighbor.arrow.show(p)
    }
  }
  getNeighbor(name: string) {
    return this.neighbors.filter(neighbor => neighbor.cell.name === name).pop()
  }
  showText(text: string, size: number, p: p5): void {
    this.name = text
    p.push()
    p.fill("black")
    p.textSize(size)
    p.textAlign(p.CENTER)
    p.text(this.name, this.location.x, this.location.y)
    p.pop()
  }

  resize() {
    this.location = this.project(this.coordLocation)
  }
}
