export function verticesCapability<T, Coll>(self: T) {
  let next: Coll | null = null;
  let prev: Coll | null = null;
  let parent: Coll | null = null;
  let children: Coll[] = [];

  return {
    setPrev(p: Coll): T {
      prev = p;
      return self;
    },

    getPrev(): Coll | null {
      return prev;
    },

    setNext(n: Coll): T {
      next = n;
      return self;
    },

    getNext(): Coll | null {
      return next;
    },

    setParent(p: Coll | null): T {
      parent = p;

      // @ts-expect-error
      if (parent && parent.pushChild) {
        // @ts-expect-error
        parent.pushChild(self);
      }

      return self;
    },

    getParent(): Coll | null {
      return parent;
    },

    pushChild(c: Coll): T {
      children.push(c);
      return self;
    },

    getChildren(): Coll[] {
      return children;
    },
  };
}
