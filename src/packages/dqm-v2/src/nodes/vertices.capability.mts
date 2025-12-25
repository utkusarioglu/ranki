export function verticesCapability<T>(self: T) {
  let next: T | null = null;
  let prev: T | null = null;
  let parent: T | null = null;
  let children: T[] = [];

  return {
    setPrev(p: T): T {
      prev = p;
      return self;
    },

    getPrev(): T | null {
      return prev;
    },

    setNext(n: T): T {
      next = n;
      return self;
    },

    getNext(): T | null {
      return next;
    },

    setParent(p: T | null): T {
      parent = p;

      // @ts-expect-error
      if (parent && parent.pushChild) {
        // @ts-expect-error
        parent.pushChild(self);
      }

      return self;
    },

    getParent(): T | null {
      return parent;
    },

    pushChild(c: T): T {
      children.push(c);
      return self;
    },

    getChildren(): T[] {
      return children;
    },
  };
}
