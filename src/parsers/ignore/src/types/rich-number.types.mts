export interface NodeLeafSourceNumber {
  type: "number";
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
  raw: string;
  significand: NodeLeafSourceScalar;
  exponent: NodeLeafSourceInteger;
  // sign: 1 | -1;
  // integer: number;
  // decimal: number;
  // exponentSign: 1 | -1;
  // exponent: number;
}

interface NodeLeafSourceBases {
  type: "hexadecimal" | "octal" | "binary";
  sign: 1 | -1;
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
  nominator: NodeLeafSourceRichNumberV1;
  denominator: NodeLeafSourceRichNumberV1;
}

export interface NodeLeafSourceComplex {
  type: "complex";
  raw: string;
  real: NodeLeafSourceScalar;
  operator: "+" | "-";
  imaginary: NodeLeafSourceScalar;
}

export type NodeLeafSourceRichNumberV1 =
  | NodeLeafSourceRational
  | NodeLeafSourceConceptual
  | NodeLeafSourceBases
  | NodeLeafSourceScalar
  | NodeLeafSourceENotation
  | NodeLeafSourceComplex;
