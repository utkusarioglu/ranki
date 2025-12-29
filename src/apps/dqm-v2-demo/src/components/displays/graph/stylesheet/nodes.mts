import type { GlobalToken } from "antd";

export const buildNodes = (token: GlobalToken, fontSize: number) => [
  {
    selector: "node",
    style: {
      width: 20,
      height: 20,
      shape: "rectangle",
      label: "data(label)",
      "text-valign": "bottom",
      "text-halign": "center",
      "text-margin-y": 6,
      "font-size": fontSize,
      "text-background-color": token.colorBgContainer,
      "text-background-opacity": 0.8,
      "text-background-shape": "roundrectangle", // or rectangle
      "text-background-padding": "4px",
    },
  },

  {
    selector: "node.cpx",
    style: {
      shape: "rectangle",
      color: token.colorPrimary,
      "background-color": token.colorPrimary,
    },
  },
  {
    selector: "node.cpx.root",
    style: {
      width: 40,
      height: 40,
    },
  },

  {
    selector: "node.astParam",
    style: {
      shape: "hexagon",
      color: "#05F",
      "background-color": "#05F",
    },
  },

  {
    selector: "node.cpsParam",
    style: {
      shape: "hexagon",
    },
  },
  {
    selector: "node.cpsParam",
    style: {
      color: "#0FF",
      "background-color": "#0FF",
    },
  },

  // {
  //   selector: "node.cpsParam.producer-component-default",
  //   style: {
  //     color: "#0F4",
  //     "background-color": "#0F4",
  //   },
  // },

  {
    selector: "node.cps",
    style: {
      shape: "triangle",
      color: "#CCC",
      "background-color": "#CCC",
    },
  },
  {
    selector: "node.cps.root",
    style: {
      width: 40,
      height: 40,
    },
  },

  {
    selector: "node.ast",
    style: {
      shape: "diamond",
    },
  },
  {
    selector: "node.ast.relationship-node",
    style: {
      color: "#aaa",
      "background-color": "#aaa",
    },
  },
  {
    selector: "node.ast.relationship-undefined",
    style: {
      color: "#bbb",
      "background-color": "#bbb",
    },
  },
  {
    selector: "node.ast.relationship-space",
    style: {
      color: "#044",
      "background-color": "#044",
    },
  },
  {
    selector: "node.ast.relationship-token",
    style: {
      color: "#707",
      "background-color": "#404",
    },
  },
];
