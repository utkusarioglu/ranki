import type { IAstNode } from "@dqm/package-dqm-api-v2";

export function verticesCapability<T>(self: T) {
  let next: IAstNode | null = null;
  let prev: IAstNode | null = null;
  let parent: IAstNode | null = null;
  let children: IAstNode[] = [];

  return {
    setPrev(p: IAstNode): T {
      prev = p;
      return self;
    },

    getPrev(): IAstNode | null {
      return prev;
    },

    setNext(n: IAstNode): T {
      next = n;
      return self;
    },

    getNext(): IAstNode | null {
      return next;
    },

    setParent(p: IAstNode): T {
      parent = p;
      return self;
    },

    getParent(): IAstNode | null {
      return parent;
    },

    pushChild(c: IAstNode): T {
      children.push(c);
      return self;
    },

    getChildren(): IAstNode[] {
      return children;
    },
  };
}
