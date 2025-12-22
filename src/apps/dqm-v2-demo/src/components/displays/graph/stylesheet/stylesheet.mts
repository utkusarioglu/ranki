import type { GlobalToken } from "antd";
import { buildNodes } from "./nodes.mts";
import { buildEdges } from "./edges.mts";

export const buildStyleSheet = (token: GlobalToken, fontSize: number) => [
  ...buildNodes(token, fontSize),
  ...buildEdges(token, fontSize),
  {
    selector: ".dimmed",
    style: {
      opacity: 0.01,
    },
  },

  {
    selector: ".hidden",
    style: {
      opacity: 0,
    },
  },
  {
    selector: ".hidden-label",
    style: {
      "text-background-opacity": 0,
      "text-opacity": 0,
    },
  },

  {
    selector: ".focused",
    style: {
      opacity: 1,
    },
  },
];
