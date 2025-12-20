import type { ICpx, IAstNode, ICps } from "@dqm/package-dqm-api-v2";

/**
 * Cytoscape Edge
 */
export interface E {
  data: {
    source: number;
    target: number;
    label: string;
  };
  classes: string;
}

/**
 * Cytoscape Node
 */
export interface N {
  data: {
    id: number;
    label: string;
  };
  classes: string;
}

export type IdValue = number & { type?: "IdValue" };

export type WM = WeakMap<IAstNode | ICpx | ICps, IdValue>;

export type Elems = Map<IdValue, any>;

export type Product = E | N;
export type ProductMap = Map<IdValue, Product>;

export type Traversal = TraversalNode | null | undefined;

export interface TraversalNode {
  raw: any;
  node: N | null;
  relations: Record<string, TraversalNode[]>;
  edges: Record<string, E[]>;
}

export type Flattened = (N | E)[];
