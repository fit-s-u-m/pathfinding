import { ACTION } from "./action"
import { Stack } from "../dataStructures/Stack"

export class History {
  private static instance: History | null = null

  private undoStack: Stack<ACTION> = new Stack()
  private redoStack: Stack<ACTION> = new Stack()

  // Private constructor to prevent direct instantiation
  private constructor() { }

  // Static method to get the singleton instance
  public static getInstance(): History {
    if (!History.instance) {
      History.instance = new History()
    }
    return History.instance
  }

  saveState(action: ACTION) {
    console.log(this.undoStack.size())
    console.log(this.redoStack.size())
    this.undoStack.push(action)
    this.redoStack = new Stack<ACTION>()
  }
  prev() {
    const action = this.undoStack.pop()
    console.log(this.undoStack, "undo")
    console.log(this.redoStack, "redo")
    if (action) {
      this.redoStack.push(action)
      action.undo()
    }
  }
  next() {
    const action = this.redoStack.pop()
    console.log(this.undoStack, "undo")
    console.log(this.redoStack, "redo")
    if (action) {
      this.undoStack.push(action)
      action.do()
    }
  }
  getPrevState() {
    return this.undoStack.peek()
  }
  hasNext() {
    return this.redoStack.size() > 0
  }
  goToPresent() {
    while (this.hasNext()) {
      const redo = this.redoStack.pop();
      if (redo) this.undoStack.push(redo);
    }
  }
}
