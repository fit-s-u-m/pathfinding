import { State } from "./types"

export class History {
  private state: State[] = []
  stateIndex = 0
  historyLength = 100
  saveState(state: State) {
    this.state.unshift(state)
    if (this.state.length > this.historyLength) this.state.pop()
  }
  getState() {
    return this.state[this.stateIndex]
  }
  resetState() {
    this.state.length = 0
  }
  prev() {
    if (this.state.length == 0 || this.stateIndex > this.state.length - 2) {
      console.log("State reached the end or no state saved")
      return
    }
    return this.state[++this.stateIndex]
  }
  next() {
    if (this.state.length == 0 || this.stateIndex < 1) {
      console.log("State reached the present or no state saved")
      return
    }
    return this.state[--this.stateIndex]
  }
}
