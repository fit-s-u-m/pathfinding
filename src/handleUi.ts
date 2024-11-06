import p5 from "p5";
import { ALGORITHMS } from "./type";
export class Ui {
  selectedFlag: string = "start"
  selectedAlgorithm: ALGORITHMS = "Breadth-First Search";
  speed: p5.Element | null = null;
  speedLabel: p5.Element | null = null;
  algorithm: p5.Element[] | null = null;
  selectables: p5.Element[] | null = null;
  flag: p5.Element[] | null = null;
  playButtons: p5.Element[] | null = null
  playPressed: boolean = false
  clearBoard: p5.Element | null = null
  constructor(p: p5) {
    const selectables = p.selectAll(".selectable-button")
    const clearboard = p.select(".clear-board")
    const flag = p.selectAll(".selected-flag")
    const playButtons = p.selectAll(".play")
    const speed = p.select("#speed");
    const algorithm = p.selectAll("#algorithms");
    const speedLabel = p.select("#speed-label");
    if (!speed || !algorithm) return;

    this.speed = speed;
    this.speedLabel = speedLabel;
    this.algorithm = algorithm;
    this.selectables = selectables
    this.playButtons = playButtons
    this.flag = flag
    this.clearBoard = clearboard;
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
      update(this.speed.value());
      if (!this.speedLabel) return
      this.speedLabel.html("Speed: " + this.speed.value());
    });
  }
  updateFlag() {
    if (!this.selectables) return
    for (let buttons of this.selectables) {
      buttons.mouseClicked(() => {
        this.selectedFlag = buttons.elt.dataset.value
        if (!this.flag || this.flag.length == 0) return
        this.flag.forEach((flagLabel) => {
          flagLabel.html(this.getFlag(this.selectedFlag))
        })
      })
    }
  }
  updatePlayButton(runAlgorithm: Function) {
    if (!this.playButtons) return
    this.playButtons.forEach((button) => {
      button.mouseClicked(() => {
        this.playPressed = !this.playPressed
        button.html(this.playPause())
        if (this.playPressed)
          runAlgorithm()

      })
    })
  }
  getFlag(flag: string) {
    const statFlag = `<svg xmlns="http://www.w3.org/2000/svg"  width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#84f509" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`
    const endFlag = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f5092a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`
    const obstacleFlag = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
    if (flag === "start") return statFlag
    if (flag === "end") return endFlag
    if (flag === "obstacle") return obstacleFlag

  }
  playPause() {
    const pause = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b8e986" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line></svg>`
    const play = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b8e986" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`
    if (this.playPressed) return pause
    else return play
  }

}
