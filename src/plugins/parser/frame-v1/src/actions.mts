import type * as ohm from "ohm-js";
import type { RankiLangAstContext, AstNode } from "@ranki/package-api";
import type { ParseNodeFrameV1 } from "./types.mjs";
import type { ArgsAndParamsV1 } from "./types.mjs";

const nodeBaseV2: ohm.ActionDict<AstNode> = {
  block_v1(indentation, v1Block, wi1, end) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        "indentation.1.length": indentation.sourceString.length,
        "wi.1.length": wi1.sourceString.length,
        // !TODO end
      },
      children: [v1Block.node(context)],
    };
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
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    const child = context.lang.clone(null).parse(
      { [context.theater]: v1PayloadInline.sourceString },
      {
        ...context,
        frame: {
          version: "v1",
          chain: v1Type.sourceString,
          params: [],
        },
      },
    );
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
        "frame.v1": {
          variant: "p",
          frameType: v1Type.sourceString,
        },
      },
      children: [child.theaters[context.theater].stages.ast.root],
    };
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
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    const argsAndParamsV1 = v1ParamListInline.argsAndParamsV1(context);
    const child = context.lang.clone(null).parse(
      { [context.theater]: v1PayloadInline.sourceString },
      {
        ...context,
        frame: {
          version: "v1",
          chain: v1Type.sourceString,
          params: argsAndParamsV1["params"],
        },
      },
    );
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
        "frame.v1": {
          variant: "fp",
          frameType: v1Type.sourceString,
          ...argsAndParamsV1,
        },
      },
      children: [child.theaters[context.theater].stages.ast.root],
    };
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
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const child = context.lang.clone(null).parse(
      { [context.theater]: v1PayloadBlock.sourceString },
      {
        ...context,
        frame: {
          version: "v1",
          chain: v1Type.sourceString,
          params: [],
        },
      },
    );
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
        "frame.v1": {
          variant: "p",
          frameType: v1Type.sourceString,
        },
      },
      children: [child.theaters[context.theater].stages.ast.root],
    };
  },

  v1Block_fp(
    frameV1,
    wi1,
    v1Type,
    wi2,
    sepRight1,
    wi3,
    v1ParamListInline,
    wi4,
    sep,
    wi5,
    nl1,
    v1PayloadBlock,
    v1BlockEnd,
  ) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const argsAndParamsV1: ArgsAndParamsV1 =
      v1ParamListInline.argsAndParamsV1(context);
    const child = context.lang.clone(null).parse(
      { [context.theater]: v1PayloadBlock.sourceString },
      {
        ...context,
        frame: {
          version: "v1",
          chain: v1Type.sourceString,
          params: argsAndParamsV1["params"],
        },
      },
    );
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        // !TODO args
        "wi.1.length": wi1.sourceString.length,
        "wi.2.length": wi2.sourceString.length,
        "wi.3.length": wi3.sourceString.length,
        "wi.4.length": wi4.sourceString.length,
        "wi.5.length": wi5.sourceString.length,
        "frame.v1": {
          variant: "fp",
          frameType: v1Type.sourceString,
          ...argsAndParamsV1,
          report: child.report,
        },
      },
      children: [child.theaters[context.theater].stages.ast.root],
    };
  },
};

const paramV1: ohm.ActionDict<string> = {
  v1ParamValue(val) {
    return val.sourceString;
  },
};

const paramsV1: ohm.ActionDict<string[]> = {
  _iter(...children) {
    const context: RankiLangAstContext = { ...this.args.context };
    // context.depth++;
    return children.map((v) => v.paramV1(context));
  },
};

const argsAndParamsV1: ohm.ActionDict<ArgsAndParamsV1> = {
  v1ParamListInline(v1ParamValue1, sep, v1ParamValue2) {
    const context: RankiLangAstContext = { ...this.args.context };
    // context.depth++;
    return {
      args: {},
      params: [
        v1ParamValue1.paramV1(context),
        ...v1ParamValue2.paramsV1(context),
      ],
    };
  },
};

export const actions = {
  node: {
    ...nodeFrameV1,
    ...nodeBaseV2,
  },
  paramV1,
  paramsV1,
  argsAndParamsV1,
};
