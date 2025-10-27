import type * as ohm from "ohm-js";
import { getContext as c } from "@ranki/package-api-v2/helpers";
import type {
  ArgsAndParamsV2,
  ArgsAndParamsV2Reduced,
} from "@ranki/plugin-grammar-params-v2";
import type {
  ParseNodeRichStructureV2,
  ArgsAndParamsV2RichStructureV2,
  ParseNodeRichStructureV2ParentReduced,
} from "./types.mjs";

function hLevel<T extends ohm.Node>(this: T, a: ohm.Node) {
  const context = c(this).newChild();
  const l = a.node(context);
  l.type = this.ctorName;
  return l;
}

const node: ohm.ActionDict<ParseNodeRichStructureV2> = {
  hLevel_defined(structureType1, separator, structureType2) {
    const context = c(this).newChild("block");
    // ! needs a type
    // its previous type was:
    // ParseNodeRichStructureV2["shape"]["richStructure.v2"] =
    const sep = separator.shapeAndParamsV2(context);
    return context.enrich<
      ParseNodeRichStructureV2ParentReduced,
      ParseNodeRichStructureV2
    >({
      kind: "parent",
      creator: this.ctorName,

      shape: {
        spaces: {},
        // !fix I don't understand the separators thing here
        separators: [],
        // "richStructure.v2": {
        //   // name: "SHALL BE SET BY PARENT",
        //   // !FIX the separators are misplaced. the first separator args and params belong to the SECOND collection, section or whatever the level name is.
        //   ...sep,
        //   // shape: sep.args,
        //   // params: sep.params,
        // },
      },
      subtree: {},
      children: [
        structureType1.node(context),
        ...structureType2.iterNode(context),
      ],
      source: {
        type: "raw",
        raw: this.sourceString,
      },
    });
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

const shapeAndParamsV2List: ohm.ActionDict<ArgsAndParamsV2[]> = {
  _iter(...children) {
    const context = c(this).newChild("inline");
    return children.map((ch) => ch.shapeAndParamsV2(context));
  },
};

const shapeAndParamsV2: ohm.ActionDict<ArgsAndParamsV2> = {
  // !FIX
  hStructureSepInline_s(
    structureSepStart,
    wi1,
    structureName,
    wi2,
    structureSepEnd,
  ) {
    const context = c(this).newChild("inline");
    return context.enrich<ArgsAndParamsV2Reduced, ArgsAndParamsV2>({
      shape: {
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
        // FIX this is icky
        variant: "none" as "inline",
        items: [],
      },
    });
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
    const context = c(this).newChild("inline");
    const config: ArgsAndParamsV2RichStructureV2 =
      v2ParamListInlineContainer.shapeAndParamsV2(context);
    return {
      shape: {
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
        "richStructure.v1.config": config.shape,
      },
      params: config.params,
    };
  },
};

export const actions = {
  node,
  shapeAndParamsV2: {
    ...shapeAndParamsV2,
    ...shapeAndParamsV2List,
  },
};
