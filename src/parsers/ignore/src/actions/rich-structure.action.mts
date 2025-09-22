import type * as ohm from "ohm-js";
import type { ParseNode } from "../types/types.mjs";
import type { NodeArgs } from "../types/types.mjs";
import type { ArgsAndParamsV2 } from "../types/node-arg.mjs";

function hLevel(a: ohm.Node) {
  const l = a.node(this.args.context);
  l.type = this.ctorName;
  // l["args"]["richStructure.v1"]["name"] = this.ctorName;
  return l;
}

const node: ohm.ActionDict<ParseNode> = {
  hLevel_defined(structureType1, separator, structureType2) {
    const sep = separator.argsAndParamsV2(this.args.context);
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        "richStructure.v1": {
          // name: "SHALL BE SET BY PARENT",
          // !FIX the separators are misplaced. the first separator args and params belong to the SECOND collection, section or whatever the level name is.
          ...sep,
          // args: sep.args,
          // params: sep.params,
        },
      },
      children: [
        structureType1.node(this.args.context),
        ...structureType2.iterNode(this.args.context),
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

const argsAndParamsV2: ohm.ActionDict<ArgsAndParamsV2> = {
  _iter(...children) {
    return children.map((c) => c.argsAndParamsV2(this.args.context));
  },
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
    const config: ArgsAndParamsV2 = v2ParamListInlineContainer.argsAndParamsV2(
      this.args.context,
    );
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

export const richStructureActions = {
  node,
  argsAndParamsV2,
  // creatorName,
  // iterNode,
};
