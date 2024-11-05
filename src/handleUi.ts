import p5 from "p5";
export class Ui {
  select: p5.Element | null = null;
  cellSize: p5.Element | null = null;
  cellSizeLabel: p5.Element | null = null;
  algorithm: p5.Element | null = null;
  constructor(p: p5) {
    const large_label = p.select("#label-large");
    const small_label = p.select("#label-small");
    const cellSize = p.select("#cell-size");
    const algorithm = p.select("#algorithms");
    const cellSizeLabel = p.select("#label-cell-size");
    if (!cellSize || !large_label || !cellSizeLabel || !algorithm) return;

    this.select = large_label;
    this.cellSize = cellSize;
    this.cellSizeLabel = cellSizeLabel;
    this.algorithm = algorithm;
  }
  updateCellSize(update: Function) {
    if (!this.cellSize) return;
    this.cellSize.changed(() => {
      this.cellSizeLabel?.html("cell size: " + this.cellSize?.value());
      update(this.cellSize?.value());
    });
  }
}
