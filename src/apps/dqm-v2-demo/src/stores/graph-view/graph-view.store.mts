import { create } from "zustand";
import type {
  GraphViewStore,
  GraphViewStoreState,
} from "./graph-view.store.types.mts";

export const graphViewStoreInitialState: GraphViewStoreState = {
  node: true,
  edge: true,
  label: true,
  edge_label: true,
  node_label: true,

  // AST
  ast: true,
  ast_label: true,
  node_ast: true,
  node_ast_label: true,
  edge_ast: true,
  edge_ast_label: true,
  ast_head: true,
  node_ast_head: true,
  node_ast_head_label: true,
  edge_ast_head: true,
  edge_ast_head_label: true,
  ast_extension: true,
  node_ast_extension: true,
  node_ast_extension_label: true,
  edge_ast_extension: true,
  edge_ast_extension_label: true,

  cpx: true,
  cpx_label: true,
  node_cpx: true,
  node_cpx_label: true,
  edge_cpx: true,
  edge_cpx_label: true,

  cps: true,
  cps_label: true,
  node_cps: true,
  node_cps_label: true,
  edge_cps: true,
  edge_cps_label: true,

  param: true,
  param_label: true,
  node_param: true,
  node_param_label: true,
  edge_param: true,
  edge_param_label: true,

  astParam: true,
  astParam_label: true,
  node_astParam: true,
  node_astParam_label: true,
  edge_astParam: true,
  edge_astParam_label: true,
};

export const useGraphViewStore = create<GraphViewStore>((set) => ({
  ...graphViewStoreInitialState,

  setVisibility: (key, visible) =>
    set((state) => {
      const k = key.split("_");
      return Object.fromEntries(
        Object.keys(state)
          .filter((v) => isSubset(k, new Set(v.split("_"))))
          .map((k) => [k, visible]),
      );
    }),
}));

const isSubset = (a: string[], B: Set<string>) => [...a].every((x) => B.has(x));
