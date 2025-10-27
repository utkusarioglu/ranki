import type * as ohm from "ohm-js";
import type { RankiLangContextInstance as R } from "@ranki/package-api-v2";
import type {
  ArgsAndParamsV2,
  ArgsAndParamsV2Reduced,
  ParamV2,
  ParamV2Common,
  ParamV2KeyWord,
  ParamV2Operator,
  ParamV2Reduced,
  ParamV2ReducedPartial,
  ParamV2Setting,
  ParamV2SettingNamespace,
  ParamV2Value,
  RankiParamsV2ParserPluginConfig,
} from "./types.mjs";

const creatorNameList: ohm.ActionDict<string[]> = {
  _iter(...children) {
    return children.map((c) => c.ctorName);
  },
};

const creatorName: ohm.ActionDict<string> = {
  tParamsV2SeparatorParam(sep) {
    const context = this.args.context as R;
    const config =
      context.getPluginConfig<RankiParamsV2ParserPluginConfig>("RankiParamsV2");
    const separators = config.tokens.separator;
    return sep.sourceString === separators.param ? this.ctorName : "none";
  },
};

const paramsV2: ohm.ActionDict<ParamV2[]> = {
  _iter(...children) {
    const context = (this.args.context as R).newChild();
    return children.map((c) => c.paramV2(context));
  },

  v2ParamListInline(param1, sep, param2) {
    const context = (this.args.context as R).newChild("inline");
    const rest = param2.paramsV2(context);
    const joined = [param1.paramV2(context), ...rest];

    return joined;
  },

  v2ParamListBlock(param1, sep, param2) {
    const context = (this.args.context as R).newChild("block");
    const rest = param2.paramsV2(context);
    const joined = [param1.paramV2(context), ...rest];

    return joined;
  },
};

const paramV2KeyList: ohm.ActionDict<ParamV2KeyWord[]> = {
  _iter(...children) {
    return [...children.map((v) => v.paramV2Key(this.args.context))];
  },
  paramKey(first, sep, rest) {
    return [first.sourceString, ...rest.paramV2Key(this.args.context)];
  },
};

const paramV2Key: ohm.ActionDict<ParamV2KeyWord> = {
  paramKeyWord(a, b) {
    return this.sourceString;
  },
};

const paramV2Common: ohm.ActionDict<ParamV2Common> = {
  paramFormatOperator(paramKey, wi1, operatorToken, wi2, paramValues) {
    const context = (this.args.context as R).newChild("block");
    const config =
      context.getPluginConfig<RankiParamsV2ParserPluginConfig>("RankiParamsV2");
    const operators = config.tokens.operators;
    const f = Object.entries(operators).find(
      ([k, v]) => v === operatorToken.sourceString,
    );

    if (!f) {
      throw new Error(`UNRECOGNIZED OPERATOR ${f}`);
    }

    const key: ParamV2KeyWord[] = paramKey.paramV2Key(this.args.context);

    return context.enrich<ParamV2Reduced, ParamV2Setting>({
      type: "setting",
      key,
      args: {
        spaces: {
          keyAndOp: {
            type: "wi",
            raw: wi1.sourceString,
          },
          opAndValues: {
            type: "wi",
            raw: wi2.sourceString,
          },
        },
        separators: [],
      },
      // TODO
      namespace: 1,
      operator: f[0] as ParamV2Operator,
      values: paramValues.paramV2Values(context),
      source: {
        type: "raw",
        raw: this.sourceString,
      },
    });
  },

  paramFormatPositive(paramKey) {
    const context = (this.args.context as R).newChild("inline");
    const key: ParamV2KeyWord[] = paramKey.paramV2Key(this.args.context);

    return context.enrich<ParamV2ReducedPartial, ParamV2Common>({
      key,
      args: {
        spaces: {},
        separators: [],
      },
      operator: "assign",
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      values: [
        {
          type: "boolean",
          raw: "",
          value: true,
        },
      ],
    });
  },

  paramFormatNegative(negation, paramKey) {
    const context = (this.args.context as R).newChild("inline");
    const key: ParamV2KeyWord[] = paramKey.paramV2Key(this.args.context);
    return context.enrich<ParamV2ReducedPartial, ParamV2Common>({
      key,
      args: {
        spaces: {},
        separators: [],
      },
      operator: "assign",
      values: [
        {
          type: "boolean",
          raw: "",
          value: false,
        },
      ],
      source: {
        type: "raw",
        raw: this.sourceString,
      },
    });
  },

  paramFormatPositional(quoted) {
    const context = (this.args.context as R).newChild("inline");
    return context.enrich<ParamV2ReducedPartial, ParamV2Common>({
      key: "positional",
      args: {
        spaces: {},
        separators: [],
      },
      operator: "assign",
      values: [
        {
          type: "mixedcase",
          // WARN this won't work if the quoted content has structure
          raw: quoted.sourceString.slice(1, -1),
        },
      ],
      source: {
        type: "raw",
        raw: this.sourceString,
      },
    });
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
    const context = (this.args.context as R).newChild();
    return children.map((c) => c.paramV2Value(context));
  },

  paramValues(i1, clearance, i2) {
    const context = (this.args.context as R).newChild();
    return [i1.paramV2Value(context), ...i2.paramV2Values(context)];
  },
};

const paramV2Value: ohm.ActionDict<ParamV2Value> = {
  paramValueItemPrimitive_number(num) {
    return {
      type: "number",
      raw: num.sourceString,
      value: +num.sourceString,
    };
  },

  paramValueItemPrimitive_lowercase(c1, c2, lower) {
    return {
      type: "lowercase",
      raw: lower.sourceString,
    };
  },

  paramValueItemPrimitive_true(val) {
    return {
      type: "boolean",
      raw: this.sourceString,
      value: true,
    };
  },

  paramValueItemPrimitive_false(val) {
    return {
      type: "boolean",
      raw: this.sourceString,
      value: false,
    };
  },

  paramValueItemPrimitive_uppercase(check1, check2, val) {
    return {
      type: "uppercase",
      raw: val.sourceString,
    };
  },

  paramValueItemPrimitive_chars(c1, c2, val) {
    return {
      type: "mixedcase",
      raw: val.sourceString,
    };
  },

  paramValueItemPrimitive_mixed(val) {
    return {
      type: "mixedcase",
      raw: val.sourceString,
    };
  },

  quoted(quote1, quotedContent, quote2) {
    return {
      type: "quoted",
      raw: quotedContent.sourceString,
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
    const context = (this.args.context as R).newChild("block");
    return context.enrich<ArgsAndParamsV2Reduced, ArgsAndParamsV2>({
      args: {
        spaces: {
          sepAndNl: {
            type: "wi",
            raw: wi1.sourceString,
          },
          wi1AndWi2: {
            type: "nl",
            raw: nl.sourceString,
          },
          nlAndParam: {
            type: "wi",
            raw: wi2.sourceString,
          },
          paramAndSep: {
            type: "wi",
            raw: wi3.sourceString,
          },
        },
        separators: [
          {
            // !fix these break the types.
            // The type doesn't understand `creatorName` return.
            type: sepLeft1.creatorName(context),
            raw: sepLeft1.sourceString,
          },
          {
            type: sepLeft2.creatorName(context),
            raw: sepLeft2.sourceString,
          },
        ],
      },
      params: {
        variant: "block",
        items: v2ParamListBlock.paramsV2(context),
      },
    });
  },

  v2ParamListInlineContainer(sepLeft1, wi1, v2ParamListInline, wi2, sepLeft2) {
    const context = (this.args.context as R).newChild("block");
    const sepLastCtorName = sepLeft2.creatorName(context) as string[];
    const sepLast = sepLastCtorName.map((type) => ({
      type,
      raw: sepLeft2.sourceString,
    }));

    return context.enrich<ArgsAndParamsV2Reduced, ArgsAndParamsV2>({
      args: {
        spaces: {
          sepAndNl: {
            type: "wi",
            raw: wi1.sourceString,
          },
          nlAndParam: {
            type: "wi",
            raw: wi2.sourceString,
          },
        },
        separators: [
          {
            // !fix these break the types.
            // The type doesn't understand `creatorName` return.
            type: sepLeft1.creatorName(context),
            raw: sepLeft1.sourceString,
          },
          ...sepLast,
        ],
      },
      params: {
        variant: "inline",
        items: v2ParamListInline.paramsV2(context),
      },
    });
  },
};

export const actions = {
  paramsV2,
  paramV2,
  paramV2Common,
  paramV2Values,
  paramV2Value,
  argsAndParamsV2,
  paramV2Key: {
    ...paramV2Key,
    ...paramV2KeyList,
  },
  paramV2SettingNamespace,
  creatorName: {
    ...creatorName,
    ...creatorNameList,
  },
};
