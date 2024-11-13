export interface ACTION {
  do(): void
  undo(): void
  name: string
}

export class Action implements ACTION {
  private action: Function
  private unDoAction: Function
  name: string
  constructor(action: Function, unDo: Function) {
    this.action = action
    this.unDoAction = unDo
    this.name = action.name
  }
  do() {
    this.action()
  }
  undo() {
    this.unDoAction()
  }
}

export class ComposedAction implements ACTION {
  private actions: Action[] = [];
  name: string = ""

  addAction(action: Action) {
    this.actions.push(action);
    this.name += action.name
  }

  do() {
    for (const action of this.actions) {
      action.do();
    }
  }

  undo() {
    this.actions.reverse().forEach(action => action.undo())
  }
  isEmpty() {
    return this.actions.length === 0
  }
}
