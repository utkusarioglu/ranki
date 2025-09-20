export interface NodeLeafSourceNumber {
  type: "number";
  // sign: 1 | -1;
  integer: number;
}

interface NodeLeafSourceInteger {
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
}

interface NodeLeafSourceBases {
  type: "hexadecimal" | "octal" | "binary";
  sign: 1 | -1;
  raw: string;
  symbol: string;
  digits: string;
}

interface NodeLeafSourceConceptual {
  type: "infinity";
  sign: 1 | -1;
  raw: string;
  symbol: string;
}

export type NodeLeafSourceRichNumberV1 =
  | NodeLeafSourceConceptual
  | NodeLeafSourceBases
  | NodeLeafSourceDecimal
  | NodeLeafSourceENotation
  | NodeLeafSourceInteger
  | NodeLeafSourceComplexInteger;
