import { Graph } from "../dataStructures/Graph";
import { ArrowType, CellType, COLOR } from "../type";
import { City } from "./city";
import { Cell } from "../util/cell";
import p5 from "p5";
import { Arrow } from "./arrow";
import { History } from "../util/history";
import { Action } from "../util/action";
import { colors } from "../util/colors";
import { Description } from "./description";

export class Country implements Graph {
  start: City | null = null;
  end: City | null = null;
  cellType: CellType = "normal"
  description: Description

  algorithsmPathCells: Cell[] = [];
  currentScan: Cell | null = null;

  canvasWidth: number
  canvasHeight: number
  highlightedArrows: Arrow[] = []

  cities: City[] = []
  countryDatas: [number, number][] = []

  constructor(geoJsonCities: any, geoJsonCountry: any, canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    const cityDatas = geoJsonCities.features
    const countryDatas = geoJsonCountry.geometry.coordinates
    this.countryDatas = countryDatas

    // Create cities
    for (let cityData of cityDatas) {
      const name = cityData.properties.name
      const location = cityData.geometry.coordinates
      this.cities.push(new City({ name, location }, this.project.bind(this)))
    }

    // define the description bounds
    const mostLeft = Math.max(...this.countryDatas.map(coord => coord[0]))
    const mostBottom = Math.min(...this.countryDatas.map(coord => coord[1]))
    this.description = new Description(mostLeft, mostBottom, canvasWidth, canvasHeight, this.project.bind(this))
  }
  setStart(x: number, y: number): void {
    const cell = this.getCell(x, y)

    if (cell) {
      const startDoFunc = (city: City) => {
        if (this.start)
          this.start.beNormal()
        city.beStart()
        this.start = city
      }
      const startUndoFunc = (city: City, prevStart: City | null, cellPrevType: CellType, cellPrevColor: COLOR) => {
        if (prevStart)
          prevStart.beStart()
        city.type = cellPrevType
        city.color = cellPrevColor
        this.start = prevStart // if there is no prevStart, it will be null
      }

      const action = new Action(startDoFunc.bind(this, cell), startUndoFunc.bind(this, cell, this.start, cell.type, cell.color))
      action.do()
      History.getInstance().saveState(action)
    }
  }
  setEnd(x: number, y: number): void {
    const cell = this.getCell(x, y)
    if (cell) {
      const endDoFunc = (cell: City) => {
        if (this.end)
          this.end.beNormal()
        cell.beEnd()
        this.end = cell
      }
      const endUndoFunc = (cell: City, prevEnd: City | null, cellPrevType: CellType, cellPrevColor: COLOR) => {
        if (prevEnd)
          prevEnd.beEnd()
        cell.type = cellPrevType
        cell.color = cellPrevColor
        this.end = prevEnd
      }

      const action = new Action(endDoFunc.bind(this, cell), endUndoFunc.bind(this, cell, this.end, cell.type, cell.color))
      action.do()
      History.getInstance().saveState(action)
    }
  }
  addObstacle(x: number, y: number): Action | null {
    const cell = this.getCell(x, y)
    if (cell && cell.type != "obstacle") {
      const undo = (prevColor: COLOR, prevType: CellType) => {
        cell.type = prevType
        cell.color = prevColor
      }
      const action = new Action(cell.beObstacle.bind(cell), undo.bind(cell, cell.color, cell.type))
      action.do()
      return action
    }
    else
      return null
  }
  addPathCell(cell: City): Action {
    this.algorithsmPathCells.push(cell)

    const undo = (prevColor: COLOR, prevType: CellType) => {
      cell.type = prevType
      cell.color = prevColor
    }
    const action = new Action(cell.beInPath.bind(cell), undo.bind(cell, cell.color, cell.type))
    action.do()
    return action
  }
  highlighightConnection(start: City, end: City): Action {
    const neighbor = start.getNeighbor(end.name)
    console.log(neighbor)
    if (neighbor) {
      const undo = (prevColor: COLOR, prevType: ArrowType) => {
        neighbor.arrow.arrowType = prevType
        neighbor.arrow.color = prevColor
      }
      const action = new Action(neighbor.arrow.bePath.bind(neighbor.arrow), undo.bind(neighbor, neighbor.arrow.color, neighbor.arrow.arrowType))
      this.highlightedArrows.push(neighbor.arrow)
      action.do()
      return action
    }
    else {
      return new Action(() => { }, () => { })
    }
  }

  getObstacles(): Cell[] {
    return this.cities.filter(city => city.type === "obstacle")
  }
  getHighlights(): Cell[] {
    return this.cities.filter(city => city.type === "highlight")
  }
  getDistance(cell1: City, cell2: City): number {
    return this.getActualDistance(cell1, cell2)
  }
  getNormalWeight(cell1: Cell, cell2: Cell): number {
    const minScren = Math.min(this.canvasWidth, this.canvasHeight)
    return Math.sqrt((cell1.location.x - cell2.location.x) ** 2 + (cell1.location.y - cell2.location.y) ** 2) / minScren
  }
  getActualDistance(city1: City, city2: City): number {
    return this.haversineDistance(
      city1.coordLocation.x, city1.coordLocation.y,
      city2.coordLocation.x, city2.coordLocation.y
    )
  }

  createNeighbors() {
    for (let city of this.cities) {
      for (let otherCity of this.cities) {
        if (city !== otherCity) {
          const weight = this.getNormalWeight(city, otherCity)
          const random = Math.random()
          if (city.type !== "obstacle" && otherCity.type !== "obstacle" && random < 0.5 && weight < 0.18) {
            city.makeConnection(otherCity, weight)
          }
        }
      }
    }
  }

  project(longLang: { x: number, y: number }) {
    // Define Ethiopia's approximate geographic bounds
    const minLng = 33;
    const maxLng = 48;
    const minLat = 3;
    const maxLat = 15;

    // Calculate the center coordinates of Ethiopia
    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;

    const longitude = longLang.x;
    const latitude = longLang.y;

    // Define map dimensions in degrees
    const mapWidth = maxLng - minLng;
    const mapHeight = maxLat - minLat;

    // Calculate scale factor to fit the map within the canvas while preserving aspect ratio
    const scale = 0.8 * Math.min(this.canvasWidth / mapWidth, this.canvasHeight / mapHeight);

    // Calculate x and y positions using the inverted scale, centering, and offset
    const x = ((longitude - centerLng) * scale) + this.canvasWidth / 2;
    const y = ((centerLat - latitude) * scale) + this.canvasHeight / 2;

    return { x, y };
  }

  toCell(num: number): Cell {
    return this.cities[num]
  }
  toNumber(cell: Cell): number {
    return this.cities.map(city => city.name).indexOf(cell.name)
  }
  getCell(x: number, y: number) {
    return this.cities.filter((city: City) => city.isInCell(x, y)).pop() // get last
  }

  onMouseHover(x: number, y: number, p: p5) {
    const minCanvas = Math.min(this.canvasWidth, this.canvasHeight)
    const size = p.map(minCanvas, 100, 1000, 2, 20)

    const city = this.getCell(x, y)
    if (city) {
      p.cursor(p.CROSS)
      city.textSize = size
      for (let neighbors of city.neighbors) {
        const neighboringCity = neighbors.cell as City
        neighboringCity.foucus(p)
        neighboringCity.showText(neighbors.cell.name, size, p)
      }
      city.highlightArrow(p)
      city.showDistance(p, this.getActualDistance.bind(this), size)
      city.showText(city.name, size * 2.5, p)
      this.description.show(p, city, city.neighbors.map(neighbor => ({ cell: neighbor.cell, dist: (this.getDistance(city, neighbor.cell as City)) })))
    }
  }
  private toRadians(degree: number) {
    return degree * Math.PI / 180
  }
  private haversineDistance(latitude1: number, longitude1: number, latitude2: number, longitude2: number) {
    const radius = 6371; // Earth's radius in kilometers

    // Convert the latitudes and longitudes from degrees to radians
    const firstLatitude = this.toRadians(latitude1);
    const secondLatitude = this.toRadians(latitude2);
    const latitudeDifference = this.toRadians(latitude2 - latitude1);
    const longitudeDifference = this.toRadians(longitude2 - longitude1);

    // Haversine formula calculation
    const a = Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
      Math.cos(firstLatitude) * Math.cos(secondLatitude) *
      Math.sin(longitudeDifference / 2) * Math.sin(longitudeDifference / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in kilometers
    const distance = radius * c;
    return distance;
  }


  show(p: p5): void {
    // ethiopia map
    p.beginShape()
    for (let coord of this.countryDatas) {
      const { x, y } = this.project({ x: coord[0], y: coord[1] })
      p.stroke("black")
      p.fill(colors.primary_color[900])
      p.vertex(x, y)
    }
    p.endShape()

    for (let city of this.cities) {
      city.show(p)
    }
  }

  clearHighlight(): void {
    for (let city of this.cities) {
      if (city.type === "path" || city.type === "highlight")
        city.beNormal()
    }
    for (let arrow of this.highlightedArrows) {
      arrow.beNormal()
    }
  }
  clearGraph(): void {
    for (let city of this.cities) {
      city.beNormal()
    }
    for (let arrow of this.highlightedArrows) {
      arrow.beNormal()
    }
  }
  resize(width: number, height: number): void {
    this.canvasWidth = width
    this.canvasHeight = height
    const min = Math.min(width, height)
    for (let city of this.cities) {
      city.cellSize = min / 30
      city.resize()
    }
    this.description.resize(width, height)
  }
}
