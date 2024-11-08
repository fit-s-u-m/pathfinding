import p5 from "p5";
import { CellType, COLOR, HIGHLIGHT } from "../type";
import { Graph } from "../dataStructures/Graph";
import { Cell } from "./cell";
import { colors } from "./colors";

export class Grid implements Graph {
  canvasWidth: number;
  canvasHeight: number;

  start: GridCell | null = null;
  end: GridCell | null = null;

  numRow: number = 20;
  numCol: number = 20;
  cellSize: number;

  highlightCell: Map<number, HIGHLIGHT> = new Map();
  currentScan: GridCell | null = null
  algorithsmPathCells: GridCell[] = []

  offsetX: number;
  offsetY: number;

  cells: Map<number, GridCell> = new Map()
  constructor(canvasWidth: number, canvasHeight: number, numRow: number, numCol: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.numRow = numRow
    this.numCol = numCol

    this.cellSize = Math.min(this.canvasWidth / this.numCol, this.canvasHeight / this.numRow);
    this.offsetX = (this.canvasWidth - this.cellSize * this.numCol) / 2;
    this.offsetY = (this.canvasHeight - this.cellSize * this.numRow) / 2;

    this.makeGrid()
  }
  makeGrid() {
    for (let row = 0; row < this.numRow; row++) {
      for (let col = 0; col < this.numCol; col++) {
        const x = col * this.cellSize + this.offsetX;
        const y = row * this.cellSize + this.offsetY;
        const index = row * this.numCol + col
        const cell = new GridCell(x, y, this.cellSize, row, col)
        this.cells.set(index, cell)
      }
    }
    for (let row = 0; row < this.numRow; row++) {
      for (let col = 0; col < this.numCol; col++) {
        this.makeNeighbors(this.cells.get(row * this.numCol + col) as GridCell)
      }
    }
  }
  makeNeighbors(cell: GridCell) {
    const neighbors: GridCell[] = [];
    if (cell.row > 0) {
      const topNeighborCellIndex = (cell.row - 1) * this.numCol + cell.col
      const topNeighborCell = this.cells.get(topNeighborCellIndex) as GridCell
      if (topNeighborCell && topNeighborCell.type !== "obstacle") {
        neighbors.push(topNeighborCell);
        cell.neighbors.push(topNeighborCell)
      }
    }
    if (cell.col < this.numCol - 1 && cell.row > 0) {
      const topRightNeighborCellIndex = (cell.row - 1) * this.numCol + (cell.col + 1)
      const topRightNeighborCell = this.cells.get(topRightNeighborCellIndex)
      if (topRightNeighborCell && topRightNeighborCell.type !== "obstacle") {
        neighbors.push(topRightNeighborCell);
        cell.neighbors.push(topRightNeighborCell)
      }
    }
    if (cell.col < this.numCol - 1) {
      const rightNeighborCellIndex = (cell.row) * this.numCol + (cell.col + 1)
      const rightNeighborCell = this.cells.get(rightNeighborCellIndex)
      if (rightNeighborCell && rightNeighborCell.type !== "obstacle") {
        neighbors.push(rightNeighborCell);
        cell.neighbors.push(rightNeighborCell)
      }
    }
    if (cell.col < this.numCol - 1 && cell.row < this.numRow - 1) {
      const downRightNeighborCellIndex = (cell.row + 1) * this.numCol + (cell.col + 1)
      const downRightNeighborCell = this.cells.get(downRightNeighborCellIndex)
      if (downRightNeighborCell && downRightNeighborCell.type !== "obstacle") {
        neighbors.push(downRightNeighborCell);
        cell.neighbors.push(downRightNeighborCell)
      }
    }
    if (cell.row < this.numRow - 1) {
      const downNeighborCellIndex = (cell.row + 1) * this.numCol + cell.col
      const downNeighborCell = this.cells.get(downNeighborCellIndex)
      if (downNeighborCell && downNeighborCell.type !== "obstacle") {
        neighbors.push(downNeighborCell);
        cell.neighbors.push(downNeighborCell)
      }
    }
    if (cell.col > 0 && cell.row < this.numRow - 1) {
      const downLeftNeighborCellIndex = (cell.row + 1) * this.numCol + (cell.col - 1)
      const downLeftNeighborCell = this.cells.get(downLeftNeighborCellIndex)
      if (downLeftNeighborCell && downLeftNeighborCell.type !== "obstacle") {
        neighbors.push(downLeftNeighborCell);
        cell.neighbors.push(downLeftNeighborCell)
      }
    }
    if (cell.col > 0) {
      const leftNeighborCellIndex = (cell.row) * this.numCol + (cell.col - 1)
      const leftNeighborCell = this.cells.get(leftNeighborCellIndex)
      if (leftNeighborCell && leftNeighborCell.type !== "obstacle") {
        neighbors.push(leftNeighborCell);
        cell.neighbors.push(leftNeighborCell)
      }
    }
    if (cell.col > 0 && cell.row > 0) {
      const topLeftNeighborCellIndex = (cell.row - 1) * this.numCol + (cell.col - 1)
      const topLeftNeighborCell = this.cells.get(topLeftNeighborCellIndex)
      if (topLeftNeighborCell && topLeftNeighborCell.type !== "obstacle") {
        neighbors.push(topLeftNeighborCell);
        cell.neighbors.push(topLeftNeighborCell)
      }
    }
    return neighbors;
  }
  show(p: p5) {
    for (let cell of this.cells.values()) {
      cell.show(p)
    }
  }

  getWeight(cell1: GridCell, cell2: GridCell): number {
    return Math.sqrt((cell1.location.x - cell2.location.x) ** 2 + (cell1.location.y - cell2.location.y) ** 2)
  }
  getObstacles(): Cell[] {
    return Array.from(this.cells.values()).filter(cell => cell.type === "obstacle")
  }

  toNumber(cell: GridCell) {
    return this.numCol * cell.row + cell.col;
  }
  toCell(index: number): GridCell | undefined {
    return this.cells.get(index)
  }
  getCell(x: number, y: number) {
    const col = Math.floor((x - this.offsetX) / this.cellSize);
    const row = Math.floor((y - this.offsetY) / this.cellSize);
    if (row >= 0 && row < this.numRow && col >= 0 && col < this.numCol) {
      const index = row * this.numCol + col
      return this.cells.get(index)
    }
  }

  addObstacle(x: number, y: number) {
    const cell = this.getCell(x, y)
    if (cell)
      cell.beObstacle()
  }
  addPathCell(cell: Cell): void {
    this.algorithsmPathCells.push(cell as GridCell)
    cell.beInPath()
  }
  setStart(x: number, y: number) {
    const cell = this.getCell(x, y)
    if (cell) {
      if (this.start) {
        this.start.beNormal()
      }
      cell.beStart()
      this.start = cell
    }
  }
  setEnd(x: number, y: number) {
    const cell = this.getCell(x, y)
    if (cell) {
      if (this.end) {
        this.end.beNormal()
      }
      cell.beEnd()
      this.end = cell
    }
  }

  onMouseMove(x: number, y: number, p: p5) {
    const cell = this.getCell(x, y)
    if (cell)
      cell.showText(cell.name, p)
  }

  update() {
    this.cellSize = Math.min(this.canvasWidth / this.numCol, this.canvasHeight / this.numRow);
    this.offsetX = (this.canvasWidth - this.cellSize * this.numCol) / 2;
    this.offsetY = (this.canvasHeight - this.cellSize * this.numRow) / 2;

    for (let cell of this.cells.values()) {
      cell.cellSize = this.cellSize
      cell.location.x = cell.col * this.cellSize + this.offsetX
      cell.location.y = cell.row * this.cellSize + this.offsetY
    }
  }
  resize(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.update();
  }
}

class GridCell implements Cell {
  location: { x: number, y: number }
  neighbors: GridCell[] = []
  name: string = ""
  type: CellType = "normal"
  color: COLOR = [255, 255, 255, 255]
  cellSize: number
  row: number
  col: number

  constructor(x: number, y: number, cellSize: number, row: number, col: number) {
    this.location = { x, y }
    this.cellSize = cellSize
    this.row = row
    this.col = col
  }
  show(p: p5) {
    p.fill(this.color)
    p.square(this.location.x, this.location.y, this.cellSize)

  }
  beNormal(): void {
    this.type = "normal"
    this.color = colors.background as COLOR
  }

  beStart(): void {
    this.type = "start"
    this.color = colors.start as COLOR
  }
  beEnd(): void {
    this.type = "end"
    this.color = colors.end as COLOR
  }
  beObstacle(): void {
    this.type = "obstacle"
    this.color = colors.obstacle as COLOR
  }
  beInPath(): void {
    this.type = "path"
    this.color = colors.path as COLOR
  }
  isInCell(x: number, y: number) {
    const xBound = x - this.location.x > 0 && x - this.location.x < this.cellSize
    const yBound = y - this.location.y > 0 && y - this.location.y < this.cellSize
    return xBound && yBound
  }

  showText(text: string, p: p5) {
    this.name = text
    p.fill("black")
    p.textAlign(p.CENTER)
    p.text(this.name, this.location.x, this.location.y)
  }
  highlight(color: COLOR) {
    this.color = color
  }

}
