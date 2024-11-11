export class PQueue<T> {
  private items: { item: T, weight: number }[] = []
  enqueue(item: T, weight: number) {
    const node = { item, weight }
    this.items.push(node);
    if (this.items.length != 0) {
      // insert the node in the correct position
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].weight > node.weight) {
          this.swap(i, this.items.length - 1);
        }
      }
    }
  }
  private swap(index1: number, index2: number) {
    const temp = this.items[index1];
    this.items[index1] = this.items[index2];
    this.items[index2] = temp;
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
