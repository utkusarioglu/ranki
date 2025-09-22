export interface NodeLeafSourceNumber {
  type: "number";
  raw: string;
  // sign: 1 | -1;
  integer: number;
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
  nominator: NodeLeafSourceRichNumberV1;
  denominator: NodeLeafSourceRichNumberV1;
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

export type NodeLeafSourceRichNumberV1 =
  | NodeLeafSourceRational
  | NodeLeafSourceConceptual
  | NodeLeafSourceBases
  | NodeLeafSourceScalar
  | NodeLeafSourceENotation
  | NodeLeafSourceComplex;
