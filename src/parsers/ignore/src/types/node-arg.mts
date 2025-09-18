// import type { FrameConfig } from "./frame.mjs";

import { ParamV2 } from "./param-v2.mjs";
import { ParseNode } from "./types.mjs";

export type NodeArgs = Partial<
  NodeArgNumber &
    NodeArgWordEnd &
    NodeArgWordDecoration &
    NodeArgLineModifiers &
    FrameV2Config
>;

type NodeArgWordDecoration = NodeArgSentenceEnd &
  NodeArgAbbreviation &
  NodeArgB &
  NodeArgEm &
  NodeArgI &
  NodeArgU;

type NodeArgNumber = Record<
  | "whitespace.1.length"
  | "whitespace.2.length"
  | "indentation.1.length"
  | "clearance.1.length"
  | "wm.1.length"
  | "small.level"
  | "wi.1.length",
  // | "heading.level"
  // | "alignment.level"
  number
>;

export type NodeArgWordEnd = {
  "wordEnd.type": "clearance" | "nl" | "end";
};

export interface NodeArgSentenceEnd {
  "sentence.end": {
    indices: number[];
    level: number;
    types: {
      period: boolean;
      exclamation: boolean;
      question: boolean;
    };
  };
}

export interface NodeArgAbbreviation {
  "abbreviation.start": {
    indices: number[];
    level: number;
  };
  "abbreviation.end": {
    indices: number[];
    level: number;
  };
}

export interface NodeArgB {
  "b.start": {
    indices: number[];
    level: number;
  };
  "b.end": {
    indices: number[];
    level: number;
  };
}

export interface NodeArgEm {
  "em.start": {
    indices: number[];
    level: number;
  };
  "em.end": {
    indices: number[];
    level: number;
  };
}

export interface NodeArgI {
  "i.start": {
    indices: number[];
    level: number;
  };
  "i.end": {
    indices: number[];
    level: number;
  };
}

export interface NodeArgU {
  "u.start": {
    indices: number[];
    level: number;
  };
  "u.end": {
    indices: number[];
    level: number;
  };
}

type NodeArgLineModifiers = NodeArgAlignment &
  NodeArgSmallText &
  NodeArgHeading;

interface NodeArgLineModifiersCommon {
  level: number;
  clearance: number;
  type: string;
}

export interface NodeArgAlignment {
  "line.alignment": NodeArgLineModifiersCommon;
}

export interface NodeArgSmallText {
  "line.smalltext": NodeArgLineModifiersCommon;
}

export interface NodeArgHeading {
  "line.heading": NodeArgLineModifiersCommon;
}

// !FIX this entire structure is temporary
export interface FrameV2Config {
  "frame.v2": {
    type: string;
    variant: string; // this is like f fp
    frameType: string; // like code in %:code; ...:%
    args: NodeArgs &
      // !FIX this entire structure is temporary
      Partial<{
        "separator.right.type": string;
        "separator.left.type": string;
        "frame.v2.config": NodeArgs;
      }>;
    params: {
      variant: "block" | "inline" | "none";
      items: ParamV2[];
    };
  };
}
