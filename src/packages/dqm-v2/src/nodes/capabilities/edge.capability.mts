import { assertExists } from "@dqm/package-dqm-utils";

/**
 * @dev
 * #1 TODO this is pattern breaking. none of the other vertex relations call
 * their counterpart to set themselves as an edge.
 */
export function edgeCapability<Coll>(self: any, edgeName: string) {
  type Self = typeof self;
  let next: Coll | null = null;
  let prev: Coll | null = null;
  let parent: Coll | null = null;
  let children: Coll[] = [];
  const n = edgeName;

  const names = {
    setPrev: `set${n}Prev`,
    getPrev: `set${n}Prev`,
    setNext: `set${n}Next`,
    getNext: `get${n}Next`,
    setParent: `set${n}Parent`,
    getParent: `set${n}Parent`,
    pushEdge: `push${n}Edge`,
    getEdges: `get${n}Edges`,
  };

  return {
    setPrev(p: Coll | null, bidirectional: boolean = true) {
      prev = p;
      if (bidirectional) {
        // @ts-expect-error
        assertExists(p[names.setNext], {
          why: "Bidirectional binding requires the corresponding `next` assignment method to be available",
          details: {
            name: names.setNext,
          },
        });

        // @ts-expect-error
        p[names.setNext](self);
      }
      return self;
    },

    getPrev(): Coll | null {
      return prev;
    },

    setNext(n: Coll): Self {
      next = n;
      return self;
    },

    getNext(): Coll | null {
      return next;
    },

    setParent(p: Coll | null, bidirectional: boolean = true): Self {
      parent = p;
      if (bidirectional) {
        // @ts-expect-error
        assertExists(p[names.pushEdge], {
          why: "Bidirectional binding requires the corresponding `pushEdge` assignment method to be available",
          details: {
            name: names.pushEdge,
          },
        });

        // @ts-expect-error
        parent[names.pushEdge](self);
      }
      return self;
    },

    getParent(): Coll | null {
      return parent;
    },

    pushEdge(c: Coll): Self {
      children.push(c);
      return self;
    },

    getEdges(): Coll[] {
      return children;
    },
  };
}
