import type * as ohm from "ohm-js";
import type { ParseContext, ParseNode } from "../types/types.mjs";
import {
  NodeLeafSourceComplex,
  NodeLeafSourceInteger,
  NodeLeafSourceScalar,
} from "../types/rich-number.types.mjs";

const CONCEPTUAL_NUMBERS = ["e", "infinity", "pi"];

function hConcept(token: ohm.Node): ParseNode {
  const context: ParseContext = this.args.context;
  let type;
  CONCEPTUAL_NUMBERS.forEach((t) => {
    if (context.tokens.richNumberV1[t].includes(token.sourceString)) {
      type = t;
    }
  });
  if (!type) {
    throw new Error(`UNRECOGNIZED CONCEPTUAL NUMBER ${token.sourceString}`);
  }

  return {
    kind: "leaf" as "leaf",
    type: this.ctorName,
    print: true,
    args: {},
    source: {
      type,
      sign: -1,
      raw: this.sourceString,
      symbol: token.sourceString,
    },
  };
}

function hComplex(
  real: NodeLeafSourceScalar,
  clearance1: ohm.Node,
  operator: ohm.Node,
  clearance2: ohm.Node,
  imaginary: NodeLeafSourceScalar,
  // imaginaryPart: ohm.Node,
  complexToken: ohm.Node,
): ParseNode {
  return {
    kind: "leaf",
    type: this.ctorName,
    print: true,
    args: {
      "clearance.1.length": clearance1.sourceString.length,
      "clearance.2.length": clearance2.sourceString.length,
      "richNumber.v1": {
        args: {
          "token.complex": complexToken.sourceString,
        },
      },
    },
    source: {
      type: "complex",
      raw: this.sourceString,
      operator: operator.sourceString as NodeLeafSourceComplex["operator"],
      real,
      imaginary,
    },
  };
}

const node: ohm.ActionDict<ParseNode> = {
  numberSystem_indian(num) {
    const context: ParseContext = this.args.context;
    const integer = +num.sourceString
      .split(context.tokens.richNumberV1.group)
      .join("");
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "integer",
        sign: 1,
        system: "indian_lakhCrore",
        integer,
        raw: num.sourceString,
      },
    };
  },

  numberSystem_international(num) {
    const context: ParseContext = this.args.context;
    const integer = +num.sourceString
      .split(context.tokens.richNumberV1.group)
      .join("");
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "integer",
        sign: 1,
        system: "international",
        integer,
        raw: num.sourceString,
      },
    };
  },

  hConcept_positive(positiveToken, token) {
    const h = hConcept.call(this, token);
    h["source"]["sign"] = 1;
    return h;
  },
  hConcept_unsigned(token) {
    const h = hConcept.call(this, token);
    h["source"]["sign"] = 1;
    return h;
  },
  hConcept_negative(negativeToken, token) {
    const h = hConcept.call(this, token);
    h["source"]["sign"] = -1;
    return h;
  },

  hZeroTypePositive(zero, symbol, basicGroup) {
    const context: ParseContext = this.args.context;
    const richNumberV1 = context.tokens.richNumberV1;
    let type;

    ["hexadecimal", "octal", "binary"].forEach((s) => {
      if (richNumberV1[s].includes(symbol.sourceString)) {
        type = s;
      }
    });
    if (!type) {
      throw new Error(`UNRECOGNIZED BASE SYMBOL: ${symbol.sourceString}`);
    }

    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type,
        raw: this.sourceString,
        sign: 1,
        symbol: symbol.sourceString,
        digits: basicGroup.sourceString.split(richNumberV1.group).join(""),
      },
    };
  },

  hZeroType_positive(pos) {
    return pos.node(this.args.context);
  },
  hZeroType_negative(negative, pos) {
    const positive: ParseNode = pos.node(this.args.context);
    positive["source"]["sign"] = -1;
    positive["source"]["raw"] = this.sourceString;
    return positive;
  },

  integer_negative(negativeToken, integerPositive) {
    const posInt = integerPositive.node(this.args.context).source;
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        ...posInt,
        sign: -1,
        raw: this.sourceString,
      },
    };
  },
  numberSystem_basic(basic) {
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "integer",
        sign: 1,
        system: "basic",
        raw: basic.sourceString,
        integer: +basic.sourceString,
      },
    };
  },

  integer_positive(positiveToken, numberSystem) {
    const ns = numberSystem.node(this.args.context);
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: { ...ns.source, raw: this.sourceString },
    };
  },

  decimal_full(integer, decimalToken, integer_positive) {
    const integerNode = integer.node(this.args.context);
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "decimal",
        sign: integerNode.source.sign,
        integer: integerNode.source.integer,
        decimal: +integer_positive.sourceString,
      },
    };
  },

  decimal_point(decimalToken, integer_positive) {
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "decimal",
        sign: 1,
        integer: 0,
        decimal: +integer_positive.sourceString,
      },
    };
  },

  rational(nominator, rationalToken, denominator) {
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {
        // !TODO
      },
      source: {
        type: "rational",
        nominator: nominator.node(this.args.context).source,
        denominator: denominator.node(this.args.context).source,
      },
    };
  },

  complex_i(realPart, clearance1, operator, clearance2, complexToken) {
    const imaginary: NodeLeafSourceInteger = {
      type: "integer",
      raw: complexToken.sourceString,
      sign: 1,
      system: "basic",
      integer: 1,
    };
    const real: NodeLeafSourceScalar = realPart.node(this.args.context).source;
    return hComplex.call(
      this,
      real,
      clearance1,
      operator,
      clearance2,
      imaginary,
      complexToken,
    );
  },

  complex_si(
    realPart,
    clearance1,
    operator,
    clearance2,
    imaginaryPart,
    complexToken,
  ) {
    const real: NodeLeafSourceScalar = realPart.node(this.args.context).source;
    const imaginary: NodeLeafSourceScalar = imaginaryPart.node(
      this.args.context,
    ).source;
    return hComplex.call(
      this,
      real,
      clearance1,
      operator,
      clearance2,
      imaginary,
      complexToken,
    );
  },

  complex_is(
    realPart,
    clearance1,
    operator,
    clearance2,
    complexToken,
    imaginaryPart,
  ) {
    const real: NodeLeafSourceScalar = realPart.node(this.args.context).source;
    const imaginary: NodeLeafSourceScalar = imaginaryPart.node(
      this.args.context,
    ).source;
    return hComplex.call(
      this,
      real,
      clearance1,
      operator,
      clearance2,
      imaginary,
      complexToken,
    );
  },

  eNotation(significand, eToken, exponent) {
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {
        // !TODO
      },
      source: {
        type: "eNotation",
        raw: this.sourceString,
        significand: significand.node(this.args.context).source,
        exponent: exponent.node(this.args.context).source,
      },
    };
  },
};

export const richNumberActions = {
  node,
};
