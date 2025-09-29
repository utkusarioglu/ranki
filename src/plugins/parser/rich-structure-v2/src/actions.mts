import type * as ohm from "ohm-js";
import type { ArgsAndParamsV2 } from "@ranki/plugin-parser-params-v2";
import type {
  ParseNodeRichStructureV2,
  ArgsAndParamsV2RichStructureV2,
} from "./types.mjs";

function hLevel<T extends ohm.Node>(this: T, a: ohm.Node) {
  const l = a.node(this.args.lang);
  l.type = this.ctorName;
  // l["args"]["richStructure.v1"]["name"] = this.ctorName;
  return l;
}

const node: ohm.ActionDict<ParseNodeRichStructureV2> = {
  hLevel_defined(structureType1, separator, structureType2) {
    const sep: ParseNodeRichStructureV2["args"]["richStructure.v2"] =
      separator.argsAndParamsV2(this.args.lang);
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        "richStructure.v2": {
          // name: "SHALL BE SET BY PARENT",
          // !FIX the separators are misplaced. the first separator args and params belong to the SECOND collection, section or whatever the level name is.
          ...sep,
          // args: sep.args,
          // params: sep.params,
        },
      },
      children: [
        structureType1.node(this.args.lang),
        ...structureType2.iterNode(this.args.lang),
      ],
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
    return children.map((c) => c.argsAndParamsV2(this.args.lang));
  },
};

const argsAndParamsV2: ohm.ActionDict<ArgsAndParamsV2> = {
  hStructureSepInline_s(
    structureSepStart,
    wi1,
    structureName,
    wi2,
    structureSepEnd,
  ) {
    return {
      args: {
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
      },
      params: {
        variant: "none",
        items: [],
      },
    };
  },
  hStructureSepInline_sp(
    structureSepStart,
    wi1,
    structureName,
    wi2,
    v2ParamListInlineContainer,
    wi3,
    structureSepEnd,
  ) {
    const config: ArgsAndParamsV2RichStructureV2 =
      v2ParamListInlineContainer.argsAndParamsV2(this.args.lang);
    return {
      args: {
        // !TODO you need ctorName here
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
        "wi.3.length": wi3.sourceString.length,

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
