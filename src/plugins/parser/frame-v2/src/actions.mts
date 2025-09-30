import type * as ohm from "ohm-js";
import { zipNodes } from "@ranki/package-api/helpers";
import type { ParseNode, RankiLangParseContext } from "@ranki/package-api";
import type {
  NodeArgsFrameV2,
  ParseNodeFrameV2,
  ArgsAndParamsV2FrameV2,
} from "./types.mjs";

const nodeBaseV2: ohm.ActionDict<ParseNode> = {
  block_v2(indentation, v2, wi, ender) {
    const context: RankiLangParseContext = { ...this.args.context };
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
      },
      children: [v2.node(context)],
    };
  },
  v2Payload_P(wi1, nl, pauseRoot) {
    const context: RankiLangParseContext = { ...this.args.context };
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
        "wi.1.length": wi1.sourceString.length,
      },
      children: [pauseRoot.node(context)],
    };
  },

  v2Payload_p(pauseRoot) {
    const context: RankiLangParseContext = { ...this.args.context };
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
      },
      children: [pauseRoot.node(context)],
    };
  },

  pauseRoot(whitespace1, pauseList, whitespace2) {
    const context: RankiLangParseContext = { ...this.args.context };
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
        "whitespace.1.length": whitespace1.sourceString.length,
        "whitespace.2.length": whitespace2.sourceString.length,
      },
      children: [pauseList.node(context)],
    };
  },

  pauseList(v2PayloadSection1, pausedContainer, v2PayloadSection2) {
    const context: RankiLangParseContext = { ...this.args.context };
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
      },
      children: zipNodes(
        context,
        v2PayloadSection1,
        pausedContainer,
        v2PayloadSection2,
      ),
    };
  },

  v2PayloadSection(v2PayloadSectionItem1, whitespace, v2PayloadSectionItem2) {
    const context: RankiLangParseContext = { ...this.args.context };
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
      },
      children: zipNodes(
        context,
        v2PayloadSectionItem1,
        whitespace,
        v2PayloadSectionItem2,
      ),
    };
  },

  v2PayloadPlain(plain) {
    const context: RankiLangParseContext = { ...this.args.context };
    context.blockDepth++;
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
      },
      source: {
        type: "mixed",
        value: plain.sourceString,
      },
    };
  },

  // !TODO
  pausedContainer(
    whitespace1,
    pauseStart,
    pausedPayload,
    pauseEnd,
    whitespace2,
  ) {
    const parentContext: RankiLangParseContext = { ...this.args.context };
    parentContext.blockDepth++;
    const leafContext: RankiLangParseContext = { ...parentContext };
    leafContext.inlineDepth++;
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: parentContext.blockDepth,
          inline: parentContext.inlineDepth,
          total: parentContext.inlineDepth + parentContext.blockDepth,
        },
      },
      children: [
        {
          kind: "leaf",
          type: this.ctorName,
          print: true,
          args: {
            depth: {
              block: leafContext.blockDepth,
              inline: leafContext.inlineDepth,
              total: leafContext.inlineDepth + leafContext.blockDepth,
            },
          },
          source: {
            type: "mixed",
            value: pausedPayload.sourceString,
          },
        },
      ],
    };
  },
};

const nodeFrameV2: ohm.ActionDict<ParseNodeFrameV2> = {
  v2_fp(directive, frame, v2FrameConfig, v2Payload, v2End) {
    const context: RankiLangParseContext = { ...this.args.context };
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
        ...v2FrameConfig.v2FrameConfig(context),
      },
      children: [v2Payload.node(context)],
    };
  },

  v2_dfp(directive, directiveConfig, frame, v2FrameConfig, v2Payload, v2End) {
    const context: RankiLangParseContext = { ...this.args.context };
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
        ...directiveConfig.v2FrameConfig(context),
        ...v2FrameConfig.v2FrameConfig(context),
      },
      children: [v2Payload.node(context)],
    };
  },
};

const v2FrameConfig: ohm.ActionDict<NodeArgsFrameV2> = {
  v2DirectiveConfig_D(wi1, nl, wi2, v2ParamListBlock, whitespace) {
    const context: RankiLangParseContext = { ...this.args.context };
    context.blockDepth++;
    const params = v2ParamListBlock.paramsV2(context);
    return {
      "directive.v2": {
        type: this.ctorName,
        args: {
          depth: {
            block: context.blockDepth,
            inline: context.inlineDepth,
            total: context.inlineDepth + context.blockDepth,
          },
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
        },
        params: {
          variant: "block",
          items: params,
        },
      },
    };
  },

  v2DirectiveConfig_d(wi1, v2ParamListInline, wi2) {
    const context: RankiLangParseContext = { ...this.args.context };
    context.blockDepth++;
    const params = v2ParamListInline.paramsV2(context);
    return {
      "directive.v2": {
        type: this.ctorName,
        args: {
          depth: {
            block: context.blockDepth,
            inline: context.inlineDepth,
            total: context.inlineDepth + context.blockDepth,
          },
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
        },
        params: {
          variant: "inline",
          items: params,
        },
      },
    };
  },

  v2FrameConfigP(wi1, v2Type, wi2, sep) {
    const context: RankiLangParseContext = { ...this.args.context };
    context.blockDepth++;
    return {
      "frame.v2": {
        type: this.ctorName,
        frameType: v2Type.sourceString,
        variant: "p",
        args: {
          depth: {
            block: context.blockDepth,
            inline: context.inlineDepth,
            total: context.inlineDepth + context.blockDepth,
          },
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
          "separator.right.type": sep.creatorName(context),
        },
      },
    };
  },

  v2FrameConfigFp_f(
    wi1,
    v2Type,
    wi2,
    v2ParamListInlineContainer,
    wi3,
    sepRight,
  ) {
    const context: RankiLangParseContext = { ...this.args.context };
    context.blockDepth++;
    const config: ArgsAndParamsV2FrameV2 =
      v2ParamListInlineContainer.argsAndParamsV2(context);
    return {
      "frame.v2": {
        type: this.ctorName,
        frameType: v2Type.sourceString,
        variant: "fp_f",
        args: {
          depth: {
            block: context.blockDepth,
            inline: context.inlineDepth,
            total: context.inlineDepth + context.blockDepth,
          },
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
          "wi.3.length": wi3.sourceString.length,

          // !FIX this expects iter if `creatorName` is called
          // "separator.right.type": sepRight.creatorName(context),
          "separator.right.type": sepRight.sourceString,

          "frame.v2.config": config.args,
        },
        params: config.params,
      },
    };
  },

  v2FrameConfigFp_F(
    wi1,
    v2Type,
    wi2,
    v2ParamListBlockContainer,
    wi3,
    sepRight,
  ) {
    const context: RankiLangParseContext = { ...this.args.context };
    context.blockDepth++;
    const config: ArgsAndParamsV2FrameV2 =
      v2ParamListBlockContainer.argsAndParamsV2(context);
    return {
      "frame.v2": {
        type: this.ctorName,
        frameType: v2Type.sourceString,
        variant: "fp_F",
        args: {
          depth: {
            block: context.blockDepth,
            inline: context.inlineDepth,
            total: context.inlineDepth + context.blockDepth,
          },
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
          "wi.3.length": wi3.sourceString.length,
          // !FIX sepRight doesn't work
          // "separator.right.type": sepRight.creatorName(context),
          "separator.right.type": sepRight.sourceString,
          "frame.v2.config": config.args,
        },
        params: config.params,
      },
    };
  },
};

export const actions = {
  node: {
    ...nodeFrameV2,
    ...nodeBaseV2,
  },
  v2FrameConfig,
};
