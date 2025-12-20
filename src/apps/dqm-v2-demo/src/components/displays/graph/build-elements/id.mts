import { DqmDemoError } from "../../../../errors/dqm-demo-error.mts";
import type { Elems, IdValue, Product, ProductMap, WM } from "./build.types";

export const INIT_ID = 1e6;

export class Id {
  private static id: IdValue = INIT_ID;
  private static seen: WM = new WeakMap();
  private static sources: Elems = new Map();
  private static products: ProductMap = new Map();

  static reset() {
    Id.id = INIT_ID;
    Id.seen = new WeakMap();
  }

  static has(node: any): boolean {
    return Id.seen.has(node);
  }

  static getNew(node: any): IdValue {
    if (Id.seen.has(node)) {
      return Id.seen.get(node)!;
    }
    const newId = Id.id++;
    Id.seen.set(node, newId);
    Id.sources.set(newId, node);
    return newId;
  }

  static getId(node: any): IdValue {
    const n = Id.seen.get(node);
    if (!n) {
      // console.log("node:", node, "elems:", Id.elems, "seen:", Id.seen);
      console.log("node:", node, "seen:", Id.seen);
      throw new Error("Node hasn't been seen before");
    }
    return n;
  }

  static getSource<T>(id: number): T {
    const n = Id.sources.get(+id);
    if (!n) {
      // console.log("id:", id, "elems:", Id.elems, "seen:", Id.seen);
      throw new Error("Node hasn't been seen before");
    }
    return n;
  }

  static setProduct(id: IdValue, product: Product) {
    if (!Id.sources.has(id)) {
      throw new DqmDemoError({
        code: "UNREGISTERED_SOURCE",
        why: "Cannot register a product for an unregistered source",
        cause: null,
        details: { id, product },
      });
    }
    if (Id.products.has(id)) {
      throw new DqmDemoError({
        code: "VALUE_EXISTS",
        why: "A product has already been registered for the given id",
        cause: null,
        details: { id, product },
      });
    }
    Id.products.set(id, product);
  }
}
