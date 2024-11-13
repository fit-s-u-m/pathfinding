export class Stack<T> {
  private item: T[] = []
  push(item: T) {
    this.item.push(item)
  }
  pop() {
    return this.item.pop()
  }
  peek() {
    return this.item[this.item.length - 1]
  }
  size() {
    return this.item.length
  }
}
