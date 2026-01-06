export interface IVerticesCapability<T> {
  setParent(parent: T | null, bidirectional?: boolean): T;
  getParent(): T | null;
  getPrev(): T | null;
  getNext(): T | null;
  setPrev(prev: T, bidirectional?: boolean): T;
  setNext(next: T): T;
  getChildren(): T[];
  pushChild(cpx: T): T;
}
