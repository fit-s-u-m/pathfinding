export class Stack<T> {
  private item: T[] = []
  private stackLimit = 300
  push(item: T) {
    this.item.push(item)
    if (this.item.length > this.stackLimit)
      this.item.pop()
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
