import type * as ohm from "ohm-js";
import type { RankiLangContextInstance as R } from "@ranki/package-api-v2";
import {
  NodeLeafRichNumberV2SourceInteger,
  NodeLeafRichNumberV2SourceScalar,
  RichNumberV2Sign,
  ParseNodeRichNumberV2,
  RankiRichNumberV2ParserPluginConfig as RNV2,
} from "./types.mjs";

type SymbolKeys = Partial<keyof RNV2["tokens"]["symbol"]>[];

type BaseKeys = Partial<keyof RNV2["tokens"]["base"]>[];

const CONCEPTUAL_NUMBERS = ["e", "infinity", "pi"] as SymbolKeys;

const BASES = ["hexadecimal", "octal", "binary"] as BaseKeys;

function hComplex<T extends ohm.Node>(
  this: T,
  real: NodeLeafRichNumberV2SourceScalar,
  clearance1: ohm.Node,
  operator: ohm.Node,
  clearance2: ohm.Node,
  imaginary: NodeLeafRichNumberV2SourceScalar,
  complexToken: ohm.Node,
): ParseNodeRichNumberV2 {
  const context = (this.args.context as R).newNode("inline");
  return {
    kind: "leaf",
    creator: this.ctorName,
    print: true,
    parser: { hash: context.getHash("ast") },
    args: {
      ...context.getContextArgs(),
      spaces: {
        realAndOp: {
          type: "clearance",
          raw: clearance1.sourceString,
        },
        opAndIm: {
          type: "clearance",
          raw: clearance2.sourceString,
        },
      },
      separators: [],
      "richNumber.v2": {
        args: {
          "token.complex": complexToken.sourceString,
        },
      },
    },
    source: {
      type: "complex",
      raw: this.sourceString,
      operator: operator.richNumberV2Sign(context),
      real,
      imaginary,
    },
  };
}

const node: ohm.ActionDict<ParseNodeRichNumberV2> = {
  conceptualSymbol(token) {
    const context = (this.args.context as R).newNode("inline");
    const config = context.getPluginConfig<RNV2>("RankiRichNumberV2");
    let type;
    CONCEPTUAL_NUMBERS.forEach((t) => {
      if (config.tokens.symbol[t].includes(token.sourceString)) {
        type = t;
      }
    });
    if (!type) {
      throw new Error(`UNRECOGNIZED CONCEPTUAL NUMBER ${token.sourceString}`);
    }

    return {
      kind: "leaf" as "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
      },
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
    const context = (this.args.context as R).newNode("inline");
    const config = context.getPluginConfig<RNV2>("RankiRichNumberV2");
    const integer = +num.sourceString
      .split(config.tokens.number.group)
      .join("");
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
      },
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
    const context = (this.args.context as R).newNode("inline");
    const config = context.getPluginConfig<RNV2>("RankiRichNumberV2");
    const integer = +num.sourceString
      .split(config.tokens.number.group)
      .join("");
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
      },
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
    const context = (this.args.context as R).newNode("inline");
    const config = context.getPluginConfig<RNV2>("RankiRichNumberV2");
    const integer = +num.sourceString
      .split(config.tokens.number.group)
      .join("");
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
      },
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
    const context = (this.args.context as R).newNode("inline");
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
      },
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
    const context = (this.args.context as R).newNode("inline");
    const c = conceptualSymbol.node(context);
    c["source"]["factor"] = +factor.sourceString;
    c["source"]["raw"] = this.sourceString;
    return c;
  },

  conceptual_signed(sign, conceptualNumber) {
    const context = (this.args.context as R).newNode("inline");
    const c = conceptualNumber.node(context);
    c["source"]["sign"] = sign.richNumberV2Sign(context);
    c["source"]["raw"] = this.sourceString;
    return c;
  },

  hBases(zero, symbol, numberSystem_unstructured) {
    const context = (this.args.context as R).newNode("inline");
    const config = context.getPluginConfig<RNV2>("RankiRichNumberV2");
    const tokens = config.tokens;
    let type;

    BASES.forEach((s) => {
      if (tokens.base[s].includes(symbol.sourceString)) {
        type = s;
      }
    });
    if (!type) {
      console.log(tokens);
      throw new Error(
        `UNRECOGNIZED BASE SYMBOL: ${symbol.sourceString} in ${this.sourceString}`,
      );
    }

    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
      },
      source: {
        type,
        raw: this.sourceString,
        sign: "plus",
        symbol: symbol.sourceString,
        digits: numberSystem_unstructured.sourceString
          .split(tokens.number.group)
          .join(""),
      },
    };
  },

  hexadecimal(sign, basedNumber) {
    const context = (this.args.context as R).newNode("inline");
    const h = basedNumber.node(context);
    h["type"] = this.ctorName;
    h["source"]["sign"] = sign.sourceString;
    return h;
  },
  binary(sign, basedNumber) {
    const context = (this.args.context as R).newNode("inline");
    const h = basedNumber.node(context);
    h["type"] = this.ctorName;
    h["source"]["sign"] = sign.sourceString;
    return h;
  },
  octal(sign, basedNumber) {
    const context = (this.args.context as R).newNode("inline");
    const h = basedNumber.node(context);
    h["type"] = this.ctorName;
    h["source"]["sign"] = sign.sourceString;
    return h;
  },

  integer_signed(sign, numberSystem) {
    const context = (this.args.context as R).newNode("inline");
    const ns = numberSystem.node(context);
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
      },
      source: {
        ...ns.source,
        sign: sign.richNumberV2Sign(context),
        raw: this.sourceString,
      },
    };
  },

  decimal_full(integer, decimalToken, decimalGroup) {
    const context = (this.args.context as R).newNode("inline");
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
      },
      source: {
        type: "decimal",
        raw: this.sourceString,
        integer: integer.node(context).source,
        decimal: decimalGroup.node(context).source,
      },
    };
  },

  decimal_point(sign, decimalToken, decimalGroup) {
    const context = (this.args.context as R).newNode("inline");
    const config = context.getPluginConfig<RNV2>("RankiRichNumberV2");
    const decimal = +decimalGroup.sourceString
      .split(config.tokens.number.group)
      .join("");
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
      },
      source: {
        type: "decimal",
        raw: this.sourceString,
        integer: {
          type: "integer",
          raw: sign.sourceString,
          system: "basic",
          sign: sign.richNumberV2Sign(context),
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
    const context = (this.args.context as R).newNode("inline");
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
        // !TODO
      },
      source: {
        type: "rational",
        raw: this.sourceString,
        nominator: nominator.node(context).source,
        denominator: denominator.node(context).source,
      },
    };
  },

  complex_i(realPart, clearance1, operator, clearance2, complexToken) {
    const context = (this.args.context as R).newNode("inline");
    const imaginary: NodeLeafRichNumberV2SourceInteger = {
      type: "integer",
      raw: complexToken.sourceString,
      sign: "plus",
      system: "basic",
      integer: 1,
    };
    const real: NodeLeafRichNumberV2SourceScalar =
      realPart.node(context).source;
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
    const context = (this.args.context as R).newNode("inline");
    const real: NodeLeafRichNumberV2SourceScalar =
      realPart.node(context).source;
    const imaginary: NodeLeafRichNumberV2SourceScalar =
      imaginaryPart.node(context).source;
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
    const context = (this.args.context as R).newNode("inline");
    const real: NodeLeafRichNumberV2SourceScalar =
      realPart.node(context).source;
    const imaginary: NodeLeafRichNumberV2SourceScalar =
      imaginaryPart.node(context).source;
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
    const context = (this.args.context as R).newNode("inline");
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
        // !TODO
      },
      source: {
        type: "eNotation",
        raw: this.sourceString,
        significand: significand.node(context).source,
        exponent: exponent.node(context).source,
      },
    };
  },
};

// !TODO this needs to be read from the config file
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
