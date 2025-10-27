import type { AstNode, AstNodeLeaf } from "@ranki/package-api-v2";

import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";

export type ParseNodeRichNumberV2 =
  | ParseNodeRichNumberV2General
  | ParseNodeRichNumberV2Complex;

type ParseNodeRichNumberV2General = Omit<AstNodeLeaf, "shape" | "source"> & {
  shape: AstNode["shape"] & Partial<NodeArgsBaseV2>;
  source: NodeLeafRichNumberV2SourceGeneral;
};
type ParseNodeRichNumberV2Complex = Omit<AstNodeLeaf, "shape" | "source"> & {
  shape: AstNode["shape"] &
    Partial<NodeArgsBaseV2> &
    NodeArgsRichNumberV2Complex;
  source: NodeLeafRichNumberV2SourceComplex;
};

export interface NodeArgsRichNumberV2Complex {
  "richNumber.v2": {
    shape: {
      "token.complex": string;
    };
  };
}

export type NodeLeafRichNumberV2SourceScalar =
  | NodeLeafRichNumberV2SourceInteger
  | NodeLeafRichNumberV2SourceDecimal;

export interface NodeLeafRichNumberV2SourceInteger {
  type: "integer";
  raw: string;
  system: string;
  sign: RichNumberV2Sign;
  integer: number;
}

interface NodeLeafRichNumberV2SourceDecimal {
  type: "decimal";
  raw: string;
  integer: NodeLeafRichNumberV2SourceInteger;
  decimal: NodeLeafRichNumberV2SourceInteger;
}

interface NodeLeafRichNumberV2SourceENotation {
  type: "eNotation";
  raw: string;
  significand: NodeLeafRichNumberV2SourceScalar;
  exponent: NodeLeafRichNumberV2SourceInteger;
}

interface NodeLeafRichNumberV2SourceBases {
  type: "hexadecimal" | "octal" | "binary";
  sign: RichNumberV2Sign;
  raw: string;
  symbol: string;
  digits: string;
}

interface NodeLeafRichNumberV2SourceConceptual {
  type: "infinity" | "pi" | "e";
  sign: 1 | -1;
  factor: number;
  raw: string;
  symbol: string;
}

interface NodeLeafRichNumberV2SourceRational {
  type: "rational";
  raw: string;
  nominator: NodeLeafRichNumberV2SourceGeneral;
  denominator: NodeLeafRichNumberV2SourceGeneral;
}

export interface NodeLeafRichNumberV2SourceComplex {
  type: "complex";
  raw: string;
  real: NodeLeafRichNumberV2SourceScalar;
  operator: RichNumberV2Sign; // this is not really a sign but it works for now
  imaginary: NodeLeafRichNumberV2SourceScalar;
}

export type RichNumberV2Sign = "plus" | "minus" | "plusMinus" | "minusPlus";

export type NodeLeafRichNumberV2SourceGeneral =
  | NodeLeafRichNumberV2SourceRational
  | NodeLeafRichNumberV2SourceConceptual
  | NodeLeafRichNumberV2SourceBases
  | NodeLeafRichNumberV2SourceScalar
  | NodeLeafRichNumberV2SourceENotation;

type Alternates = Single[];
type Single = string;

export interface RankiRichNumberV2ParserPluginConfig {
  tokens: {
    symbol: {
      complex: Alternates;
      infinity: Alternates;
      e: Alternates;
      pi: Alternates;
    };
    base: {
      hexadecimal: Alternates;
      octal: Alternates;
      binary: Alternates;
    };
    operator: {
      negative: Single;
      positive: Single;
      minusPlus: Alternates;
      plusMinus: Alternates;
      rational: Single;
    };
    number: {
      decimal: Single;
      group: Single;
    };
  };
}

export interface WithRankiRichNumberV2ParserPluginConfig {
  RankiRichNumberV2: RankiRichNumberV2ParserPluginConfig;
}

export type ParseNodeRichNumberV2Reduced =
  | ParseNodeRichNumberV2GeneralReduced
  | ParseNodeRichNumberV2ComplexReduced;

export type ParseNodeRichNumberV2GeneralReduced = Omit<
  ParseNodeRichNumberV2General,
  "parent" | "parser" | "shape"
> & {
  shape: Omit<ParseNodeRichNumberV2General["shape"], "depth">;
};

export type ParseNodeRichNumberV2ComplexReduced = Omit<
  ParseNodeRichNumberV2Complex,
  "parent" | "parser" | "shape"
> & {
  shape: Omit<ParseNodeRichNumberV2Complex["shape"], "depth">;
};
