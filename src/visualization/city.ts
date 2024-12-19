import p5 from "p5";
import { CellType, CityData, COLOR } from "../type";
import { Cell } from "../util/cell";
import { colors } from "../util/colors";
import { Arrow } from "./arrow";
import { Action } from "../util/action";
import { lerpColor } from "../util/util";

export class City implements Cell {
  name: string
  coordLocation: { x: number, y: number }
  location: { x: number, y: number }
  project: Function

  cellSize: number
  color
  neighbors: { cell: Cell, weight: number, arrow: Arrow }[] = []
  type: CellType = "normal"
  text: string = ""
  textSize: number = 20
  addGlow: boolean = false

  constructor(data: CityData, project: Function, cellSize: number) {
    this.name = data.name
    this.coordLocation = { x: data.location[0], y: data.location[1] }
    this.location = project(this.coordLocation)
    this.project = project
    this.color = colors.background as COLOR
    this.cellSize = cellSize
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
  highlight(percent: number): Action {
    console.log(percent)
    const color = lerpColor(colors.primary as COLOR, colors.background as COLOR, percent)
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
      p.drawingContext.shadowBlur = 30
      p.circle(this.location.x, this.location.y, this.cellSize)
      p.circle(this.location.x, this.location.y, this.cellSize)
      p.circle(this.location.x, this.location.y, this.cellSize)
      p.circle(this.location.x, this.location.y, this.cellSize)
      const textSize = p.map(this.cellSize, 0, 50, 2, 20) // TODO: adjust text size
      this.showText(this.text, textSize, p)
    }
    if (this.type == "highlight") {
      p.drawingContext.shadowColor = colors.background_color[500]
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
    if (this.type == "path") {
      p.fill(colors.path as COLOR)
      p.stroke(colors.path)
    }
    if (this.type == "start") {
      p.fill(colors.start as COLOR)
      p.stroke(colors.start)
    }
    if (this.type == "end") {
      p.fill(colors.end as COLOR)
      p.stroke(colors.end)
    }
    p.textSize(size)
    p.textAlign(p.CENTER)
    p.text(text, this.location.x, this.location.y)

    p.pop()
  }

  resize(width: number, height: number) {
    this.location = this.project(this.coordLocation)
    this.cellSize = Math.min(width, height) / 30
    for (let neighbor of this.neighbors) {
      neighbor.arrow.resize(width, height)
    }
  }
}
