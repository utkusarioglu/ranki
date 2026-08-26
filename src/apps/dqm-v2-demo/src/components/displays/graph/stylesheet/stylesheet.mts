import type { GlobalToken } from "antd";

import { buildEdges } from "./edges.mts";
import { buildNodes } from "./nodes.mts";

export const buildStyleSheet = (token: GlobalToken, fontSize: number) => [
  ...buildNodes(token, fontSize),
  ...buildEdges(token, fontSize),
  {
    selector: ".dimmed",
    style: {
      display: "none",
      events: "no",
      opacity: 0,
    },
  },

  {
    selector: "[hidden]",
    style: {
      opacity: 0,
    },
  },

  {
    selector: "[hidden_label]",
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
