import p5 from "p5";
import { ALGORITHMS } from "./type";
export class Ui {
  selectedFlag: string = "start"
  selectedAlgorithm: ALGORITHMS = "Breadth-First Search";
  selectedVisual: "Grid" | "Map" = "Grid"

  algorithm: p5.Element[] | null = null;
  selectables: p5.Element[] | null = null;
  flag: p5.Element[] | null = null;

  playButtons: p5.Element[] | null = null
  isPlay: boolean = false

  clearBoard: p5.Element | null = null
  visual: p5.Element | null = null

  // history control
  prev: p5.Element | null = null
  next: p5.Element | null = null

  constructor(p: p5) {

    const selectables = p.selectAll(".selectable-button")
    const flag = p.selectAll(".selected-flag")

    const playButtons = p.selectAll(".play")
    const algorithm = p.selectAll("#algorithms");
    const visual = p.select("#visual")

    const clearboard = p.select(".clear-board")
    const prev = p.select("#prev")
    const next = p.select("#next")


    if (!algorithm || !visual) return;

    this.selectables = selectables
    this.flag = flag


    this.playButtons = playButtons
    this.visual = visual
    this.algorithm = algorithm;

    this.clearBoard = clearboard;
    this.prev = prev
    this.next = next

    if (algorithm) {
      for (let selectors of this.algorithm) {
        const selectedAlgorithm = selectors.elt.value
        if (selectedAlgorithm) {
          this.selectedAlgorithm = selectedAlgorithm.toString() as ALGORITHMS
        }
      }
    }
    if (visual) {
      this.selectedVisual = visual.elt.value as "Grid" | "Map"
    }

  }
  handleHistory(update: Function) {
    if (!this.prev || !this.next) return
    this.prev.mouseClicked(() => {
      update("prev")
    })
    this.next.mouseClicked(() => {
      update("next")
    })
  }

  updateVisual(update: Function) {
    if (!this.visual) return
    this.visual.elt.addEventListener('change', () => {
      if (!this.visual || !this.selectedVisual) return;
      this.selectedVisual = this.visual.elt.value as "Grid" | "Map";
      console.log(this.visual.value());
      update(this.selectedVisual);
    });
  }
  clearBoardButton(update: Function) {
    if (!this.clearBoard) return
    this.clearBoard.mouseClicked(() => {
      update()
    })
  }
  updateAlgorithm(update: Function) {
    if (!this.algorithm) return;
    for (let selectors of this.algorithm) {
      selectors.elt.addEventListener('change', () => {
        const selectedAlgorithm = selectors.elt.value;
        if (selectedAlgorithm) {
          this.selectedAlgorithm = selectedAlgorithm.toString() as ALGORITHMS;
          update(this.selectedAlgorithm);
        }
      });
    }
  }
  updateFlag() {
    if (!this.selectables) return
    for (let buttons of this.selectables) {
      buttons.mouseClicked(() => {
        this.selectedFlag = buttons.elt.dataset.value
        console.log(this.selectedFlag)
      })
    }
  }
  updatePlayButton(update: Function) {
    if (!this.playButtons) return
    this.playButtons.forEach((button) => {
      button.mouseClicked(() => {
        update()
      })
    })
  }

}
