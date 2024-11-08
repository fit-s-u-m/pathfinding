import { Graph } from "../dataStructures/Graph";
import { CellType, HIGHLIGHT } from "../type";
import { City } from "./city";
import { Cell } from "../util/cell";
import p5 from "p5";

export class Country implements Graph {
  start: Cell | null = null;
  end: Cell | null = null;
  cellType: CellType = "normal"

  highlightCell: Map<number, HIGHLIGHT> = new Map();
  algorithsmPathCells: Cell[] = [];
  currentScan: Cell | null = null;

  canvasWidth: number
  canvasHeight: number

  offsetX: number = 0
  offsetY: number = 0
  cities: City[] = []

  constructor(geoJson: any, canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    const cityDatas = geoJson.features
    for (let cityData of cityDatas) {
      const name = cityData.properties.name
      const location = cityData.geometry.coordinates
      this.cities.push(new City({ name, location }, this.project.bind(this))) // create cities
    }
  }
  setStart(x: number, y: number): void {
    for (let city of this.cities) {
      if (city.isInCell(x, y)) {
        city.beStart()
        this.start = city
      }
    }
  }
  setEnd(x: number, y: number): void {
    for (let city of this.cities) {
      if (city.isInCell(x, y)) {
        city.beEnd()
        this.end = city
      }
    }
  }
  addObstacle(x: number, y: number): void {
    for (let city of this.cities) {
      if (city.isInCell(x, y)) {
        city.beObstacle()
      }
    }

  }
  addPathCell(cell: Cell): void {
    this.algorithsmPathCells.push(cell)
    cell.beInPath()
  }

  getObstacles(): Cell[] {
    return this.cities.filter(city => city.type === "obstacle")
  }
  getWeight(cell1: Cell, cell2: Cell): number {
    return Math.sqrt((cell1.location.x - cell2.location.x) ** 2 + (cell1.location.y - cell2.location.y) ** 2)
  }

  makeNeighbors() {
    for (let city of this.cities) {
      for (let otherCity of this.cities) {
        if (city !== otherCity) {
          const distance = this.getWeight(city, otherCity)
          if (distance < 50) {
            city.makeConnection(otherCity)
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
    const x = ((longitude - centerLng) * scale) + this.offsetX + this.canvasWidth / 2;
    const y = ((centerLat - latitude) * scale) + this.offsetY + this.canvasHeight / 2;

    return { x, y };
  }

  toCell(num: number): Cell {
    return this.cities[num]
  }
  toNumber(cell: Cell): number {
    return this.cities.map(city => city.name).indexOf(cell.name)
  }
  getCell(x: number, y: number) {
    return this.cities.filter((city: City) => city.isInCell(x, y))[0]
  }

  onMouseMove(x: number, y: number, p: p5) {
    const city = this.getCell(x, y)
    if (city)
      city.showText(city.name, p)
  }

  show(p: p5): void {
    for (let city of this.cities) {
      city.show(p)
    }
  }
  resize(width: number, height: number): void {
    this.canvasWidth = width
    this.canvasHeight = height
    for (let city of this.cities) {
      city.resize()
    }
  }
}
