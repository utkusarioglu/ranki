import type * as ohm from "ohm-js";
import type { ParseContext } from "@ranki/package-api";
import {
  NodeLeafRichNumberV2SourceComplex,
  NodeLeafRichNumberV2SourceInteger,
  NodeLeafRichNumberV2SourceScalar,
  RichNumberV2Sign,
  ParseNodeRichNumberV2,
} from "./types.mjs";

type Keys = Partial<
  keyof ParseContext["config"]["merged"]["tokens"]["richNumberV2"]
>[];

const CONCEPTUAL_NUMBERS = ["e", "infinity", "pi"] as Keys;

const BASES = ["hexadecimal", "octal", "binary"] as Keys;
// function hConcept(token: ohm.Node): ParseNode {
//   const context: ParseContext = this.args.context;
//   let type;
//   CONCEPTUAL_NUMBERS.forEach((t) => {
//     if (context.tokens.richNumberV1[t].includes(token.sourceString)) {
//       type = t;
//     }
//   });
//   if (!type) {
//     throw new Error(`UNRECOGNIZED CONCEPTUAL NUMBER ${token.sourceString}`);
//   }

//   return {
//     kind: "leaf" as "leaf",
//     type: this.ctorName,
//     print: true,
//     args: {},
//     source: {
//       type,
//       sign: 1,
//       factor: 1,
//       raw: this.sourceString,
//       symbol: token.sourceString,
//     },
//   };
// }

function hComplex<T extends ohm.Node>(
  this: T,
  real: NodeLeafRichNumberV2SourceScalar,
  clearance1: ohm.Node,
  operator: ohm.Node,
  clearance2: ohm.Node,
  imaginary: NodeLeafRichNumberV2SourceScalar,
  // imaginaryPart: ohm.Node,
  complexToken: ohm.Node,
): ParseNodeRichNumberV2 {
  return {
    kind: "leaf",
    type: this.ctorName,
    print: true,
    args: {
      "clearance.1.length": clearance1.sourceString.length,
      "clearance.2.length": clearance2.sourceString.length,
      "richNumber.v2": {
        args: {
          "token.complex": complexToken.sourceString,
        },
      },
    },
    source: {
      type: "complex",
      raw: this.sourceString,
      operator: operator.richNumberV2Sign(this.args.context),
      real,
      imaginary,
    },
  };
}

const node: ohm.ActionDict<ParseNodeRichNumberV2> = {
  conceptualSymbol(token) {
    const context: ParseContext = this.args.context;
    let type;
    CONCEPTUAL_NUMBERS.forEach((t) => {
      if (
        context.config.merged.tokens.richNumberV2[t].includes(
          token.sourceString,
        )
      ) {
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
        sign: 1,
        factor: 1,
        raw: this.sourceString,
        symbol: token.sourceString,
      },
    };
  },

  numberSystem_indian(num) {
    const context: ParseContext = this.args.context;
    const integer = +num.sourceString
      .split(context.config.merged.tokens.richNumberV2.group)
      .join("");
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "integer",
        sign: "plus",
        system: "indian_lakhCrore",
        integer,
        raw: num.sourceString,
      },
    };
  },

  numberSystem_international(num) {
    const context: ParseContext = this.args.context;
    const integer = +num.sourceString
      .split(context.config.merged.tokens.richNumberV2.group)
      .join("");
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "integer",
        sign: "plus",
        system: "international",
        integer,
        raw: num.sourceString,
      },
    };
  },

  numberSystem_unstructured(digit, token, num) {
    const context: ParseContext = this.args.context;
    const integer = +num.sourceString
      .split(context.config.merged.tokens.richNumberV2.group)
      .join("");
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "integer",
        sign: "plus",
        system: "unstructured",
        integer,
        raw: num.sourceString,
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
        sign: "plus",
        system: "basic",
        raw: basic.sourceString,
        integer: +basic.sourceString,
      },
    };
  },

  conceptualNumber_factored(factor, conceptualSymbol) {
    const c = conceptualSymbol.node(this.args.context);
    c["source"]["factor"] = +factor.sourceString;
    c["source"]["raw"] = this.sourceString;
    return c;
  },

  conceptual_signed(sign, conceptualNumber) {
    const c = conceptualNumber.node(this.args.context);
    c["source"]["sign"] = sign.richNumberV2Sign(this.args.context);
    c["source"]["raw"] = this.sourceString;
    return c;
  },

  // hConcept_positive(positiveToken, token) {
  //   const h = hConcept.call(this, token);
  //   h["source"]["sign"] = 1;
  //   return h;
  // },
  // hConcept_unsigned(token) {
  //   const h = hConcept.call(this, token);
  //   h["source"]["sign"] = 1;
  //   return h;
  // },
  // hConcept_negative(negativeToken, token) {
  //   const h = hConcept.call(this, token);
  //   h["source"]["sign"] = -1;
  //   return h;
  // },

  hBases(zero, symbol, numberSystem_unstructured) {
    const context: ParseContext = this.args.context;
    const richNumberV2 = context.config.merged.tokens.richNumberV2;
    let type;

    BASES.forEach((s) => {
      if (richNumberV2[s].includes(symbol.sourceString)) {
        type = s;
      }
    });
    if (!type) {
      console.log(richNumberV2);
      throw new Error(
        `UNRECOGNIZED BASE SYMBOL: ${symbol.sourceString} in ${this.sourceString}`,
      );
    }

    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type,
        raw: this.sourceString,
        sign: "plus",
        symbol: symbol.sourceString,
        digits: numberSystem_unstructured.sourceString
          .split(richNumberV2.group)
          .join(""),
      },
    };
  },

  hexadecimal(sign, basedNumber) {
    const h = basedNumber.node(this.args.context);
    h["type"] = this.ctorName;
    h["source"]["sign"] = sign.sourceString;
    return h;
  },
  binary(sign, basedNumber) {
    const h = basedNumber.node(this.args.context);
    h["type"] = this.ctorName;
    h["source"]["sign"] = sign.sourceString;
    return h;
  },
  octal(sign, basedNumber) {
    const h = basedNumber.node(this.args.context);
    h["type"] = this.ctorName;
    h["source"]["sign"] = sign.sourceString;
    return h;
  },

  integer_signed(sign, numberSystem) {
    const ns = numberSystem.node(this.args.context);
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        ...ns.source,
        sign: sign.richNumberV2Sign(this.args.context),
        raw: this.sourceString,
      },
    };
  },

  decimal_full(integer, decimalToken, decimalGroup) {
    // const context: ParseContext = this.args.context;
    // const integerNode = integer.node(this.args.context);
    // const decimal = +decimalGroup.sourceString
    //   .split(context.tokens.richNumberV1.group)
    //   .join("");
    // const decimal =
    // integerNode["sign"] = sign.richNumberV2Sign(this.args.context);
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "decimal",
        raw: this.sourceString,
        integer: integer.node(this.args.context).source,
        decimal: decimalGroup.node(this.args.context).source,
        // decimal: {
        //   type: "integer",
        //   raw: decimalGroup.sourceString,
        //   system: "basic",
        //   sign: "plus",
        //   integer: decimal,
        // },
      },
    };
  },

  // !fix return schema is wrong (I think)
  decimal_point(sign, decimalToken, decimalGroup) {
    const context: ParseContext = this.args.context;
    const decimal = +decimalGroup.sourceString
      .split(context.config.merged.tokens.richNumberV2.group)
      .join("");
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "decimal",
        raw: this.sourceString,
        // sign: 1,
        integer: {
          type: "integer",
          raw: sign.sourceString,
          system: "basic",
          sign: sign.richNumberV2Sign(this.args.context),
          integer: 1,
        },
        decimal: {
          type: "integer",
          raw: decimalGroup.sourceString,
          system: "basic",
          sign: "plus",
          integer: decimal,
        },
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
        raw: this.sourceString,
        nominator: nominator.node(this.args.context).source,
        denominator: denominator.node(this.args.context).source,
      },
    };
  },

  complex_i(realPart, clearance1, operator, clearance2, complexToken) {
    const imaginary: NodeLeafRichNumberV2SourceInteger = {
      type: "integer",
      raw: complexToken.sourceString,
      sign: "plus",
      system: "basic",
      integer: 1,
    };
    const real: NodeLeafRichNumberV2SourceScalar = realPart.node(
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

  complex_si(
    realPart,
    clearance1,
    operator,
    clearance2,
    imaginaryPart,
    complexToken,
  ) {
    const real: NodeLeafRichNumberV2SourceScalar = realPart.node(
      this.args.context,
    ).source;
    const imaginary: NodeLeafRichNumberV2SourceScalar = imaginaryPart.node(
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
    const real: NodeLeafRichNumberV2SourceScalar = realPart.node(
      this.args.context,
    ).source;
    const imaginary: NodeLeafRichNumberV2SourceScalar = imaginaryPart.node(
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

const richNumberV2Sign: ohm.ActionDict<RichNumberV2Sign> = {
  sign(s) {
    switch (s.sourceString) {
      case "":
      case "+":
        return "plus";
      case "+-":
      case "±":
        return "plusMinus";
      case "-+":
      case "∓":
        return "minusPlus";
      case "-":
        return "minus";
      default:
        throw new Error(`UNRECOGNIZED SIGN ${s.sourceString}`);
    }
  },
};

export const actions = {
  node,
  richNumberV2Sign,
};
