export interface IVerticesCapability<T> {
  setParent(parent: T | null): T;
  getParent(): T | null;
  getPrev(): T | null;
  getNext(): T | null;
  setPrev(prev: T): T;
  setNext(next: T): T;
  getChildren(): T[];
  pushChild(cpx: T): T;
}
