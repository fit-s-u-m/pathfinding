import { GridCell } from './gridCell';

export class CellPool {
  private pool: GridCell[] = []
  private static instance: CellPool | null = null
  private constructor() {}

  public static getInstance() {
    if(!CellPool.instance){
      CellPool.instance = new CellPool()
    }
    return CellPool.instance
  }
  makePool(size: number) {
    if(this.pool.length != 0){
      for (let i = 0; i < size; i++) {
        this.pool.push(new GridCell())
      }
    }
    else {
      this.pool = Array.from({ length: size }, () => new GridCell())
    }
    return this.pool
  }
  addCell(cell: GridCell) {
    this.pool.push(cell)
  }
  getCells(number: number) {
    return this.pool.filter(cell=>!cell.active)
    .slice(0,number)
  }
  getActiveCells() {
    return this.pool.filter(cell=>cell.active)
  }
  size(){
    return this.pool.length
  }
}
