export interface ACTION {
  do(): void
  undo(): void
}

export class Action implements ACTION {
  private action: Function
  private unDoAction: Function
  constructor(action: Function, unDo: Function) {
    this.action = action
    this.unDoAction = unDo
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

  addAction(action: Action) {
    this.actions.push(action);
  }

  do() {
    for (const action of this.actions) {
      action.do();
    }
  }

  undo() {
    this.actions.reverse().forEach(action => action.undo())
  }
}
