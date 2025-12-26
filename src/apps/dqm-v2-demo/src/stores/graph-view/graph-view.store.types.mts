export type GraphViewStore = GraphViewStoreState & GraphViewStoreActions;

export interface GraphViewStoreState {
  node: boolean;
  edge: boolean;
  label: boolean;
  edge_label: boolean;
  node_label: boolean;

  // AST
  ast: boolean;
  ast_label: boolean;
  node_ast: boolean;
  node_ast_label: boolean;
  edge_ast: boolean;
  edge_ast_label: boolean;
  ast_head: true;
  node_ast_head: boolean;
  node_ast_head_label: boolean;
  edge_ast_head: boolean;
  edge_ast_head_label: boolean;
  ast_extension: boolean;
  node_ast_extension: boolean;
  node_ast_extension_label: boolean;
  edge_ast_extension: boolean;
  edge_ast_extension_label: boolean;

  // CPX
  cpx: boolean;
  cpx_label: boolean;
  node_cpx: boolean;
  node_cpx_label: boolean;
  edge_cpx: boolean;
  edge_cpx_label: boolean;

  // CPS
  cps: boolean;
  cps_label: boolean;
  node_cps: boolean;
  node_cps_label: boolean;
  edge_cps: boolean;
  edge_cps_label: boolean;

  // PARAM
  param: boolean;
  param_label: boolean;
  node_param: boolean;
  node_param_label: boolean;
  edge_param: boolean;
  edge_param_label: boolean;

  // RAW PARAM
  astParam: boolean;
  astParam_label: boolean;
  node_astParam: boolean;
  node_astParam_label: boolean;
  edge_astParam: boolean;
  edge_astParam_label: boolean;
}

export type GraphViewStoreStateKey = keyof GraphViewStoreState;

interface GraphViewStoreActions {
  setVisibility: (prop: GraphViewStoreStateKey, state: boolean) => void;
}
