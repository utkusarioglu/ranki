import type { GraphViewStoreStateKey } from "_stores/graph-view/graph-view.store.types.mjs";

type GraphSwitchCyControls = {
  dataKey: string;
  selectors: string[];
};

type GraphSwitchEntry = {
  cy?: GraphSwitchCyControls[];
  title: string;
};

type GraphSwitches = Record<GraphViewStoreStateKey, GraphSwitchEntry>;

export const LOOKUP: GraphSwitches = {
  ast: {
    title: "Ast",
  },
  ast_extension: {
    title: "Ast Extensions",
  },
  ast_head: {
    title: "Ast Heads",
  },
  ast_label: {
    title: "Ast Labels",
  },
  astParam: {
    title: "AstParam Nodes",
  },

  astParam_label: {
    title: "AstParam Labels",
  },
  cps: {
    title: "All Cps",
  },
  cps_label: {
    title: "Cps Labels",
  },
  cpsParam: {
    title: "All Param",
  },
  cpsParam_label: {
    title: "Param Labels",
  },
  cpx: {
    title: "Cpx",
  },
  cpx_label: {
    title: "Cpx Labels",
  },
  edge: {
    title: "All Edges",
  },
  edge_ast: {
    title: "Ast Edges",
  },
  edge_ast_extension: {
    cy: [
      {
        dataKey: "hidden",
        selectors: ["edge.source-ast.extension", "edge.target-ast.extension"],
      },
    ],
    title: "Ast Extension Edges",
  },
  edge_ast_extension_label: {
    cy: [
      {
        dataKey: "hidden_label",
        selectors: ["edge.source-ast.extension", "edge.target-ast.extension"],
      },
    ],
    title: "Ast Extension Edge Labels",
  },
  edge_ast_head: {
    cy: [
      {
        dataKey: "hidden",
        selectors: ["edge.source-ast.head", "edge.target-ast.head"],
      },
    ],
    title: "Ast Head Edges",
  },
  edge_ast_head_label: {
    cy: [
      {
        dataKey: "hidden_label",
        selectors: ["edge.source-ast.head", "edge.target-ast.head"],
      },
    ],
    title: "Ast Head Edge Labels",
  },
  edge_ast_label: {
    title: "Ast Edge Labels",
  },

  edge_astParam: {
    cy: [
      {
        dataKey: "hidden",
        selectors: ["edge.source-astParam", "edge.target-astParam"],
      },
    ],
    title: "AstParam Edges",
  },
  edge_astParam_label: {
    cy: [
      {
        dataKey: "hidden_label",
        selectors: ["edge.source-astParam", "edge.target-astParam"],
      },
    ],
    title: "AstParam Edge Labels",
  },

  edge_cps: {
    cy: [
      {
        dataKey: "hidden",
        selectors: ["edge.source-cps", "edge.target-cps"],
      },
    ],
    title: "Cps Edges",
  },
  edge_cps_label: {
    cy: [
      {
        dataKey: "hidden_label",
        selectors: ["edge.source-cps", "edge.target-cps"],
      },
    ],
    title: "Cps Edge Labels",
  },
  edge_cpsParam: {
    cy: [
      {
        dataKey: "hidden",
        selectors: ["edge.source-cpsParam", "edge.target-cpsParam"],
      },
    ],
    title: "Param Edges",
  },
  edge_cpsParam_label: {
    cy: [
      {
        dataKey: "hidden_label",
        selectors: ["edge.source-cpsParam", "edge.target-cpsParam"],
      },
    ],
    title: "Param Edge Labels",
  },
  edge_cpx: {
    cy: [
      {
        dataKey: "hidden",
        selectors: ["edge.source-cpx", "edge.target-cpx"],
      },
    ],
    title: "Cpx Edges",
  },
  edge_cpx_label: {
    cy: [
      {
        dataKey: "hidden_label",
        selectors: ["edge.source-cpx", "edge.target-cpx"],
      },
    ],
    title: "Cpx Edge Labels",
  },

  edge_label: {
    title: "Edge Labels",
  },
  label: {
    title: "All Labels",
  },
  node: {
    title: "All Nodes",
  },
  node_ast: {
    title: "Ast Nodes",
  },
  node_ast_extension: {
    cy: [
      {
        dataKey: "hidden",
        selectors: ["node.ast.extension"],
      },
    ],
    title: "Ast Extension Nodes",
  },
  node_ast_extension_label: {
    cy: [
      {
        dataKey: "hidden_label",
        selectors: ["node.ast.extension"],
      },
    ],
    title: "Ast Extension Node Labels",
  },

  node_ast_head: {
    cy: [
      {
        dataKey: "hidden",
        selectors: ["node.ast.head"],
      },
    ],
    title: "Ast Head Nodes",
  },
  node_ast_head_label: {
    cy: [
      {
        dataKey: "hidden_label",
        selectors: ["node.ast.head"],
      },
    ],
    title: "Ast Head Nodes Labels",
  },
  node_ast_label: {
    title: "Ast Node Labels",
  },
  node_astParam: {
    cy: [
      {
        dataKey: "hidden",
        selectors: ["node.astParam"],
      },
    ],
    title: "AstParam Nodes",
  },
  node_astParam_label: {
    cy: [
      {
        dataKey: "hidden_label",
        selectors: ["node.astParam"],
      },
    ],
    title: "AstParam Node Labels",
  },
  node_cps: {
    cy: [
      {
        dataKey: "hidden",
        selectors: ["node.cps"],
      },
    ],
    title: "Cps Nodes",
  },

  node_cps_label: {
    cy: [
      {
        dataKey: "hidden_label",
        selectors: ["node.cps"],
      },
    ],
    title: "Cps Node Labels",
  },
  node_cpsParam: {
    cy: [
      {
        dataKey: "hidden",
        selectors: ["node.cpsParam"],
      },
    ],
    title: "Param Nodes",
  },
  node_cpsParam_label: {
    cy: [
      {
        dataKey: "hidden_label",
        selectors: ["node.cpsParam"],
      },
    ],
    title: "Param Node Labels",
  },
  node_cpx: {
    cy: [
      {
        dataKey: "hidden",
        selectors: ["node.cpx"],
      },
    ],
    title: "Cpx Nodes",
  },
  node_cpx_label: {
    cy: [
      {
        dataKey: "hidden_label",
        selectors: ["node.cpx"],
      },
    ],
    title: "Cpx Node Labels",
  },
  node_label: {
    title: "Node Labels",
  },
};
