import p5 from "p5";
import { CellType, CityData, COLOR } from "../type";
import { Cell } from "../util/cell";
import { colors } from "../util/colors";
import { Arrow } from "./arrow";
import { Action } from "../util/action";

export class City implements Cell {
  name: string
  coordLocation: { x: number, y: number }
  location: { x: number, y: number }
  project: Function

  cellSize = 30
  color
  neighbors: { cell: Cell, weight: number, arrow: Arrow }[] = []
  type: CellType = "normal"
  text: string = ""
  textSize: number = 20
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
  }
  beNormal(): void {
    this.type = "normal"
    this.color = colors.background as COLOR
  }


  getObstacles(): Cell[] {
    return this.neighbors.filter(neighbor => neighbor.cell.type === "obstacle").map(neighbor => neighbor.cell)
  }
  getType() {
    return this.type
  }
  highlight(color: COLOR): Action {
    const beHighlight = (color: COLOR) => {
      this.color = color
      this.type = "highlight"
    }
    const action = new Action(beHighlight.bind(this, color), this.beNormal.bind(this))
    action.do()
    return action
  }
  highlightArrow(p: p5) {
    this.neighbors.forEach(neighbor => {
      neighbor.arrow.showHighlight(p)
    })
  }
  showDistance(p: p5, getDistance: Function, size: number) {
    this.neighbors.forEach(neighbor => {
      const distance = getDistance(neighbor.cell, this) as number
      neighbor.arrow.drawDistance(p, distance.toFixed(0), size)
    })
  }
  isInCell(x: number, y: number) {
    return Math.sqrt((x - this.location.x) ** 2 + (y - this.location.y) ** 2) <= this.cellSize
  }
  foucus(p: p5) {
    p.fill(colors.background)
    p.circle(this.location.x, this.location.y, this.cellSize)
  }
  show(p: p5) {
    p.push()
    if (this.type == "path") {
      p.drawingContext.shadowColor = "yellow"
      p.drawingContext.shadowBlur = 50
      p.circle(this.location.x, this.location.y, this.cellSize)
      p.circle(this.location.x, this.location.y, this.cellSize)
      p.circle(this.location.x, this.location.y, this.cellSize)
      p.circle(this.location.x, this.location.y, this.cellSize)
      const textSize = p.map(this.cellSize, 0, 50, 2, 20) // TODO: adjust text size
      this.showText(this.text, textSize, p)
    }
    if (this.type == "highlight") {
      p.drawingContext.shadowColor = "orange"
      p.drawingContext.shadowBlur = 20
      p.circle(this.location.x, this.location.y, this.cellSize)
      const textSize = p.map(this.cellSize, 0, 50, 2, 20) // TODO: adjust text size
      this.showText(this.text, textSize, p)

    }
    p.fill(this.color)
    p.circle(this.location.x, this.location.y, this.cellSize)
    p.pop()
    for (let neighbor of this.neighbors) {
      neighbor.arrow.show(p)
    }
  }
  getNeighbor(name: string) {
    return this.neighbors.filter(neighbor => neighbor.cell.name === name).pop()
  }
  showText(text: string, size: number, p: p5): void {
    p.push()

    p.fill(colors.text as COLOR)
    p.stroke(colors.black)
    p.textSize(size)
    p.textAlign(p.CENTER)
    p.text(text, this.location.x, this.location.y)

    p.pop()
  }

  resize() {
    this.location = this.project(this.coordLocation)
  }
}
