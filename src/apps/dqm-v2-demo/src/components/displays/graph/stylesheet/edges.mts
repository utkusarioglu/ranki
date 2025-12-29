import type { GlobalToken } from "antd";

// @ts-ignore
export const buildEdges = (token: GlobalToken, fontSize: number) => [
  {
    selector: "edge",
    style: {
      label: "data(label)",
      "curve-style": "straight",

      "text-valign": "center",
      "text-halign": "left",
      "text-margin-x": -6,
      "font-size": fontSize * 0.8,

      "text-background-color": token.colorBgContainer,
      "text-background-opacity": 0.8,
      "text-background-shape": "roundrectangle", // or rectangle
      "text-background-padding": "3px",

      "target-arrow-shape": "triangle",
    },
  },

  {
    selector: "edge.source-cpx.target-cpx",
    style: {
      "line-color": token.colorPrimary,
      color: token.colorPrimary,
      "target-arrow-color": token.colorPrimary,
      width: 1,
    },
  },
  {
    selector: "edge.source-cpx.target-cps",
    style: {
      "line-color": token.colorBgSolid,
      color: token.colorBgSolid,
      "target-arrow-color": token.colorBgSolid,
      width: 1,
    },
  },
  {
    selector: "edge.source-cpx.target-ast",
    style: {
      "line-color": "#202020",
      "target-arrow-color": "#202020",
      color: "#AAA",
      "line-style": "dashed",
      width: 1,
    },
  },

  {
    selector: "edge.source-cpx.target-astParam",
    style: {
      "line-color": "#05F",
      "target-arrow-color": "#05F",
      color: "#05F",
      width: 1,
    },
  },
  {
    selector: "edge.source-cpx.target-astParam",
    style: {
      "line-color": "#06F",
      "target-arrow-color": "#06F",
      color: "#06F",
      width: 1,
    },
  },

  {
    selector: "edge.source-cps.target-cps.relationship-child",
    style: {
      "line-color": "#904",
      "target-arrow-color": "#904",
      color: "#904",
      width: 0.4,
    },
  },
  {
    selector: "edge.source-cps.target-cps.relationship-sibling",
    style: {
      "line-color": "#409",
      "target-arrow-color": "#409",
      color: "#409",
      "line-style": "dashed",
      width: 0.1,
      // opacity: 0,
    },
  },

  {
    selector: "edge.source-cps.target-ast.extension",
    style: {
      "line-color": "#999",
      "target-arrow-color": "#999",
      color: "#999",
      "line-style": "dashed",
      width: 0.1,
      // opacity: 0,
    },
  },

  {
    selector: "edge.source-cps.target-ast.head",
    style: {
      "line-color": "#999",
      "target-arrow-color": "#999",
      color: "#999",
      // opacity: 1,
      width: 0.5,
    },
  },
  {
    selector: "edge.source-ast.target-ast.relationship-sibling",
    style: {
      "line-color": "#556633",
      "target-arrow-color": "#556633",
      color: "#556633",
      width: 1,
      // opacity: 0,
    },
  },
  {
    selector: "edge.source-ast.target-ast.relationship-node",
    style: {
      "line-color": "#aaa",
      "target-arrow-color": "#aaa",
      color: "#aaa",
      width: 0.5,
    },
  },
  {
    selector: "edge.source-ast.target-ast.relationship-token",
    style: {
      width: 1,
      "line-color": "#404",
      "target-arrow-color": "#404",
      color: "#404",
    },
  },
  {
    selector: "edge.source-ast.target-ast.relationship-space",
    style: {
      "line-color": "#044",
      "target-arrow-color": "#044",
      color: "#044",
      width: 1,
    },
  },
  {
    selector: "edge.source-ast.target-ast.relationship-external",
    style: {
      "line-color": "#FF0000",
      "target-arrow-color": "#FF0000",
      color: "#FF0000",
      width: 1,
    },
  },

  {
    selector: "edge.source-cps.target-cpsParam.producer-instance-declaration",
    style: {
      "line-color": "#0FF",
      "target-arrow-color": "#0FF",
      color: "#0FF",
      width: 1,
    },
  },

  {
    // !FIX
    selector: "edge.source-cps.target-cpsParam.producer-component-default",
    style: {
      "line-color": "#0F4",
      "target-arrow-color": "#0F4",
      color: "#0F4",
      width: 1,
    },
  },

  {
    selector: "edge.source-cpsParam.target-astParam",
    style: {
      "line-color": "#45f",
      "target-arrow-color": "#45f",
      color: "#45f",
      width: 1,
    },
  },
];
