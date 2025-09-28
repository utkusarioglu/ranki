import type * as ohm from "ohm-js";
import type { ParseContext } from "@ranki/package-api";
import type {
  ArgsAndParamsV2,
  ParamV2,
  ParamV2Operator,
  ParamV2Value,
} from "./types.mjs";

const paramsV2: ohm.ActionDict<ParamV2[]> = {
  _iter(...children) {
    return children.map((c) => c.paramV2(this.args.context));
  },

  v2ParamListInline(param1, sep, param2) {
    // const p2 = param2.paramsV2(this.args.context);
    const rest = param2.paramsV2(this.args.context);
    const joined = [param1.paramV2(this.args.context), ...rest];

    return joined;
  },

  v2ParamListBlock(param1, sep, param2) {
    // const p2 = param2.paramsV2(this.args.context);
    const rest = param2.paramsV2(this.args.context);
    const joined = [param1.paramV2(this.args.context), ...rest];

    return joined;
  },
};

const paramV2: ohm.ActionDict<ParamV2> = {
  param_operator(paramKey, wi1, operatorToken, wi2, paramValues) {
    const context: ParseContext = this.args.context;
    const operators = context.config.merged.tokens.paramsV2.operators;
    const f = Object.entries(operators).find(
      ([k, v]) => v === operatorToken.sourceString,
    );

    if (!f) {
      throw new Error(`UNRECOGNIZED OPERATOR ${f}`);
    }

    return {
      key: paramKey.sourceString,
      args: {
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
      },
      operator: f[0] as ParamV2Operator,
      values: paramValues.paramV2Values(this.args.context),
    };
  },

  param_positive(key) {
    return {
      key: key.sourceString,
      args: {},
      operator: "assign",
      values: [
        {
          type: "boolean",
          value: true,
        },
      ],
    };
  },

  param_negative(negation, key) {
    return {
      key: key.sourceString,
      args: {},
      operator: "assign",
      values: [
        {
          type: "boolean",
          value: false,
        },
      ],
    };
  },
};

const paramV2Values: ohm.ActionDict<ParamV2Value[]> = {
  _iter(...children) {
    return children.map((c) => c.paramV2Value(this.args.context));
  },

  paramValues(i1, clearance, i2) {
    return [
      i1.paramV2Value(this.args.context),
      ...i2.paramV2Values(this.args.context),
    ];
  },
};

const paramV2Value: ohm.ActionDict<ParamV2Value> = {
  paramValueItemPrimitive_number(num) {
    return {
      type: "number",
      value: +num.sourceString,
    };
  },

  paramValueItemPrimitive_lowercase(lower) {
    return {
      type: "lowercase",
      value: lower.sourceString,
    };
  },

  paramValueItemPrimitive_true(val) {
    return {
      type: "boolean",
      value: true,
    };
  },

  paramValueItemPrimitive_false(val) {
    return {
      type: "boolean",
      value: false,
    };
  },

  paramValueItemPrimitive_uppercase(val) {
    return {
      type: "uppercase",
      value: val.sourceString,
    };
  },

  paramValueItemPrimitive_mixed(val) {
    return {
      type: "mixed",
      value: val.sourceString,
    };
  },

  quoted(quote1, quotedContent, quote2) {
    return {
      type: "quoted",
      value: quotedContent.sourceString,
    };
  },
};

const argsAndParamsV2: ohm.ActionDict<ArgsAndParamsV2> = {
  v2ParamListBlockContainer(
    sepLeft1,
    wi1,
    nl,
    wi2,
    v2ParamListBlock,
    wi3,
    sepLeft2,
  ) {
    return {
      args: {
        "separator.left.1.type": sepLeft1.creatorName(this.args.context),
        // !FIX needs to be parsed
        // "separator.left.2.type": sepLeft2.creatorName(this.args.context),
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
        "wi.3.length": wi3.sourceString.length,
      },
      params: {
        variant: "block",
        items: v2ParamListBlock.paramsV2(this.args.context),
      },
    };
  },

  v2ParamListInlineContainer(sepLeft1, wi1, v2ParamListInline, wi2, sepLeft2) {
    return {
      args: {
        "separator.left.1.type": sepLeft1.creatorName(this.args.context),
        // !FIX needs to be parsed
        // "separator.left.2.type": sepLeft2.creatorName(this.args.context),
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
      },
      params: {
        variant: "inline",
        items: v2ParamListInline.paramsV2(this.args.context),
      },
    };
  },
};

export const actions = {
  paramsV2,
  paramV2,
  paramV2Values,
  paramV2Value,
  argsAndParamsV2,
};
