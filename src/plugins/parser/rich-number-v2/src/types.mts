import type {
  ParseNodeLeaf,
  // ParseNode as ParseNodeBaseV2,
  // NodeArgs as NodeArgsBaseV2,
} from "@ranki/package-api";

import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";

// type RichNumberV1 = RichNumberV1Complex;

export type ParseNodeRichNumberV2 =
  | ParseNodeRichNumberV2General
  | ParseNodeRichNumberV2Complex;

type ParseNodeRichNumberV2General = Omit<ParseNodeLeaf, "args" | "source"> & {
  args: Partial<NodeArgsBaseV2>;
  source: NodeLeafSourceRichNumberV1General;
};
type ParseNodeRichNumberV2Complex = Omit<ParseNodeLeaf, "args" | "source"> & {
  args: Partial<NodeArgsBaseV2> & NodeArgsRichNumberV1Complex;
  source: NodeLeafSourceComplex;
};

export interface NodeArgsRichNumberV1Complex {
  "richNumber.v1": {
    args: {
      "token.complex": string;
    };
  };
}

export type NodeLeafSourceScalar =
  | NodeLeafSourceInteger
  | NodeLeafSourceDecimal;

export interface NodeLeafSourceInteger {
  type: "integer";
  raw: string;
  system: string;
  sign: RankiRichNumberV2Sign;
  integer: number;
}

interface NodeLeafSourceDecimal {
  type: "decimal";
  raw: string;
  integer: NodeLeafSourceInteger;
  decimal: NodeLeafSourceInteger;
}

interface NodeLeafSourceENotation {
  type: "eNotation";
  raw: string;
  significand: NodeLeafSourceScalar;
  exponent: NodeLeafSourceInteger;
}

interface NodeLeafSourceBases {
  type: "hexadecimal" | "octal" | "binary";
  sign: RankiRichNumberV2Sign;
  raw: string;
  symbol: string;
  digits: string;
}

interface NodeLeafSourceConceptual {
  type: "infinity" | "pi" | "e";
  sign: 1 | -1;
  factor: number;
  raw: string;
  symbol: string;
}

interface NodeLeafSourceRational {
  type: "rational";
  raw: string;
  nominator: NodeLeafSourceRichNumberV1General;
  denominator: NodeLeafSourceRichNumberV1General;
}

export interface NodeLeafSourceComplex {
  type: "complex";
  raw: string;
  real: NodeLeafSourceScalar;
  operator: RankiRichNumberV2Sign; // this is not really a sign but it works for now
  imaginary: NodeLeafSourceScalar;
}

export type RankiRichNumberV2Sign =
  | "plus"
  | "minus"
  | "plusMinus"
  | "minusPlus";

export type NodeLeafSourceRichNumberV1General =
  | NodeLeafSourceRational
  | NodeLeafSourceConceptual
  | NodeLeafSourceBases
  | NodeLeafSourceScalar
  | NodeLeafSourceENotation;
// | NodeLeafSourceComplex;
