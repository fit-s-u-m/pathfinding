export class Queue<T> {
  private items: T[] = [];
  enqueue(item: T) {
    this.items.push(item);
  }
  dequeue() {
    if (this.items.length === 0) return null;
    return this.items.shift();
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
