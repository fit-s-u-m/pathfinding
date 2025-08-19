import p5 from "p5";
import { ALGORITHMS, SELECT } from "./type";
export class Ui {
  selectedFlag: SELECT = "start"
  selectedAlgorithm: ALGORITHMS = "Breadth-First Search";
  selectedVisual: "Grid" | "Map" = "Map"

  algorithm: p5.Element | null = null;
  algorithmMobile: p5.Element | null = null;
  flags: p5.Element[] | null = null;

  runButton: p5.Element[] | null = null

  clearBoards: p5.Element[] | null = null
  visual: p5.Element | null = null
  visualMobile: p5.Element | null = null

  // history control
  prev: p5.Element[] | null = null
  next: p5.Element[] | null = null

  // dropdown
  dropDown: p5.Element | null = null
  dropDownContent: p5.Element | null = null
  dropDownOpen: boolean = false

  constructor(p: p5) {

    const selectables = p.selectAll(".selectable-button")
    const runButtons = p.selectAll(".play")

    const algorithm = p.select("#algorithms");
    const visual = p.select("#visual")
    const algorithmMobile = p.select("#algorithms-mobile");
    const visualMobile = p.select("#visual-mobile")

    const clearboard = p.selectAll(".clear-board")
    const prev = p.selectAll(".prev")
    const next = p.selectAll(".next")

    const dropDown = p.select(".dropdown-btn")
    const dropDownContent = p.select(".dropdown-content")


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

    this.dropDown = dropDown
    this.dropDownContent = dropDownContent

    const selectedAlgorithm = algorithm.elt.value
    this.selectedAlgorithm = selectedAlgorithm.toString() as ALGORITHMS

    this.visual.elt.value = localStorage.getItem("selectedVisual") as "Grid" | "Map" || "Grid"


    // keyboard events
    window.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "Space":
          event.preventDefault()
          this.runButton?.forEach(btn => (btn.elt as HTMLButtonElement).click())
          break

        case "ArrowLeft":
          event.preventDefault()
          this.prev?.forEach(btn => (btn.elt as HTMLButtonElement).click())
          break

        case "ArrowRight":
          event.preventDefault()
          this.next?.forEach(btn => (btn.elt as HTMLButtonElement).click())
          break


        default:
          // Handle number keys separately (use event.key here)
          switch (event.key) {
            case "1":
              this.selectedFlag = "start"
              this.updateFlagsKey()
              break
            case "2":
              this.selectedFlag = "obstacle"
              this.updateFlagsKey()
              break
            case "3":
              this.selectedFlag = "end"
              this.updateFlagsKey()
              break
          }
      }
    })
  }
  updateFlagsKey() {
    if (!this.flags) return
    for (let buttons of this.flags) {
      const flag = buttons.elt.dataset.value as SELECT
      if (flag == this.selectedFlag) {
        (buttons.elt as HTMLButtonElement).click()
      }
    }
  }
  handleHistory(update: Function) {
    if (!this.prev || !this.next) return
    this.prev.map((button) => {
      button.mouseClicked(() => {
        update("prev")
      })
    })
    this.next.map((button) => {
      button.mouseClicked(() => {
        update("next")
      })
    })
  }
  handleDropDown() {
    if (!this.dropDown || !this.dropDownContent) return;

    this.dropDown.elt.addEventListener("click", () => {
      if (!this.dropDownContent) return;

      // Toggle the visibility of the dropdown content
      this.toggleDropDown()
    });
  }
  toggleDropDown() {
    if (!this.dropDownContent) return;
    this.dropDownContent.elt.classList.toggle("hidden");
    this.dropDownOpen = !this.dropDownOpen;
    console.log(this.dropDownOpen)
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
    window.addEventListener("keydown", (event) => {
      console.log("event", event.code)
      if (!this.visual) return
      switch (event.code) {
        case "ArrowUp":
          event.preventDefault()
          this.selectedVisual = "Grid"
          this.visual.elt.value = this.selectedVisual
          update(this.selectedVisual)
          break

        case "ArrowDown":
          event.preventDefault()
          this.selectedVisual = "Map"
          this.visual.elt.value = this.selectedVisual
          update(this.selectedVisual)
          break
        default:
          break;
      }

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
export const dropDown = () => ({
  open: false,
  toggle() {
    this.open = !this.open
  }
})

