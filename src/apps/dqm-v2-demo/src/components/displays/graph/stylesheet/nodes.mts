import type { GlobalToken } from "antd";

export const buildNodes = (token: GlobalToken, fontSize: number) => [
  {
    selector: "node",
    style: {
      "font-size": fontSize,
      height: 20,
      label: "data(label)",
      shape: "rectangle",
      "text-background-color": token.colorBgContainer,
      "text-background-opacity": 0.8,
      "text-background-padding": "4px",
      "text-background-shape": "roundrectangle", // or rectangle
      "text-halign": "center",
      "text-margin-y": 6,
      "text-valign": "bottom",
      width: 20,
    },
  },

  {
    selector: "node.cpx",
    style: {
      "background-color": token.colorPrimary,
      color: token.colorPrimary,
      shape: "rectangle",
    },
  },
  {
    selector: "node.cpx.root",
    style: {
      height: 40,
      width: 40,
    },
  },

  {
    selector: "node.astParam",
    style: {
      "background-color": "#05F",
      color: "#05F",
      shape: "hexagon",
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
      "background-color": "#0FF",
      color: "#0FF",
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
      "background-color": "#CCC",
      color: "#CCC",
      shape: "triangle",
    },
  },
  {
    selector: "node.cps.root",
    style: {
      height: 40,
      width: 40,
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
      "background-color": "#aaa",
      color: "#aaa",
    },
  },
  {
    selector: "node.ast.relationship-undefined",
    style: {
      "background-color": "#bbb",
      color: "#bbb",
    },
  },
  {
    selector: "node.ast.relationship-space",
    style: {
      "background-color": "#044",
      color: "#044",
    },
  },
  {
    selector: "node.ast.relationship-token",
    style: {
      "background-color": "#404",
      color: "#707",
    },
  },
];
