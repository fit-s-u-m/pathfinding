import p5 from "p5";
import { CELL, COLOR, HIGHLIGHT } from "../type";

export class Grid {
  canvasWidth: number;
  canvasHeight: number;
  start: CELL | null = null;
  end: CELL | null = null;
  obstacles: CELL[] = [];
  numRow: number = 20;
  numCol: number = 20;
  cellSize: number;
  highlightCell: Map<number, HIGHLIGHT> = new Map();
  algorithsmPathCells: CELL[] = []
  offsetX: number;
  offsetY: number;
  constructor(canvasWidth: number, canvasHeight: number, numRow: number, numCol: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.numRow = numRow
    this.numCol = numCol
    this.cellSize = Math.min(this.canvasWidth / this.numCol, this.canvasHeight / this.numRow);
    this.offsetX = (this.canvasWidth - this.cellSize * this.numCol) / 2;
    this.offsetY = (this.canvasHeight - this.cellSize * this.numRow) / 2;
  }
  showGrid(p: p5) {
    for (let row = 0; row < this.numRow; row++) {
      for (let col = 0; col < this.numCol; col++) {
        const x = col * this.cellSize + this.offsetX;
        const y = row * this.cellSize + this.offsetY;
        p.fill("white");
        if (this.isStart(row, col)) {
          p.fill("green");
        } else if (this.isEnd(row, col)) {
          p.fill("red");
        } else if (this.isObstacle(row, col)) {
          p.fill("gray");
        }
        const highlight = this.getHighlight(row, col);
        if (highlight) {
          p.fill(highlight.color)
          p.stroke("black")
          p.textAlign(p.CENTER, p.CENTER);
          p.text(highlight.text, x + this.cellSize / 2, y + this.cellSize / 2)
        }
        if (this.isInPath(row, col)) p.fill("black")
        p.square(x, y, this.cellSize, this.cellSize / 5);
      }
    }
  }
  clearBoard() {
    this.start = null;
    this.end = null
    this.obstacles = []
    this.highlightCell = new Map()
    this.algorithsmPathCells = []
  }
  isStart(row: number, col: number) {
    if (!this.start) return false;
    return this.start.row == row && this.start.col == col;
  }
  isEnd(row: number, col: number) {
    if (!this.end) return false;
    return this.end.row == row && this.end.col == col;
  }
  isObstacle(row: number, col: number) {
    return (
      this.obstacles.filter((cell) => {
        return cell.col == col && cell.row == row;
      }).length > 0
    );
  }
  isInPath(row: number, col: number) {
    return this.algorithsmPathCells.filter((cell) => cell.row == row && cell.col == col).length > 0;
  }
  getHighlight(row: number, col: number): HIGHLIGHT | null {
    const highlight = this.highlightCell.get(this.toNumber({ row, col }));
    return highlight ? highlight : null;
  }
  changeCoord(x: number, y: number): CELL | null {
    const isInGridX =
      x < this.numCol * this.cellSize + this.offsetX && x > this.offsetX;
    const isInGridY =
      y < this.numRow * this.cellSize + this.offsetY && y > this.offsetY;
    if (isInGridX && isInGridY) {
      const state = {
        col: Math.floor((x - this.offsetX) / this.cellSize),
        row: Math.floor((y - this.offsetY) / this.cellSize),
      };
      return state;
    }
    return null;
  }
  getNeighbors(cell: CELL) {
    const neighbors: CELL[] = [];
    if (cell.row > 0) {
      const topNeighborCell = { row: cell.row - 1, col: cell.col };
      if (!this.isObstacle(topNeighborCell.row, topNeighborCell.col))
        neighbors.push(topNeighborCell);
    }
    if (cell.col < this.numCol - 1 && cell.row > 0) {
      const topRightNeighborCell = { row: cell.row - 1, col: cell.col + 1 };
      if (!this.isObstacle(topRightNeighborCell.row, topRightNeighborCell.col))
        neighbors.push(topRightNeighborCell);
    }
    if (cell.col < this.numCol - 1) {
      const rightNeighborCell = { row: cell.row, col: cell.col + 1 };
      if (!this.isObstacle(rightNeighborCell.row, rightNeighborCell.col))
        neighbors.push(rightNeighborCell);
    }
    if (cell.col < this.numCol - 1 && cell.row < this.numRow - 1) {
      const downRightNeighborCell = { row: cell.row + 1, col: cell.col + 1 };
      if (!this.isObstacle(downRightNeighborCell.row, downRightNeighborCell.col))
        neighbors.push(downRightNeighborCell);
    }
    if (cell.row < this.numRow - 1) {
      const downNeighborCell = { row: cell.row + 1, col: cell.col };
      if (!this.isObstacle(downNeighborCell.row, downNeighborCell.col))
        neighbors.push(downNeighborCell);
    }
    if (cell.col > 0 && cell.row < this.numRow - 1) {
      const downLeftNeighborCell = { row: cell.row + 1, col: cell.col - 1 };
      if (!this.isObstacle(downLeftNeighborCell.row, downLeftNeighborCell.col))
        neighbors.push(downLeftNeighborCell);
    }
    if (cell.col > 0) {
      const leftNeighborCell = { row: cell.row, col: cell.col - 1 };
      if (!this.isObstacle(leftNeighborCell.row, leftNeighborCell.col))
        neighbors.push(leftNeighborCell);
    }
    if (cell.col > 0 && cell.row > 0) {
      const topLeftNeighborCell = { row: cell.row - 1, col: cell.col - 1 };
      if (!this.isObstacle(topLeftNeighborCell.row, topLeftNeighborCell.col))
        neighbors.push(topLeftNeighborCell);
    }
    return neighbors;
  }
  toNumber(cell: CELL) {
    return this.numCol * cell.row + cell.col;
  }
  getCell(index: number): CELL {
    return {
      row: index / this.numCol,
      col: index % this.numCol,
    };
  }
  fillCell(row: number, col: number, color: COLOR) {
    const highlightCell = { row, col };
    const highlightColor = color;
    this.highlightCell.push({ cell: highlightCell, color: highlightColor });
  }

  addObstacle(x: number, y: number) {
    const state = this.changeCoord(x, y);
    if (state) this.obstacles.push(state);
  }
  setStart(x: number, y: number) {
    const state = this.changeCoord(x, y);
    if (state) this.start = state;
  }
  setEnd(x: number, y: number) {
    const state = this.changeCoord(x, y);
    if (state) this.end = state;
  }
  update() {
    this.cellSize = Math.min(this.canvasWidth / this.numCol, this.canvasHeight / this.numRow);
    this.offsetX = (this.canvasWidth - this.cellSize * this.numCol) / 2;
    this.offsetY = (this.canvasHeight - this.cellSize * this.numRow) / 2;
  }
  resize(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.update();
  }
}
