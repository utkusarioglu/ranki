import type { ICpx, IAstNode, ICps } from "@dqm/package-dqm-api-v2";
import type { E } from "./walk.types";

type WM = WeakMap<IAstNode | ICpx | ICps, IdValue>;
type Elems = Map<IdValue, any>;

export const INIT_ID = 1e6;

type IdValue = number & { type?: "IdValue" };
export class Id {
  private static id: IdValue = INIT_ID;
  private static seen: WM = new WeakMap();
  private static elems: Elems = new Map();

  static reset() {
    Id.id = INIT_ID;
    Id.seen = new WeakMap();
  }

  static getNew(node: any): IdValue | null {
    if (Id.seen.has(node)) {
      return null;
    }
    const newId = Id.id++;
    Id.seen.set(node, newId);
    Id.elems.set(newId, node);
    return newId;
  }

  static getId(node: any): IdValue {
    const n = Id.seen.get(node);
    if (!n) {
      throw new Error("Node hasn't been seen before");
    }
    return n;
  }

  static getElem<T>(id: number): T {
    const n = Id.elems.get(+id);
    if (!n) {
      throw new Error("Node hasn't been seen before");
    }
    return n;
  }
}

export function run(root: IAstNode): Flattened | null {
  Id.reset();
  const rootCpx = root.getCpx();
  const traversed = traverseCpx(rootCpx);
  if (!traversed) {
    return null;
  }
  const flattened = flatten(traversed);
  return flattened;
}

interface N {
  data: {
    id: number;
    label: string;
  };
}

type Traversal = TraversalNode | null | undefined;

interface TraversalNode {
  raw: any;
  node: N;
  relations: Record<string, TraversalNode[]>;
  edges: Record<string, E[]>;
}

type Flattened = (N | E)[];

function traverseCpx(root: ICpx): Traversal {
  if (!root) {
    return undefined;
  }
  const id = Id.getNew(root);
  if (id === null) {
    return null;
  }
  const node = {
    data: {
      id,
      label:
        "cpx:" +
        root
          .getChainList()
          .map((v) => v.join("."))
          .join(" | "),
    },
    classes: "cpx",
  };

  const childrenNodes = root
    .getChildren()
    .map((r) => traverseCpx(r))
    .filter((v) => !!v);

  const childrenEdges = childrenNodes.map((c) => ({
    data: {
      source: node.data.id,
      target: c.node.data.id,
      label: "child",
    },
    classes: "cpx-cpx",
  }));

  const cpsChildren = root
    .getCpsList()
    .map((c) => traverseCps(c))
    .filter((v) => !!v);

  const cpsEdges = cpsChildren.map((c) => ({
    data: {
      source: node.data.id,
      target: c.node.data.id,
      label: "cpx-cps",
    },
    classes: "cpx-cps",
  }));

  const astChild = [traverseAst(root.getRootAst(), root, 0, "subtree")].filter(
    (v) => !!v,
  );

  return {
    raw: root,
    node,
    relations: {
      children: childrenNodes,
      cps: cpsChildren,
      ast: astChild,
    },
    edges: {
      children: childrenEdges,
      cps: cpsEdges,
      // ast: astEdge,
    },
  };
}

function traverseAst(
  root: IAstNode,
  cpx: ICpx,
  depth: number,
  classExtra?: string,
): Traversal {
  if (!root) {
    return undefined;
  }
  // this would check whether the ast node is within the domain of the current cpx
  if (root.getCpx() !== cpx) {
    // TODO this should check whether the parent is in cpx, which would mean that this has an external edge
    return undefined;
  }
  // this would check whether this node has been seen before
  const id = Id.getNew(root);
  if (id === null) {
    return null;
  }
  const node = {
    data: {
      id,
      label: "ast:" + root.getCreator(),
    },
    classes: ["ast", classExtra].filter((v) => !!v).join(" "),
  };

  const cpxEdges = [
    {
      data: {
        source: Id.getId(cpx),
        target: node.data.id,
        label: "cpx",
      },
      classes: ["cpx-ast", `depth-${depth}`].join(" "),
    },
  ];

  const cpsEdges = cpx.getCpsList().map((n) => ({
    data: {
      source: Id.getId(n),
      target: node.data.id,
      label: "cps-ast",
    },
    classes: ["cps-ast", `depth-${depth}`, depth === 0 && "head"]
      .filter((v) => !!v)
      .join(" "),
  }));

  const subtreeNodes = root
    .getSubtreeNodes()
    .map((n) => traverseAst(n, cpx, depth + 1, "subtree"))
    .filter((v) => !!v);

  const subtreeEdges = subtreeNodes.map((n) => ({
    data: {
      source: node.data.id,
      target: n.node.data.id,
      label: "subtree",
    },
    classes: ["ast-ast", "subtree", `depth-${depth}`].join(" "),
  }));

  const childrenNodes = root
    .getChildrenNodes()
    .map((n) => traverseAst(n, cpx, depth + 1, "child"))
    .filter((v) => !!v);

  const childrenEdges = childrenNodes.map((n) => ({
    data: {
      source: node.data.id,
      target: n.node.data.id,
      label: "child",
    },
    classes: ["ast-ast", "child", `depth-${depth}`].join(" "),
  }));

  return {
    raw: root,
    node,
    relations: {
      subtree: subtreeNodes,
      // children: childrenNodes,
    },
    edges: {
      subtree: subtreeEdges,
      cpx: cpxEdges,
      cps: cpsEdges,
      children: childrenEdges,
    },
  };
}

function traverseCps(root: ICps): Traversal {
  if (root === undefined) {
    return undefined;
  }
  const id = Id.getNew(root);
  if (id === null) {
    return null;
  }
  const node = {
    data: {
      id,
      label: "cps:" + root.getId().getChain().join("."),
    },
    classes: "cps",
  };

  return {
    raw: root,
    node,
    relations: {},
    edges: {},
  };
}

function flatten(t: TraversalNode): Flattened {
  const nodes: (N | E)[] = [];

  Object.values(t.relations)
    .map((n) => n.map((v) => flatten(v)))
    .forEach((n) => n.forEach((v) => nodes.push(...v)));

  nodes.push(t.node);
  Object.values(t.edges).forEach((e) => nodes.push(...e));
  // nodes.push(...t.edges);

  return nodes;
}
