import type { GlobalToken } from "antd";

// @ts-ignore
export const buildEdges = (token: GlobalToken, fontSize: number) => [
  {
    selector: "edge.cpx-cpx",
    style: {
      "line-color": token.colorPrimary,
      width: 1,
    },
  },
  {
    selector: "edge.cpx-cps",
    style: {
      "line-color": token.colorBgSolid,
      width: 1,
    },
  },
  {
    selector: "edge.cpx-ast",
    style: {
      "line-color": "#202020",
      "line-style": "dashed",
      width: 1,
      opacity: 0,
    },
  },
  {
    selector: "edge.cpx-param",
    style: {
      "line-color": "#05F",
      width: 1,
    },
  },

  {
    selector: "edge.cps-ast.secondary",
    style: {
      "line-color": "#999",
      "line-style": "dashed",
      width: 0.1,
      opacity: 0,
    },
  },

  {
    selector: "edge.cps-ast.head",
    style: {
      "line-color": "#999",
      opacity: 1,
      width: 0.5,
    },
  },
  {
    selector: "edge.ast-ast.sibling",
    style: {
      "line-color": "#556633",
      width: 1,
      opacity: 0,
    },
  },
  {
    selector: "edge.ast-ast.relationship-node",
    style: {
      "line-color": "#aaa",
      width: 0.5,
    },
  },
  {
    selector: "edge.ast-ast.relationship-token",
    style: {
      width: 1,
      "line-color": "#404",
    },
  },
  {
    selector: "edge.ast-ast.relationship-space",
    style: {
      "line-color": "#044",
      width: 1,
    },
  },
  {
    selector: "edge.ast-ast.relationship-external",
    style: {
      "line-color": "#FF0000",
      width: 0.2,
    },
  },
];
