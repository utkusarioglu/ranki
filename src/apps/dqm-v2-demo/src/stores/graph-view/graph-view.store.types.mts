export type GraphViewStore = GraphViewStoreActions & GraphViewStoreState;

export interface GraphViewStoreState {
  // AST
  ast: boolean;
  ast_extension: boolean;
  ast_head: true;
  ast_label: boolean;
  // RAW PARAM
  astParam: boolean;

  astParam_label: boolean;
  // CPS
  cps: boolean;
  cps_label: boolean;
  // PARAM
  cpsParam: boolean;
  cpsParam_label: boolean;
  // CPX
  cpx: boolean;
  cpx_label: boolean;
  edge: boolean;
  edge_ast: boolean;
  edge_ast_extension: boolean;
  edge_ast_extension_label: boolean;
  edge_ast_head: boolean;
  edge_ast_head_label: boolean;
  edge_ast_label: boolean;
  edge_astParam: boolean;
  edge_astParam_label: boolean;

  edge_cps: boolean;
  edge_cps_label: boolean;
  edge_cpsParam: boolean;
  edge_cpsParam_label: boolean;
  edge_cpx: boolean;
  edge_cpx_label: boolean;

  edge_label: boolean;
  label: boolean;
  node: boolean;
  node_ast: boolean;
  node_ast_extension: boolean;
  node_ast_extension_label: boolean;

  node_ast_head: boolean;
  node_ast_head_label: boolean;
  node_ast_label: boolean;
  node_astParam: boolean;
  node_astParam_label: boolean;
  node_cps: boolean;

  node_cps_label: boolean;
  node_cpsParam: boolean;
  node_cpsParam_label: boolean;
  node_cpx: boolean;
  node_cpx_label: boolean;
  node_label: boolean;
}

export type GraphViewStoreStateKey = keyof GraphViewStoreState;

interface GraphViewStoreActions {
  setVisibility: (prop: GraphViewStoreStateKey, state: boolean) => void;
}
