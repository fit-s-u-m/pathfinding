import { Graph } from "../dataStructures/Graph";
import { CellType } from "../type";
import { City } from "./city";
import { Cell } from "../util/cell";
import p5 from "p5";

export class Country implements Graph {
  start: Cell | null = null;
  end: Cell | null = null;
  cellType: CellType = "normal"

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
        if (this.start) this.start.beNormal()
        city.beStart()
        this.start = city
      }
    }
  }
  setEnd(x: number, y: number): void {
    for (let city of this.cities) {
      if (city.isInCell(x, y)) {
        if (this.end) this.end.beNormal()
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
  highlighightConnection(start: City, end: City): void {
    const neighbor = start.getNeighbor(end.name)
    console.log(neighbor)
    if (neighbor)
      neighbor.arrow.bePath()
  }

  getObstacles(): Cell[] {
    return this.cities.filter(city => city.type === "obstacle")
  }
  getHighlights(): Cell[] {
    return this.cities.filter(city => city.type === "highlight")
  }
  getWeight(cell1: Cell, cell2: Cell): number {
    return Math.sqrt((cell1.location.x - cell2.location.x) ** 2 + (cell1.location.y - cell2.location.y) ** 2)
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
    return this.cities.filter((city: City) => city.isInCell(x, y)).pop() // get last
  }

  onMouseHover(x: number, y: number, p: p5) {
    const city = this.getCell(x, y)
    if (city) {
      p.cursor(p.CROSS)
      city.showText(city.name, 40, p)
      city.highlightArrow(p)
      city.showDistance(this.getActualDistance.bind(this), p)
      for (let neighbors of city.neighbors) {
        neighbors.cell.showText(neighbors.cell.name, 12, p)
      }
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
    for (let city of this.cities) {
      city.show(p)
    }
  }

  clearHighlight(): void {
    for (let city of this.cities) {
      if (city.type === "path" || city.type === "highlight")
        city.beNormal()
    }
  }
  clearGraph(): void {
    for (let city of this.cities) {
      city.beNormal()
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
