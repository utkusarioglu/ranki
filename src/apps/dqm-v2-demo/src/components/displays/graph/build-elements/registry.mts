import { assertNotUndefined } from "_assertions";
import { DqmDemoError } from "_error";

import type {
  E,
  EdgeMap,
  Elems,
  IdValue,
  N,
  NodeMap,
  SanitizedMap,
  WM,
} from "./build.types.mts";

const INIT_ID = 1e6;

export class Registry {
  private static edges: EdgeMap = new Map();
  private static id: IdValue = INIT_ID;
  private static nodes: NodeMap = new Map();
  private static sanitized: SanitizedMap = new Map();
  private static seen: WM = new WeakMap();
  private static sources: Elems = new Map();

  static getEdge(source: IdValue, target: IdValue): E {
    const key = Registry.makeEdgeKey(source, target);
    const edge = this.edges.get(key);
    assertNotUndefined(edge, {
      why: "Tried to get the node for an id that hasn't registered its node",
    });
    return edge;
  }

  static getId(node: any): IdValue {
    const n = Registry.seen.get(node);
    if (!n) {
      console.log("-", node);
      throw new DqmDemoError({
        cause: null,
        code: "UNREGISTERED_NODE",
        details: {
          node: node.constructor.name,
        },
        why: "Cannot return ids for nodes that hasn't been registered",
      });
    }
    return n;
  }

  static getNew(node: any): IdValue {
    if (Registry.seen.has(node)) {
      return Registry.seen.get(node)!;
    }
    const newId = Registry.id++;
    Registry.seen.set(node, newId);
    Registry.sources.set(newId, node);
    return newId;
  }

  static getNode(source: any): N {
    const id = this.seen.get(source);
    assertNotUndefined(id, {
      why: "Tried to get the id of a source that hasn't been registered",
    });
    const node = this.nodes.get(id);
    assertNotUndefined(node, {
      why: "Tried to get the node for an id that hasn't registered its node",
    });
    return node;
  }

  static getProductArray(): (E | N)[] {
    return [...Array.from(Registry.nodes), ...Array.from(Registry.edges)].map(
      (v) => v[1],
    );
  }

  static getSanitized(id: IdValue) {
    const sanitized = this.sanitized.get(+id);
    assertNotUndefined(sanitized, {
      why: "Tried to get the sanitized package for an id that hasn't registered its node",
    });
    return sanitized;
  }

  static getSource<T>(id: number): T {
    const n = Registry.sources.get(+id);
    if (!n) {
      throw new Error("Node hasn't been seen before");
    }
    return n;
  }

  static has(node: any): boolean {
    return Registry.seen.has(node);
  }

  static registerEdge(edge: E) {
    const key = Registry.makeEdgeKey(edge.data.source, edge.data.target);
    if (Registry.edges.has(key)) {
      throw new DqmDemoError({
        cause: null,
        code: "VALUE_EXISTS",
        details: { edge, key },
        why: "A source-target pair can only register a single edge",
      });
    }
    Registry.edges.set(key, edge);
  }

  static registerNode(node: N) {
    if (Registry.nodes.has(node.data.id)) {
      throw new DqmDemoError({
        cause: null,
        code: "VALUE_EXISTS",
        details: { node, nodes: Registry.nodes },
        why: "A node has already been registered for the given id",
      });
    }
    Registry.nodes.set(node.data.id, node);
  }

  static registerSanitized(id: IdValue, sanitized: any) {
    if (Registry.sanitized.has(id)) {
      throw new DqmDemoError({
        cause: null,
        code: "VALUE_EXISTS",
        details: { id, nodes: Registry.nodes },
        why: "A sanitized package has already been registered for the given id",
      });
    }
    Registry.sanitized.set(id, sanitized);
  }

  static reset() {
    Registry.id = INIT_ID;
    Registry.seen = new WeakMap();
    Registry.nodes = new Map();
    Registry.sources = new Map();
    Registry.edges = new Map();
    Registry.sanitized = new Map();
  }

  private static makeEdgeKey(source: IdValue, target: IdValue): string {
    return `${source}-${target}`;
  }
}
