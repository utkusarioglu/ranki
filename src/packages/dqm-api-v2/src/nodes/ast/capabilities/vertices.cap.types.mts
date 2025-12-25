export interface IAstNodeVerticesCapabilities<T> {
  setParent(parent: T): this;
  getParent(): T | null;
  getPrev(): T | null;
  getNext(): T | null;
  setPrev(prev: T): this;
  setNext(next: T): this;
  getChildren(): T[];
}
