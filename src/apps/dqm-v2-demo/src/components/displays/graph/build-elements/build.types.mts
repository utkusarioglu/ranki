import type { ICpx, IAstNode, ICps } from "@dqm/package-dqm-api-v2";
import type { DqmNodeTypes } from "_types/vendor/dqm.types.mjs";
import type { ClassSanitizerUnion } from "@dqm/package-dqm-v2-debug";

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

export type NodeMap = Map<IdValue, N>;
export type EdgeMap = Map<string, E>;
export type SanitizedMap = Map<IdValue, SanitizedDqmNodeTypes>;

export type SanitizedDqmNodeTypes = ClassSanitizerUnion<DqmNodeTypes>;

export type Traversal = TraversalNode | null | undefined;

export interface TraversalNode {
  raw: any;
  node: N | null;
  relations: Record<string, TraversalNode[]>;
  edges: Record<string, E[]>;
}

export type Flattened = (N | E)[];
