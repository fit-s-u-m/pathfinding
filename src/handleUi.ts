import p5 from "p5";
import { ALGORITHMS, SELECT } from "./type";
export class Ui {
  selectedFlag: SELECT = "start"
  selectedAlgorithm: ALGORITHMS = "Breadth-First Search";
  selectedVisual: "Grid" | "Map" = "Grid"

  algorithm: p5.Element | null = null;
  algorithmMobile: p5.Element | null = null;
  flags: p5.Element[] | null = null;

  runButton: p5.Element[] | null = null

  clearBoards: p5.Element[] | null = null
  visual: p5.Element | null = null
  visualMobile: p5.Element | null = null

  // history control
  prev: p5.Element | null = null
  next: p5.Element | null = null

  constructor(p: p5) {

    const selectables = p.selectAll(".selectable-button")

    const runButtons = p.selectAll(".play")

    const algorithm = p.select("#algorithms");
    const visual = p.select("#visual")
    const algorithmMobile = p.select("#algorithms-mobile");
    const visualMobile = p.select("#visual-mobile")

    const clearboard = p.selectAll(".clear-board")
    const prev = p.select("#prev")
    const next = p.select("#next")


    if (!algorithm || !visual) return;

    this.flags = selectables


    this.runButton = runButtons

    this.visual = visual
    this.algorithm = algorithm;

    this.visualMobile = visualMobile
    this.algorithmMobile = algorithmMobile

    this.clearBoards = clearboard;
    this.prev = prev
    this.next = next

    const selectedAlgorithm = algorithm.elt.value
    this.selectedAlgorithm = selectedAlgorithm.toString() as ALGORITHMS

    this.selectedVisual = this.visual.elt.value as "Grid" | "Map";
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
    if (!this.visual || !this.visualMobile) return
    this.visual.elt.addEventListener("change", () => {
      if (!this.visual || !this.selectedVisual) return;
      this.selectedVisual = this.visual.elt.value as "Grid" | "Map";
      if (this.visualMobile)
        this.visualMobile.elt.value = this.selectedVisual
      console.log(this.selectedVisual)
      update(this.selectedVisual);

    })

    this.visualMobile.elt.addEventListener("change", () => {
      if (!this.visualMobile || !this.selectedVisual) return;
      this.selectedVisual = this.visualMobile.elt.value as "Grid" | "Map";
      if (this.visual)
        this.visual.elt.value = this.selectedVisual  // update the other when one change
      console.log(this.selectedVisual)
      update(this.selectedVisual);

    })
  }
  clearBoardButton(update: Function) {
    if (!this.clearBoards) return
    for (let clearButton of this.clearBoards) {
      clearButton.mousePressed(() => {
        update()
      })
    }
  }
  updateAlgorithm(update: Function) {
    this.algorithm?.elt.addEventListener("change", () => {
      if (!this.algorithm || !this.selectedAlgorithm) return;
      this.selectedAlgorithm = this.algorithm.elt.value as ALGORITHMS
      if (this.algorithmMobile)
        this.algorithmMobile.elt.value = this.selectedAlgorithm
      console.log(this.selectedAlgorithm)
      update(this.selectedAlgorithm);

    })

    this.algorithmMobile?.elt.addEventListener("change", () => {
      if (!this.algorithmMobile || !this.selectedAlgorithm) return;
      this.selectedAlgorithm = this.algorithmMobile.elt.value as ALGORITHMS
      if (this.algorithm)
        this.algorithm.elt.value = this.selectedAlgorithm  // update the other when one change
      console.log(this.selectedAlgorithm)
      update(this.selectedAlgorithm);

    })
  }
  updateFlag() {
    if (!this.flags) return
    for (let buttons of this.flags) {
      buttons.mouseClicked(() => {
        const flag = buttons.elt.dataset.value as SELECT
        if (this.selectedFlag != flag) {
          this.selectedFlag = flag
        }
      })
    }
  }
  updateRun(update: Function) {
    if (!this.runButton) return
    this.runButton.forEach((button) => {
      button.mouseClicked(() => {
        console.log("run button");
        update()
      })
    })
  }

}
