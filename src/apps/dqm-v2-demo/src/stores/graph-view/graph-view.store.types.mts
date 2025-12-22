export type GraphViewStore = GraphViewStoreState & GraphViewStoreActions;

interface GraphViewStoreState {
  ast: boolean;
  cpx: boolean;
  cps: boolean;
  param: boolean;
  rawParam: boolean;

  edgeLabels: boolean;
}

interface GraphViewStoreActions {
  setAst: (ast: GraphViewStoreState["ast"]) => void;
  setCpx: (cpx: GraphViewStoreState["cpx"]) => void;
  setCps: (cps: GraphViewStoreState["cps"]) => void;
  setParam: (param: GraphViewStoreState["param"]) => void;
  setRawParam: (rawParam: GraphViewStoreState["rawParam"]) => void;
  setEdgeLabels: (edgeLabels: GraphViewStoreState["edgeLabels"]) => void;
}
