interface ParseNodeCommon {
  type: string;
  args: NodeArg[];
}

interface ParseNodeLeaf extends ParseNodeCommon {
  kind: "leaf";
  source: NodeLeafSource;
}

interface NodeArg {
  key: string;
  value: string | number | boolean;
}

interface ParseNodeParent extends ParseNodeCommon {
  kind: "parent";
  type: string;
  children: ParseNode[];
}

export type ParseNode = ParseNodeLeaf | ParseNodeParent;

interface NodeLeafSourceString {
  type: "uppercase" | "lowercase" | "text" | "mixed";
  value: string;
}

// interface NodeLeafSourceNumber {
//   type: "number";
//   value: number;
// }

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
  | NodeLeafSourceComplexInteger
  | NodeLeafSourceString
  | NodeLeafSourceInteger
  | NodeLeafSourceDecimal
  | NodeLeafSourceENotation;
