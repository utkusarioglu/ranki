import type * as ohm from "ohm-js";
import type {
  AstNode,
  AstNodeLeafReduced,
  AstNodeParentReduced,
  AstNodeLeaf,
  AstNodeParent,
  RankiLangContextInstance as R,
} from "@ranki/package-api-v2";
import type { ParseNodeFrameV1 } from "./types.mjs";
import type { ArgsAndParamsV1 } from "./types.mjs";
import { FrameV1 as V1 } from "./handler.mjs";

const nodeBaseV2: ohm.ActionDict<AstNode> = {
  // !TODO end
  block_v1(indentation, v1Block, wi1, end) {
    const context = (this.args.context as R<V1>).newChild("block");
    return context.enrich<AstNodeParentReduced, AstNodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,
        args: {
          spaces: {
            indentation: {
              type: "indentation",
              raw: indentation.sourceString,
            },
            suffix: {
              type: "wi",
              raw: wi1.sourceString,
            },
          },
          separators: [],
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {},
        children: [v1Block.node(context)],
      },
    );
  },
};

const nodeFrameV1: ohm.ActionDict<ParseNodeFrameV1> = {
  v1Inline_p(
    frameV1_1,
    wi1,
    v1Type,
    wi2,
    sepRight1,
    v1PayloadInline,
    frameV1_2,
  ) {
    const context = (this.args.context as R<V1>).newChild("inline");

    const childContext = context.newChild().setParser({
      type: "RankiFrameV1",
      chain: v1Type.sourceString,
      params: [],
    });

    const child = context.parseAst(v1PayloadInline.sourceString, childContext);
    return context.enrich<AstNodeParentReduced, AstNodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,
        args: {
          spaces: {
            frameAndType: {
              type: "wi",
              raw: wi1.sourceString,
            },
            typeAndSep: {
              type: "wi",
              raw: wi2.sourceString,
            },
          },
          separators: [
            {
              // !fix this has any type
              type: sepRight1.creatorName(context),
              raw: sepRight1.sourceString,
            },
          ],
          // @ts-expect-error TODO
          "frame.v1": {
            variant: "p",
            frameType: v1Type.sourceString,
            // report: child.report,
          },
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {},
        children: [child.root],
      },
    );
  },

  v1Inline_fp(
    frameV1_1,
    wi1,
    v1Type,
    wi2,
    sepRight1,
    wi3,
    v1ParamListInline,
    wi4,
    sepRight2,
    v1PayloadInline,
    frameV1_2,
  ) {
    const context = (this.args.context as R<V1>).newChild("inline");
    const argsAndParamsV1 = v1ParamListInline.argsAndParamsV1(context);
    const newContext = context.newChild().setParser({
      type: "RankiFrameV1",
      chain: v1Type.sourceString,
      params: [],
    });
    const child = context.parseAst(v1PayloadInline.sourceString, newContext);
    return context.enrich<AstNodeParentReduced, AstNodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,
        args: {
          spaces: {
            frameAndType: {
              type: "wi",
              raw: wi1.sourceString,
            },
            typeAndSep: {
              type: "wi",
              raw: wi2.sourceString,
            },
            sepAndParam: {
              type: "wi",
              raw: wi3.sourceString,
            },
            paramAndSep: {
              type: "wi",
              raw: wi4.sourceString,
            },
          },
          separators: [
            {
              type: sepRight1.creatorName(context),
              raw: sepRight1.sourceString,
            },
            {
              type: sepRight2.creatorName(context),
              raw: sepRight2.sourceString,
            },
          ],
          // @ts-expect-error TODO
          "frame.v1": {
            variant: "fp",
            frameType: v1Type.sourceString,
            ...argsAndParamsV1,
            // report: child.report,
          },
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {},
        children: [child.root],
      },
    );
  },

  v1Block_p(
    frameV1_1,
    wi1,
    v1Type,
    wi2,
    sep,
    wi3,
    nl1,
    v1PayloadBlock,
    v1BlockEnd,
  ) {
    const context = (this.args.context as R<V1>).newChild("inline");
    const childContext = context.newChild().setParser({
      type: "RankiFrameV1",
      chain: v1Type.sourceString,
      params: [],
    });
    const child = context.parseAst(v1PayloadBlock.sourceString, childContext);
    return context.enrich<AstNodeParentReduced, AstNodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,
        args: {
          spaces: {
            frameAndType: {
              type: "wi",
              raw: wi1.sourceString,
            },
            typeAndSep: {
              type: "wi",
              raw: wi2.sourceString,
            },
            sepAndNl: {
              type: "wi",
              raw: wi3.sourceString,
            },
            sepAndPayload: {
              type: "nl",
              raw: nl1.sourceString,
            },
          },
          separators: [
            {
              type: sep.creatorName(context),
              raw: sep.sourceString,
            },
          ],
          // @ts-expect-error TODO
          "frame.v1": {
            variant: "p",
            frameType: v1Type.sourceString,
          },
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {},
        children: [child.root],
      },
    );
  },

  v1Block_fp(
    frameV1,
    wi1,
    v1Type,
    wi2,
    sep1,
    wi3,
    v1ParamListInline,
    wi4,
    sep2,
    wi5,
    nl1,
    v1PayloadBlock,
    v1BlockEnd,
  ) {
    const context = (this.args.context as R<V1>).newChild("block");
    const argsAndParamsV1: ArgsAndParamsV1 =
      v1ParamListInline.argsAndParamsV1(context);
    const newContext = context.newChild().setParser({
      type: "RankiFrameV1",
      chain: v1Type.sourceString,
      params: [],
    });
    const child = context.parseAst(v1PayloadBlock.sourceString, newContext);
    return context.enrich<AstNodeParentReduced, AstNodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,
        args: {
          spaces: {
            frameAndType: {
              type: "wi",
              raw: wi1.sourceString,
            },
            typeAndSep: {
              type: "wi",
              raw: wi2.sourceString,
            },
            sepAndParam: {
              type: "wi",
              raw: wi3.sourceString,
            },
            paramAndSep: {
              type: "wi",
              raw: wi4.sourceString,
            },
            sepAndNl: {
              type: "wi",
              raw: wi5.sourceString,
            },
            sepAndPayload: {
              type: "nl",
              raw: nl1.sourceString,
            },
          },
          separators: [
            {
              type: sep1.creatorName(context),
              raw: sep1.sourceString,
            },
            {
              type: sep2.creatorName(context),
              raw: sep2.sourceString,
            },
          ],
          // @ts-expect-error TODO
          "frame.v1": {
            variant: "fp",
            frameType: v1Type.sourceString,
            ...argsAndParamsV1,
            // report: child.report,
          },
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {},
        children: [child.root],
      },
    );
  },
};

const paramV1: ohm.ActionDict<string> = {
  v1ParamValue(val) {
    return val.sourceString;
  },
};

const paramsV1: ohm.ActionDict<string[]> = {
  _iter(...children) {
    const context = (this.args.context as R<V1>).newChild("inline");
    return children.map((v) => v.paramV1(context));
  },
};

const argsAndParamsV1: ohm.ActionDict<ArgsAndParamsV1> = {
  v1ParamListInline(v1ParamValue1, sep, v1ParamValue2) {
    const context = (this.args.context as R<V1>).newChild("inline");
    return {
      parser: { hash: context.getHash("ast") },
      args: {},
      params: [
        v1ParamValue1.paramV1(context),
        ...v1ParamValue2.paramsV1(context),
      ],
    };
  },
};

const creatorName: ohm.ActionDict<string> = {
  tFrameV1SeparatorParam(one) {
    return this.ctorName;
  },
};

export const actions = {
  node: {
    ...nodeFrameV1,
    ...nodeBaseV2,
  },
  creatorName,
  paramV1,
  paramsV1,
  argsAndParamsV1,
};
