import p5 from "p5";
import { Cell } from "../util/cell";
import { Graph } from "../dataStructures/Graph";
import { GridCell } from "./gridCell";
import { Arrow } from "./arrow";

import { Action, ComposedAction } from "../util/action";
import { History } from "../util/history";
import { ArrowType, CellType, COLOR } from "../type";

export class Grid implements Graph {
  canvasWidth: number;
  canvasHeight: number;

  start: GridCell | null = null;
  end: GridCell | null = null;

  numRow: number = 20;
  numCol: number = 20;
  cellSize: number;

  currentScan: GridCell | null = null
  algorithsmPathCells: GridCell[] = []
  highlightedArrows: Arrow[] = []

  offsetX: number;
  offsetY: number;
  margin: number = 50

  cells: Map<number, GridCell> = new Map()
  constructor(canvasWidth: number, canvasHeight: number, numRow: number, numCol: number) {
    this.canvasWidth = canvasWidth - this.margin;
    this.canvasHeight = canvasHeight;

    this.numRow = numRow
    this.numCol = numCol

    this.cellSize = Math.min(this.canvasWidth / this.numCol, this.canvasHeight / this.numRow);
    this.offsetX = (this.canvasWidth - this.cellSize * this.numCol + this.margin) / 2;
    this.offsetY = (this.canvasHeight - this.cellSize * this.numRow) / 2;

    this.makeGrid()
  }
  makeGrid() {
    for (let row = 0; row < this.numRow; row++) {
      for (let col = 0; col < this.numCol; col++) {
        const x = col * this.cellSize + this.offsetX + this.cellSize / 2;
        const y = row * this.cellSize + this.offsetY + this.cellSize / 2;
        const index = row * this.numCol + col
        const cell = new GridCell(x, y, this.cellSize, row, col, index.toString())
        this.cells.set(index, cell)
      }
    }
  }
  createNeighbors() {
    for (let cell of this.cells.values()) {
      this.makeNeighbors(cell)
    }
  }
  private makeNeighbors(cell: GridCell) {
    const directions = [
      { row: -1, col: 0 }, // top
      { row: -1, col: 1 }, // top-right
      { row: 0, col: 1 }, // right
      { row: 1, col: 1 }, // bottom-right
      { row: 1, col: 0 }, // bottom
      { row: 1, col: -1 }, // bottom-left
      { row: 0, col: -1 }, // left
      { row: -1, col: -1 }, // top-left
    ];

    for (let { row: dr, col: dc } of directions) {
      const neighborRow = cell.row + dr;
      const neighborCol = cell.col + dc;

      if (neighborRow >= 0 && neighborRow < this.numRow && neighborCol >= 0 && neighborCol < this.numCol) {
        const neighborCell = this.cells.get(this.toNumber({ row: neighborRow, col: neighborCol }));

        if (neighborCell && neighborCell.type !== "obstacle") {
          const weight = this.getNormalWeight(cell, neighborCell);
          const arrow = new Arrow(cell, neighborCell, weight);
          cell.neighbors.push({ cell: neighborCell, weight: this.getDistance(cell, neighborCell), arrow });
        }
      }
    }
  }

  show(p: p5) {
    for (let cell of this.cells.values()) {
      cell.show(p)
    }
  }

  getDistance(cell1: GridCell, cell2: GridCell): number {
    return Math.sqrt((cell1.row - cell2.row) ** 2 + (cell1.col - cell2.col) ** 2)
  }
  getNormalWeight(cell1: GridCell, cell2: GridCell): number { // TODO: make it scaleable
    return Math.sqrt((cell1.row - cell2.row) ** 2 + (cell1.col - cell2.col) ** 2) / 2
  }
  getObstacles(): Cell[] {
    return Array.from(this.cells.values()).filter(cell => cell.type === "obstacle")
  }
  getHighlights(): Cell[] {
    return Array.from(this.cells.values()).filter(cell => cell.type === "highlight")
  }

  toNumber(cell: GridCell | { row: number, col: number }) {
    if (cell instanceof GridCell) {
      return this.numCol * cell.row + cell.col;
    }
    else {
      return this.numCol * cell.row + cell.col;
    }
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

  addObstacle(x: number, y: number): Action | null {
    const cell = this.getCell(x, y)
    if (cell && cell.type != "obstacle") {
      const undo = (prevColor: COLOR, prevType: CellType) => {
        cell.type = prevType
        cell.color = prevColor
      }
      const action = new Action(cell.beObstacle.bind(cell), undo.bind(cell, cell.color, cell.type))
      console.log(action, "action")
      action.do()
      return action
    }
    return null
  }
  addPathCell(cell: GridCell): Action {
    this.algorithsmPathCells.push(cell)

    const undo = (prevColor: COLOR, prevType: CellType) => {
      cell.type = prevType
      cell.color = prevColor
    }
    const action = new Action(cell.beInPath.bind(cell), undo.bind(cell, cell.color, cell.type))
    action.do()
    return action
  }
  setStart(x: number, y: number) {
    const cell = this.getCell(x, y)
    if (cell) {
      const startDoFunc = (cell: GridCell) => {
        if (this.start)
          this.start.beNormal()
        cell.beStart()
        this.start = cell
      }
      const startUndoFunc = (cell: GridCell, prevStart: GridCell | null, cellPrevType: CellType, cellPrevColor: COLOR) => {
        if (prevStart)
          prevStart.beStart()
        cell.type = cellPrevType
        cell.color = cellPrevColor
        this.start = prevStart
      }

      const action = new Action(startDoFunc.bind(this, cell), startUndoFunc.bind(this, cell, this.start, cell.type, cell.color))
      action.do()
      History.getInstance().saveState(action)
    }
  }
  setEnd(x: number, y: number) {
    const cell = this.getCell(x, y)
    if (cell) {
      const endDoFunc = (cell: GridCell) => {
        if (this.end)
          this.end.beNormal()
        cell.beEnd()
        this.end = cell
      }
      const endUndoFunc = (cell: GridCell, prevEnd: GridCell | null, cellPrevType: CellType, cellPrevColor: COLOR) => {
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

  onMouseHover(x: number, y: number, p: p5) {
    const cell = this.getCell(x, y)
    if (cell) {
      cell.showArrow(p)
      p.cursor(p.CROSS)
    }
  }

  clearGraph(): void {
    const composedAction = new ComposedAction()
    for (let cell of this.cells.values()) {

      let action: Action
      if (cell.type == "end") {
        const clearEndUnDoFunc = () => {
          cell.beEnd()
          this.end = cell
        }
        action = new Action(cell.beNormal.bind(cell), clearEndUnDoFunc.bind(cell))
      }
      else if (cell.type == "start") {
        const clearStartUnDoFunc = () => {
          cell.beStart()
          this.start = cell
        }
        action = new Action(cell.beNormal.bind(cell), clearStartUnDoFunc.bind(cell))
      }
      else {
        const unDoFunc = (prevColor: COLOR, prevType: CellType) => {
          cell.type = prevType
          cell.color = prevColor
        }
        action = new Action(cell.beNormal.bind(cell), unDoFunc.bind(cell, cell.color, cell.type))
      }

      composedAction.addAction(action)
    }
    composedAction.do()
    History.getInstance().saveState(composedAction)
    this.start = null
    this.end = null
    this.currentScan = null
    this.algorithsmPathCells = []
  }
  clearHighlight(): void {
    const composedAction = new ComposedAction()

    for (let cell of this.cells.values()) {
      if (cell.type == "highlight" || cell.type == "path") {
        const clearHighlightUnDoFunc = (prevColor: COLOR, prevType: CellType) => {
          cell.type = prevType
          cell.color = prevColor
        }
        const action = new Action(cell.beNormal.bind(cell), clearHighlightUnDoFunc.bind(cell, cell.color, cell.type))
        composedAction.addAction(action)
      }
    }
    for (let arrow of this.highlightedArrows) {
      const clearArrowUnDoFunc = (prevColor: COLOR, prevType: ArrowType) => {
        arrow.arrowType = prevType
        arrow.color = prevColor
      }
      const action = new Action(arrow.beNormal.bind(arrow), clearArrowUnDoFunc.bind(arrow, arrow.color, arrow.arrowType))
      composedAction.addAction(action)
    }
    composedAction.do()
    History.getInstance().saveState(composedAction)
    this.currentScan = null
    this.algorithsmPathCells = []
  }
  highlighightConnection(start: GridCell, end: GridCell): Action {
    const arrow = start.getNeighbor(end.name)?.arrow
    if (arrow) {
      const undo = (prevColor: COLOR, prevType: ArrowType) => {
        arrow.arrowType = prevType
        arrow.color = prevColor
      }
      const action = new Action(arrow.bePath.bind(arrow), undo.bind(arrow, arrow.color, arrow.arrowType))
      this.highlightedArrows.push(arrow)
      action.do()
      return action
    }
    else {
      return new Action(() => { }, () => { })
    }
  }

  update() {
    this.cellSize = Math.min(this.canvasWidth / this.numCol, this.canvasHeight / this.numRow);
    this.offsetX = (this.canvasWidth - this.cellSize * this.numCol + this.margin) / 2;
    this.offsetY = (this.canvasHeight - this.cellSize * this.numRow) / 2;

    for (let cell of this.cells.values()) {
      cell.cellSize = this.cellSize
      cell.location.x = cell.col * this.cellSize + this.offsetX + this.cellSize / 2
      cell.location.y = cell.row * this.cellSize + this.offsetY + this.cellSize / 2
    }
  }
  resize(width: number, height: number) {
    this.canvasWidth = width - this.margin;
    this.canvasHeight = height;
    this.update();
  }
}
