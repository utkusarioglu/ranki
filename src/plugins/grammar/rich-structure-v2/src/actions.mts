import type * as ohm from "ohm-js";
import type { RankiLangAstContext } from "@ranki/package-api-v2";
import type { ArgsAndParamsV2 } from "@ranki/plugin-grammar-params-v2";
import type {
  ParseNodeRichStructureV2,
  ArgsAndParamsV2RichStructureV2,
} from "./types.mjs";

function hLevel<T extends ohm.Node>(this: T, a: ohm.Node) {
  const context: RankiLangAstContext = { ...this.args.context };
  const l = a.node(context);
  l.type = this.ctorName;
  return l;
}

const node: ohm.ActionDict<ParseNodeRichStructureV2> = {
  hLevel_defined(structureType1, separator, structureType2) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const sep: ParseNodeRichStructureV2["args"]["richStructure.v2"] =
      separator.argsAndParamsV2(context);
    return {
      kind: "parent",
      creator: this.ctorName,
      parser: { hash: context.astHash },
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
        // !fix I don't understand the separators thing here
        separators: [],
        "richStructure.v2": {
          // name: "SHALL BE SET BY PARENT",
          // !FIX the separators are misplaced. the first separator args and params belong to the SECOND collection, section or whatever the level name is.
          ...sep,
          // args: sep.args,
          // params: sep.params,
        },
      },
      children: [
        structureType1.node(context),
        ...structureType2.iterNode(context),
      ],
      source: {
        type: "raw",
        raw: this.sourceString,
      },
    };
  },
  richStructure(a) {
    return hLevel.call(this, a);
  },
  collection(a) {
    return hLevel.call(this, a);
  },
  volume(a) {
    return hLevel.call(this, a);
  },

  chapter(a) {
    return hLevel.call(this, a);
  },

  article(a) {
    return hLevel.call(this, a);
  },
};

const argsAndParamsV2List: ohm.ActionDict<ArgsAndParamsV2[]> = {
  _iter(...children) {
    const context: RankiLangAstContext = { ...this.args.context };
    return children.map((c) => c.argsAndParamsV2(context));
  },
};

const argsAndParamsV2: ohm.ActionDict<ArgsAndParamsV2> = {
  // @ts-expect-error
  // !FIX
  hStructureSepInline_s(
    structureSepStart,
    wi1,
    structureName,
    wi2,
    structureSepEnd,
  ) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      parser: { hash: context.astHash },
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {
          startAndName: {
            type: "wi",
            raw: wi1.sourceString,
          },
          nameAndEnd: {
            type: "wi",
            raw: wi2.sourceString,
          },
        },
        separators: [
          {
            type: "structure",
            raw: structureSepStart.sourceString,
          },
          {
            type: "structure",
            raw: structureSepEnd.sourceString,
          },
        ],
      },
      params: {
        variant: "none",
        items: [],
      },
    };
  },

  // @ts-expect-error
  // !FIX
  hStructureSepInline_sp(
    structureSepStart,
    wi1,
    structureName,
    wi2,
    v2ParamListInlineContainer,
    wi3,
    structureSepEnd,
  ) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    const config: ArgsAndParamsV2RichStructureV2 =
      v2ParamListInlineContainer.argsAndParamsV2(context);
    return {
      parser: { hash: context.astHash },
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {
          startAndName: {
            type: "wi",
            raw: wi1.sourceString,
          },
          nameAndParam: {
            type: "wi",
            raw: wi2.sourceString,
          },
          paramAndEnd: {
            type: "wi",
            raw: wi3.sourceString,
          },
        },
        separators: [
          {
            type: "structure",
            raw: structureSepStart.sourceString,
          },
          {
            type: "structure",
            raw: structureSepEnd.sourceString,
          },
        ],
        // !TODO you need ctorName here

        // !TODO not sure if this is supposed to be placed here
        "richStructure.v1.config": config.args,
      },
      params: config.params,
    };
  },
};

export const actions = {
  node,
  argsAndParamsV2: {
    ...argsAndParamsV2,
    ...argsAndParamsV2List,
  },
};
