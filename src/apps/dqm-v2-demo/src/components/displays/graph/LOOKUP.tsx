import type { GraphViewStoreStateKey } from "_stores/graph-view/graph-view.store.types.mjs";

type GraphSwitchCyControls = {
  selectors: string[];
  dataKey: string;
};

type GraphSwitchEntry = {
  title: string;
  cy?: GraphSwitchCyControls[];
};

type GraphSwitches = Record<GraphViewStoreStateKey, GraphSwitchEntry>;

export const LOOKUP: GraphSwitches = {
  edge: {
    title: "All Edges",
  },
  node: {
    title: "All Nodes",
  },
  label: {
    title: "All Labels",
  },
  edge_label: {
    title: "Edge Labels",
  },
  node_label: {
    title: "Node Labels",
  },

  ast: {
    title: "Ast",
  },
  ast_label: {
    title: "Ast Labels",
  },
  node_ast: {
    title: "Ast Nodes",
  },
  node_ast_label: {
    title: "Ast Node Labels",
  },
  edge_ast: {
    title: "Ast Edges",
  },
  edge_ast_label: {
    title: "Ast Edge Labels",
  },
  ast_head: {
    title: "Ast Heads",
  },
  node_ast_head: {
    title: "Ast Head Nodes",
    cy: [
      {
        selectors: ["node.ast.head"],
        dataKey: "hidden",
      },
    ],
  },
  node_ast_head_label: {
    title: "Ast Head Nodes Labels",
    cy: [
      {
        selectors: ["node.ast.head"],
        dataKey: "hidden_label",
      },
    ],
  },
  edge_ast_head: {
    title: "Ast Head Edges",
    cy: [
      {
        selectors: ["edge.source-ast.head", "edge.target-ast.head"],
        dataKey: "hidden",
      },
    ],
  },
  edge_ast_head_label: {
    title: "Ast Head Edge Labels",
    cy: [
      {
        selectors: ["edge.source-ast.head", "edge.target-ast.head"],
        dataKey: "hidden_label",
      },
    ],
  },
  ast_extension: {
    title: "Ast Extensions",
  },
  node_ast_extension: {
    title: "Ast Extension Nodes",
    cy: [
      {
        selectors: ["node.ast.extension"],
        dataKey: "hidden",
      },
    ],
  },
  node_ast_extension_label: {
    title: "Ast Extension Node Labels",
    cy: [
      {
        selectors: ["node.ast.extension"],
        dataKey: "hidden_label",
      },
    ],
  },

  edge_ast_extension: {
    title: "Ast Extension Edges",
    cy: [
      {
        selectors: ["edge.source-ast.extension", "edge.target-ast.extension"],
        dataKey: "hidden",
      },
    ],
  },
  edge_ast_extension_label: {
    title: "Ast Extension Edge Labels",
    cy: [
      {
        selectors: ["edge.source-ast.extension", "edge.target-ast.extension"],
        dataKey: "hidden_label",
      },
    ],
  },

  cpx: {
    title: "Cpx",
  },
  cpx_label: {
    title: "Cpx Labels",
  },
  node_cpx: {
    title: "Cpx Nodes",
    cy: [
      {
        selectors: ["node.cpx"],
        dataKey: "hidden",
      },
    ],
  },
  node_cpx_label: {
    title: "Cpx Node Labels",
    cy: [
      {
        selectors: ["node.cpx"],
        dataKey: "hidden_label",
      },
    ],
  },
  edge_cpx: {
    title: "Cpx Edges",
    cy: [
      {
        selectors: ["edge.source-cpx", "edge.target-cpx"],
        dataKey: "hidden",
      },
    ],
  },
  edge_cpx_label: {
    title: "Cpx Edge Labels",
    cy: [
      {
        selectors: ["edge.source-cpx", "edge.target-cpx"],
        dataKey: "hidden_label",
      },
    ],
  },

  cps: {
    title: "All Cps",
  },
  cps_label: {
    title: "Cps Labels",
  },
  node_cps: {
    title: "Cps Nodes",
    cy: [
      {
        selectors: ["node.cps"],
        dataKey: "hidden",
      },
    ],
  },
  node_cps_label: {
    title: "Cps Node Labels",
    cy: [
      {
        selectors: ["node.cps"],
        dataKey: "hidden_label",
      },
    ],
  },
  edge_cps: {
    title: "Cps Edges",
    cy: [
      {
        selectors: ["edge.source-cps", "edge.target-cps"],
        dataKey: "hidden",
      },
    ],
  },
  edge_cps_label: {
    title: "Cps Edge Labels",
    cy: [
      {
        selectors: ["edge.source-cps", "edge.target-cps"],
        dataKey: "hidden_label",
      },
    ],
  },

  param: {
    title: "All Param",
  },
  param_label: {
    title: "Param Labels",
  },
  node_param: {
    title: "Param Nodes",
    cy: [
      {
        selectors: ["node.param"],
        dataKey: "hidden",
      },
    ],
  },
  node_param_label: {
    title: "Param Node Labels",
    cy: [
      {
        selectors: ["node.param"],
        dataKey: "hidden_label",
      },
    ],
  },
  edge_param: {
    title: "Param Edges",
    cy: [
      {
        selectors: ["edge.source-param", "edge.target-param"],
        dataKey: "hidden",
      },
    ],
  },
  edge_param_label: {
    title: "Param Edge Labels",
    cy: [
      {
        selectors: ["edge.source-param", "edge.target-param"],
        dataKey: "hidden_label",
      },
    ],
  },

  astParam: {
    title: "AstParam Nodes",
  },
  astParam_label: {
    title: "AstParam Labels",
  },
  node_astParam: {
    title: "AstParam Nodes",
    cy: [
      {
        selectors: ["node.astParam"],
        dataKey: "hidden",
      },
    ],
  },
  node_astParam_label: {
    title: "AstParam Node Labels",
    cy: [
      {
        selectors: ["node.astParam"],
        dataKey: "hidden_label",
      },
    ],
  },
  edge_astParam: {
    title: "AstParam Edges",
    cy: [
      {
        selectors: ["edge.source-astParam", "edge.target-astParam"],
        dataKey: "hidden",
      },
    ],
  },
  edge_astParam_label: {
    title: "AstParam Edge Labels",
    cy: [
      {
        selectors: ["edge.source-astParam", "edge.target-astParam"],
        dataKey: "hidden_label",
      },
    ],
  },
};
