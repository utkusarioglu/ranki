import type { NodeArgs } from "./node-arg.mjs";
export type { NodeArgs } from "./node-arg.mjs";

export interface ParseContext {
  tokens: {
    sentence: {
      period: string;
      question: string;
      exclamation: string;
    };
    paramsV2: {
      separator: {
        left: string;
        right: string;
      };
      key: {
        negation: string;
      };
      operators: {
        assign: string;
        append: string;
        remove: string;
      };
    };
  };
}

interface ParseNodeCommon {
  type: string;
  args: NodeArgs;
}

interface ParseNodeLeaf extends ParseNodeCommon {
  kind: "leaf";
  print: boolean;
  source: NodeLeafSource;
}

interface ParseNodeParent extends ParseNodeCommon {
  kind: "parent";
  type: string;
  children: ParseNode[];
}

export type ParseNode = ParseNodeLeaf | ParseNodeParent;

interface NodeLeafSourceString {
  type:
    | "uppercase"
    | "lowercase"
    | "propercase"
    | "mixedcase"
    | "text"
    | "mixed"
    | "token"
    | "punctuation";
  value: string;
}

// interface NodeLeafSourceNumber {
//   type: "number";
//   value: number;
// }

interface NodeLeafSourceNumber {
  type: "number";
  // sign: 1 | -1;
  integer: number;
}

interface NodeLeafSourceInteger {
  type: "integer";
  sign: 1 | -1;
  integer: number;
}

interface NodeLeafSourceDecimal {
  type: "decimal";
  sign: 1 | -1;
  integer: number;
  decimal: number;
}

interface NodeLeafSourceENotation {
  type: "eNotation";
  sign: 1 | -1;
  integer: number;
  decimal: number;
  exponentSign: 1 | -1;
  exponent: number;
}

interface NodeLeafSourceComplexInteger {
  type: "complexInteger";
  real: {
    sign: 1 | -1;
    integer: number;
  };
  complex: {
    sign: 1 | -1;
    integer: number;
  };
  // decimal: number;
  // exponentSign: 1 | -1;
  // exponent: number;
}

type NodeLeafSource =
  | NodeLeafSourceNumber
  | NodeLeafSourceComplexInteger
  | NodeLeafSourceString
  | NodeLeafSourceInteger
  | NodeLeafSourceDecimal
  | NodeLeafSourceENotation;
