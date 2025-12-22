import { assertExists } from "../../../../errors/assertions.mts";
import { DqmDemoError } from "../../../../errors/dqm-demo-error.mts";
import type { E, EdgeMap, Elems, IdValue, N, NodeMap, WM } from "./build.types";

export const INIT_ID = 1e6;

export class Registry {
  private static id: IdValue = INIT_ID;
  private static seen: WM = new WeakMap();
  private static sources: Elems = new Map();
  private static nodes: NodeMap = new Map();
  private static edges: EdgeMap = new Map();

  static reset() {
    Registry.id = INIT_ID;
    Registry.seen = new WeakMap();
    Registry.nodes = new Map();
    Registry.sources = new Map();
    Registry.edges = new Map();
  }

  static has(node: any): boolean {
    return Registry.seen.has(node);
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

  static getId(node: any): IdValue {
    const n = Registry.seen.get(node);
    if (!n) {
      // console.log("node:", node, "elems:", Id.elems, "seen:", Id.seen);
      // console.log("node:", node, "seen:", Registry.seen);
      throw new Error("Node hasn't been seen before");
    }
    return n;
  }

  static getSource<T>(id: number): T {
    const n = Registry.sources.get(+id);
    if (!n) {
      // console.log("id:", id, "elems:", Id.elems, "seen:", Id.seen);
      throw new Error("Node hasn't been seen before");
    }
    return n;
  }

  static registerNode(node: N) {
    if (Registry.nodes.has(node.data.id)) {
      throw new DqmDemoError({
        code: "VALUE_EXISTS",
        why: "A node has already been registered for the given id",
        details: { node, nodes: Registry.nodes },
        cause: null,
      });
    }
    Registry.nodes.set(node.data.id, node);
  }

  static getNode(source: any): N {
    const id = this.seen.get(source);
    assertExists(id, {
      why: "Tried to get the id of a source that hasn't been registered",
    });
    const node = this.nodes.get(id);
    assertExists(node, {
      why: "Tried to get the node for an id that hasn't registered its node",
    });
    return node;
  }

  private static makeEdgeKey(source: IdValue, target: IdValue): string {
    return `${source}-${target}`;
  }

  static getEdge(source: IdValue, target: IdValue): E {
    const key = Registry.makeEdgeKey(source, target);
    // const id = this.seen.get(source);
    // assertExists(id, {
    //   why: "Tried to get the id of a source that hasn't been registered",
    // });
    const edge = this.edges.get(key);
    assertExists(edge, {
      why: "Tried to get the node for an id that hasn't registered its node",
    });
    return edge;
  }

  static registerEdge(edge: E) {
    const key = Registry.makeEdgeKey(edge.data.source, edge.data.target);
    if (Registry.edges.has(key)) {
      throw new DqmDemoError({
        code: "VALUE_EXISTS",
        why: "A source-target pair can only register a single edge",
        details: { key, edge },
        cause: null,
      });
    }
    Registry.edges.set(key, edge);
  }

  static getProductArray(): (N | E)[] {
    return [...Array.from(Registry.nodes), ...Array.from(Registry.edges)].map(
      (v) => v[1],
    );
  }
}
