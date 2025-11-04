import type * as ohm from "ohm-js";
import { getContext as c } from "@ranki/package-api-v2/helpers";
import type {
  FrameV1Node,
  FrameV1NodeParentReduced,
  ParseNodeFrameV1,
} from "./types.mjs";
import type {
  ShapeAndParamsV1 as ShapeAndParamsV1,
  FrameV1NodeParent,
} from "./types.mjs";

const nodeBaseV2: ohm.ActionDict<FrameV1Node> = {
  // !TODO end
  block_v1(indentation, v1Block, wi1, _end) {
    const context = c(this).newChild(this, "block");
    return context.newAstNode<FrameV1NodeParentReduced, FrameV1NodeParent>(
      {
        kind: "parent",
        shape: {
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
    _frameV1_1,
    wi1,
    v1Type,
    wi2,
    sepRight1,
    v1PayloadInline,
    _frameV1_2,
  ) {
    const context = c(this).newChild(this, "inline");

    const childContext = context.newChild(this).newBoundary({
      type: "RankiFrameV1",
      chain: [[v1Type.sourceString]],
      params: [],
    });

    const child = childContext.parseAst(v1PayloadInline.sourceString);
    return context.newAstNode<FrameV1NodeParentReduced, FrameV1NodeParent>(
      {
        kind: "parent",
        shape: {
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
        },
      },
      {
        subtree: {},
        children: [child.root],
      },
    );
  },

  v1Inline_fp(
    _frameV1_1,
    wi1,
    v1Type,
    wi2,
    sepRight1,
    wi3,
    v1ParamListInline,
    wi4,
    sepRight2,
    v1PayloadInline,
    _frameV1_2,
  ) {
    const context = c(this).newChild(this, "inline");
    const shapeAndParamsV1 = v1ParamListInline.shapeAndParamsV1(
      context,
    ) as ShapeAndParamsV1;
    const newContext = context.newChild(this).newBoundary({
      type: "RankiFrameV1",
      chain: [[v1Type.sourceString]],
      params: shapeAndParamsV1.params,
    });
    const child = newContext.parseAst(v1PayloadInline.sourceString);
    return context.newAstNode<FrameV1NodeParentReduced, FrameV1NodeParent>(
      {
        kind: "parent",
        shape: {
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
        },
      },
      {
        subtree: {},
        children: [child.root],
      },
    );
  },

  v1Block_p(
    _frameV1_1,
    wi1,
    v1Type,
    wi2,
    sep,
    wi3,
    nl1,
    v1PayloadBlock,
    _v1BlockEnd,
  ) {
    const context = c(this).newChild(this, "inline");
    const childContext = context.newChild(this).newBoundary({
      type: "RankiFrameV1",
      chain: [[v1Type.sourceString]],
      params: [],
    });
    const child = childContext.parseAst(v1PayloadBlock.sourceString);
    return context.newAstNode<FrameV1NodeParentReduced, FrameV1NodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,
        shape: {
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
    _frameV1,
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
    _v1BlockEnd,
  ) {
    const context = c(this).newChild(this, "block");
    const shapeAndParamsV1: ShapeAndParamsV1 =
      v1ParamListInline.shapeAndParamsV1(context);
    shapeAndParamsV1 && true;
    const newContext = context.newChild(this).newBoundary({
      type: "RankiFrameV1",
      chain: [[v1Type.sourceString]],
      params: [],
    });
    const child = newContext.parseAst(v1PayloadBlock.sourceString);
    return context.newAstNode<FrameV1NodeParentReduced, FrameV1NodeParent>(
      {
        kind: "parent",
        // creator: this.ctorName,
        shape: {
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
    const context = c(this).newChild(this, "inline");
    return children.map((v) => v.paramV1(context));
  },
};

const shapeAndParamsV1: ohm.ActionDict<ShapeAndParamsV1> = {
  v1ParamListInline(v1ParamValue1, _sep, v1ParamValue2) {
    const context = c(this).newChild(this, "inline");
    return {
      shape: {},
      params: [
        v1ParamValue1.paramV1(context),
        ...v1ParamValue2.paramsV1(context),
      ],
    };
  },
};

const creatorName: ohm.ActionDict<string> = {
  tFrameV1SeparatorParam(_one) {
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
  shapeAndParamsV1,
};
