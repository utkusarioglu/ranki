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
      // "text-margin-x": -6,
      "text-margin-y": 6,
      "font-size": fontSize,
      "text-background-color": token.colorBgContainer,
      "text-background-opacity": 0.8,
      "text-background-shape": "roundrectangle", // or rectangle
      "text-background-padding": "4px",

      color: token.colorPrimary,
      "background-color": token.colorPrimary,
    },
  },

  {
    selector: "node.cpx",
    style: {
      // width: 20,
      // height: 20,
      shape: "rectangle",
      // label: "data(label)",
      // "text-valign": "center",
      // "text-halign": "left",
      // "text-margin-x": -6,
      // "font-size": fontSize,
      color: token.colorPrimary,
      "background-color": token.colorPrimary,
    },
  },
  {
    selector: "node.cpx.root",
    style: {
      width: 40,
      height: 40,
      // shape: "rectangle",
      // label: "data(label)",
      // "text-valign": "center",
      // "text-halign": "left",
      // "text-margin-x": -6,
      // "font-size": fontSize,
      // color: token.colorPrimary,
      // "background-color": token.colorPrimary,
    },
  },

  {
    selector: "node.rawParam",
    style: {
      // width: 20,
      // height: 20,
      shape: "hexagon",
      // label: "data(label)",
      // "text-valign": "center",
      // "text-halign": "left",
      // "text-margin-x": -6,
      // "font-size": fontSize,
      color: "#05F",
      "background-color": "#05F",
    },
  },

  {
    selector: "node.param",
    style: {
      // width: 20,
      // height: 20,
      shape: "hexagon",
      // label: "data(label)",
      // "text-valign": "center",
      // "text-halign": "left",
      // "text-margin-x": -6,
      // "font-size": fontSize,
    },
  },
  {
    selector: "node.param.producer-instance-declaration",
    style: {
      color: "#0FF",
      "background-color": "#0FF",
    },
  },

  {
    selector: "node.param.producer-component-default",
    style: {
      color: "#0F4",
      "background-color": "#0F4",
    },
  },

  {
    selector: "node.cps",
    style: {
      // width: 20,
      // height: 20,
      shape: "triangle",
      // label: "data(label)",
      // "text-valign": "center",
      // "text-halign": "left",
      // "text-margin-x": -6,
      // "font-size": fontSize,
      color: "#CCC",
      "background-color": "#CCC",
    },
  },
  {
    selector: "node.cps.root",
    style: {
      width: 40,
      height: 40,
      // shape: "triangle",
      // label: "data(label)",
      // "text-valign": "center",
      // "text-halign": "left",
      // "text-margin-x": -6,
      // "font-size": fontSize,
      // color: "#CCC",
      // "background-color": "#CCC",
    },
  },

  {
    selector: "node.ast",
    style: {
      // width: 20,
      // height: 20,
      shape: "diamond",
      // label: "data(label)",
      // "text-valign": "center",
      // "text-halign": "left",
      // "text-margin-x": -6,
      // "font-size": fontSize,
      // color: "#006644",
      // "background-color": "#006644",
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
