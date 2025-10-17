import type * as ohm from "ohm-js";
import type { RankiLangAstContext } from "@ranki/package-api-v2";
import type {
  ArgsAndParamsV2,
  ParamV2,
  ParamV2Common,
  ParamV2KeyWord,
  ParamV2Operator,
  ParamV2SettingNamespace,
  ParamV2Value,
} from "./types.mjs";

const creatorName: ohm.ActionDict<string> = {
  tParamsV2SeparatorParam(sep) {
    const context: RankiLangAstContext = this.args.context;
    const merged = context.hooks.getConfig().merged;
    const separators =
      // @ts-expect-error
      merged.plugins.config.RankiParamsV2.tokens.separator;
    return sep.sourceString === separators.param ? this.ctorName : "none";
  },
};

const paramsV2: ohm.ActionDict<ParamV2[]> = {
  _iter(...children) {
    const context: RankiLangAstContext = { ...this.args.context };
    return children.map((c) => c.paramV2(context));
  },

  v2ParamListInline(param1, sep, param2) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    const rest = param2.paramsV2(context);
    const joined = [param1.paramV2(context), ...rest];

    return joined;
  },

  v2ParamListBlock(param1, sep, param2) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const rest = param2.paramsV2(context);
    const joined = [param1.paramV2(context), ...rest];

    return joined;
  },
};
// const paramV2KeyWord: ohm.ActionDict<ParamV2KeyWord> = {
//   paramKeyWord(a, b) {
//     return this.sourceString;
//   },
// };

const paramV2Key: ohm.ActionDict<ParamV2KeyWord[]> = {
  // @ts-expect-error
  paramKeyWord(a, b) {
    return this.sourceString;
  },
  _iter(...children) {
    return [...children.map((v) => v.paramV2Key(this.args.context))];
  },
  paramKey(first, sep, rest) {
    return [first.sourceString, ...rest.paramV2Key(this.args.context)];
  },
};

const paramV2Common: ohm.ActionDict<ParamV2Common> = {
  paramFormatOperator(paramKey, wi1, operatorToken, wi2, paramValues) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    const operators =
      // @ts-expect-error
      context.hooks.getConfig().merged.plugins.config.RankiParamsV2.tokens
        .operators;
    const f = Object.entries(operators).find(
      ([k, v]) => v === operatorToken.sourceString,
    );

    if (!f) {
      throw new Error(`UNRECOGNIZED OPERATOR ${f}`);
    }

    const key: ParamV2KeyWord[] = paramKey.paramV2Key(this.args.context);

    return {
      type: "setting",
      key,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
      },
      operator: f[0] as ParamV2Operator,
      values: paramValues.paramV2Values(context),
    };
  },

  paramFormatPositive(paramKey) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;

    const key: ParamV2KeyWord[] = paramKey.paramV2Key(this.args.context);

    return {
      // type: "setting",
      key,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
      },
      operator: "assign",
      values: [
        {
          type: "boolean",
          value: true,
        },
      ],
    };
  },

  paramFormatNegative(negation, paramKey) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    const key: ParamV2KeyWord[] = paramKey.paramV2Key(this.args.context);
    return {
      key,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
      },
      operator: "assign",
      values: [
        {
          type: "boolean",
          value: false,
        },
      ],
    };
  },

  paramFormatPositional(quoted) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      key: "positional",
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
      },
      operator: "assign",
      values: [
        {
          type: "mixed",
          // WARN this won't work if the quoted content has structure
          value: quoted.sourceString.slice(1, -1),
        },
      ],
    };
  },
};

const paramV2SettingNamespace: ohm.ActionDict<number> = {
  _iter(...children) {
    return +this.sourceString.slice(0, -1);
  },
};

const paramV2: ohm.ActionDict<ParamV2> = {
  paramSetting(namespace, param) {
    const ns: ParamV2SettingNamespace = namespace.paramV2SettingNamespace(
      this.args.context,
    );
    const p = param.paramV2Common(this.args.context);
    p["type"] = "setting";
    p["namespace"] = ns;
    return p;
  },

  paramDirective(directive, param) {
    const p = param.paramV2Common(this.args.context);
    p["type"] = "directive";
    return p;
  },
};

const paramV2Values: ohm.ActionDict<ParamV2Value[]> = {
  _iter(...children) {
    const context: RankiLangAstContext = { ...this.args.context };
    return children.map((c) => c.paramV2Value(context));
  },

  paramValues(i1, clearance, i2) {
    const context: RankiLangAstContext = { ...this.args.context };
    return [i1.paramV2Value(context), ...i2.paramV2Values(context)];
  },
};

const paramV2Value: ohm.ActionDict<ParamV2Value> = {
  paramValueItemPrimitive_number(num) {
    return {
      type: "number",
      value: +num.sourceString,
    };
  },

  paramValueItemPrimitive_lowercase(c1, c2, lower) {
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

  paramValueItemPrimitive_uppercase(check1, check2, val) {
    return {
      type: "uppercase",
      value: val.sourceString,
    };
  },

  paramValueItemPrimitive_chars(c1, c2, val) {
    return {
      type: "mixed",
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
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    return {
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        "separator.left.1.type": sepLeft1.creatorName(context),
        // !FIX needs to be parsed
        // "separator.left.2.type": sepLeft2.creatorName(context),
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
        "wi.3.length": wi3.sourceString.length,
      },
      params: {
        variant: "block",
        items: v2ParamListBlock.paramsV2(context),
      },
    };
  },

  v2ParamListInlineContainer(sepLeft1, wi1, v2ParamListInline, wi2, sepLeft2) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    return {
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        "separator.left.1.type": sepLeft1.creatorName(context),
        // !FIX needs to be parsed
        // "separator.left.2.type": sepLeft2.creatorName(context),
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
      },
      params: {
        variant: "inline",
        items: v2ParamListInline.paramsV2(context),
      },
    };
  },
};

export const actions = {
  paramsV2,
  paramV2,
  paramV2Common,
  paramV2Values,
  paramV2Value,
  argsAndParamsV2,
  paramV2Key,
  paramV2SettingNamespace,
  creatorName,
  // paramV2KeyWord,
};
