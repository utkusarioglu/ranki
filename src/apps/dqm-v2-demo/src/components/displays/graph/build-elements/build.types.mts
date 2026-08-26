import type { DqmNodeTypes } from "_types/vendor/dqm.types.mjs";
import type { IAstNode, ICps, ICpx } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizerUnion } from "@dqm/package-dqm-v2-debug";

/**
 * Cytoscape Edge
 */
export interface E {
  classes: string;
  data: {
    label: string;
    source: number;
    target: number;
  };
}

export type EdgeMap = Map<string, E>;

export type Elems = Map<IdValue, any>;

export type Flattened = (E | N)[];

export type IdValue = { type?: "IdValue" } & number;

/**
 * Cytoscape Node
 */
export interface N {
  classes: string;
  data: {
    id: number;
    label: string;
  };
}
export type NodeMap = Map<IdValue, N>;
export type SanitizedDqmNodeTypes = ClassSanitizerUnion<DqmNodeTypes>;

export type SanitizedMap = Map<IdValue, SanitizedDqmNodeTypes>;

// type Traversal = TraversalNode | null | undefined;

export interface TraversalNode {
  edges: Record<string, E[]>;
  node: N | null;
  raw: any;
  relations: Record<string, TraversalNode[]>;
}

export type WM = WeakMap<IAstNode | ICps | ICpx, IdValue>;
