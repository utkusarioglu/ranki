import type { GlobalToken } from "antd";

// @ts-ignore
export const buildEdges = (token: GlobalToken, fontSize: number) => [
  {
    selector: "edge",
    style: {
      // "curve-style": "segments",
      // "curve-style": "taxi",
      "control-point-step-size": 200,
      "curve-style": "straight",
      "font-size": fontSize * 0.8,

      label: "data(label)",
      "target-arrow-shape": "triangle",
      "text-background-color": token.colorBgContainer,
      "text-background-opacity": 0.8,

      "text-background-padding": "3px",
      "text-background-shape": "roundrectangle", // or rectangle
      "text-halign": "left",
      "text-margin-x": -6,

      "text-valign": "center",
    },
  },

  {
    selector: "edge.source-cpx.target-cpx",
    style: {
      color: token.colorPrimary,
      "line-color": token.colorPrimary,
      "target-arrow-color": token.colorPrimary,
      width: 1,
    },
  },
  {
    selector: "edge.source-cpx.target-cps",
    style: {
      color: token.colorBgSolid,
      "line-color": token.colorBgSolid,
      "target-arrow-color": token.colorBgSolid,
      width: 1,
    },
  },
  {
    selector: "edge.source-cpx.target-ast",
    style: {
      color: "#AAA",
      "line-color": "#202020",
      "line-style": "dashed",
      "target-arrow-color": "#202020",
      width: 1,
    },
  },

  {
    selector: "edge.source-cpx.target-astParam",
    style: {
      color: "#05F",
      "line-color": "#05F",
      "target-arrow-color": "#05F",
      width: 1,
    },
  },
  {
    selector: "edge.source-cpx.target-astParam",
    style: {
      color: "#06F",
      "line-color": "#06F",
      "target-arrow-color": "#06F",
      width: 1,
    },
  },

  {
    selector: "edge.source-cps.target-cps.relationship-child",
    style: {
      color: "#904",
      "line-color": "#904",
      "target-arrow-color": "#904",
      width: 0.4,
    },
  },
  {
    selector: "edge.source-cps.target-cps.relationship-sibling",
    style: {
      color: "#409",
      "line-color": "#409",
      "line-style": "dashed",
      "target-arrow-color": "#409",
      width: 0.1,
      // opacity: 0,
    },
  },

  {
    selector: "edge.source-cps.target-ast.extension",
    style: {
      color: "#999",
      "line-color": "#999",
      "line-style": "dashed",
      "target-arrow-color": "#999",
      width: 0.1,
      // opacity: 0,
    },
  },

  {
    selector: "edge.source-cps.target-ast.head",
    style: {
      color: "#999",
      "line-color": "#999",
      "target-arrow-color": "#999",
      // opacity: 1,
      width: 0.5,
    },
  },
  {
    selector: "edge.source-ast.target-ast.relationship-sibling",
    style: {
      color: "#556633",
      "line-color": "#556633",
      "target-arrow-color": "#556633",
      width: 1,
      // opacity: 0,
    },
  },
  {
    selector: "edge.source-ast.target-ast.relationship-node",
    style: {
      color: "#aaa",
      "line-color": "#aaa",
      "target-arrow-color": "#aaa",
      width: 0.5,
    },
  },
  {
    selector: "edge.source-ast.target-ast.relationship-token",
    style: {
      color: "#404",
      "line-color": "#404",
      "target-arrow-color": "#404",
      width: 1,
    },
  },
  {
    selector: "edge.source-ast.target-ast.relationship-space",
    style: {
      color: "#044",
      "line-color": "#044",
      "target-arrow-color": "#044",
      width: 1,
    },
  },
  {
    selector: "edge.source-ast.target-ast.relationship-external",
    style: {
      color: "#FF0000",
      "line-color": "#FF0000",
      "target-arrow-color": "#FF0000",
      width: 1,
    },
  },

  // {
  //   selector: "edge.source-cps.target-cpsParam.producer-instance-declaration",
  //   style: {
  //     "line-color": "#0FF",
  //     "target-arrow-color": "#0FF",
  //     color: "#0FF",
  //     width: 1,
  //   },
  // },

  {
    // !FIX
    selector: "edge.source-cps.target-cpsParam",
    style: {
      color: "#0F4",
      "line-color": "#0F4",
      "target-arrow-color": "#0F4",
      width: 1,
    },
  },

  {
    selector: "edge.source-cpsParam.target-astParam",
    style: {
      color: "#45f",
      "line-color": "#45f",
      "target-arrow-color": "#45f",
      width: 1,
    },
  },
];
