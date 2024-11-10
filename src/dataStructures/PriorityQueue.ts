export class PQueue<T> {
  private items: { item: T, weight: number }[] = []
  enqueue(item: T, weight: number) {
    const node = { item, weight }
    if (this.items.length == 0)
      this.items.push(node);
    else {
      this.items.push(node)
      this.items.sort((a, b) => a.weight - b.weight)
    }
  }
  dequeue() {
    if (this.items.length === 0) return null;
    const first = this.items.shift()
    if (first)
      return first.item;
    else
      return null
  }
  peak() {
    return this.items[0];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  toArray() {
    return [...this.items];
  }
}
