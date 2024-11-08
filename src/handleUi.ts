import p5 from "p5";
import { ALGORITHMS } from "./type";
export class Ui {
  selectedFlag: string = "start"
  selectedAlgorithm: ALGORITHMS = "Breadth-First Search";
  selectedVisual: "Grid" | "Map" = "Grid"

  speed: p5.Element | null = null;
  speedLabel: p5.Element | null = null;

  algorithm: p5.Element[] | null = null;
  selectables: p5.Element[] | null = null;
  flag: p5.Element[] | null = null;

  playButtons: p5.Element[] | null = null
  isPlay: boolean = false

  clearBoard: p5.Element | null = null
  visual: p5.Element | null = null

  constructor(p: p5) {
    const selectables = p.selectAll(".selectable-button")
    const clearboard = p.select(".clear-board")
    const flag = p.selectAll(".selected-flag")
    const playButtons = p.selectAll(".play")
    const speed = p.select("#speed");
    const algorithm = p.selectAll("#algorithms");
    const speedLabel = p.select("#speed-label");
    const visual = p.select("#visual")
    if (!speed || !algorithm || !visual) return;

    this.speed = speed;
    this.speedLabel = speedLabel;
    this.algorithm = algorithm;
    this.selectables = selectables
    this.playButtons = playButtons
    this.flag = flag
    this.clearBoard = clearboard;
    this.visual = visual

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
  updateVisual(update: Function) {
    if (!this.visual) return
    this.visual?.changed(() => {
      if (!this.visual || !this.selectedVisual) return
      this.selectedVisual = this.visual.elt.value as "Grid" | "Map"
      console.log(this.visual.value())
      update(this.selectedVisual)

    })

  }
  clearBoardButton(update: Function) {
    if (!this.clearBoard) return
    this.clearBoard.mouseClicked(() => {
      update()
    })
  }
  updateAlgorithm(update: Function) {
    if (!this.algorithm) return
    for (let selectors of this.algorithm) {
      selectors.changed(() => {
        const selectedAlgorithm = selectors.elt.value
        if (selectedAlgorithm) {
          this.selectedAlgorithm = selectedAlgorithm.toString() as ALGORITHMS
          update(this.selectedAlgorithm)
        }

      })
    }
  }
  updateSpeed(update: Function) {
    if (!this.speed) return;
    this.speed.changed(() => {
      if (!this.speed) return;
      const speed = this.speed.value()
      update(speed);
      if (!this.speedLabel) return
      this.speedLabel.html(speed == 0 ? "Paused " : "Speed: " + speed);
    });
  }
  updateFlag() {
    if (!this.selectables) return
    for (let buttons of this.selectables) {
      buttons.mouseClicked(() => {
        this.selectedFlag = buttons.elt.dataset.value
      })
    }
  }
  updatePlayButton(update: Function) {
    if (!this.playButtons) return
    this.playButtons.forEach((button) => {
      button.mouseClicked(() => {
        update()
        // this.isPlay = !this.isPlay
        // button.html(this.isPlay ? "Pause" : "Play")

      })
    })
  }

}
