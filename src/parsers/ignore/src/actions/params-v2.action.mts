import type * as ohm from "ohm-js";
import type { NodeArgs, ParseContext, ParseNode } from "../types/types.mjs";
import type {
  ParamV2,
  ParamV2Operator,
  ParamV2Value,
} from "../types/param-v2.mjs";
import { zipNodes, joinNodes } from "@ranki/package-api/helpers";

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
};

const paramV2: ohm.ActionDict<ParamV2> = {
  param_operator(paramKey, wi1, operatorToken, wi2, paramValues) {
    const context: ParseContext = this.args.context;
    const operators = context.tokens.paramsV2.operators;
    const f = Object.entries(operators).find(
      ([k, v]) => v === operatorToken.sourceString,
    );

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
      value: val.sourceString === "true",
    };
  },
};

export const paramsV2Actions = {
  paramsV2,
  paramV2,
  paramV2Values,
  paramV2Value,
};
