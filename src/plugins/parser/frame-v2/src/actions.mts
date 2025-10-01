import type * as ohm from "ohm-js";
import { zipNodes } from "@ranki/package-api/helpers";
import type {
  AstNode,
  RankiLangAstContext,
  RankiLangParseSpecs,
} from "@ranki/package-api";
import type {
  NodeArgsFrameV2,
  ParseNodeFrameV2,
  ArgsAndParamsV2FrameV2,
  NodeArgsDirectiveV2Config,
  NodeArgsFrameV2Config,
  NodeArgsFrameV2Fp_F,
} from "./types.mjs";
import { applyV2Directives } from "@ranki/plugin-parser-params-v2";

const nodeBaseV2: ohm.ActionDict<AstNode> = {
  block_v2(indentation, v2, wi, ender) {
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
      },
      children: [v2.node(context)],
    };
  },
  v2Payload_P(wi1, nl, pauseRoot) {
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
        "wi.1.length": wi1.sourceString.length,
      },
      children: [pauseRoot.node(context)],
    };
  },

  v2Payload_p(pauseRoot) {
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
      },
      children: [pauseRoot.node(context)],
    };
  },

  pauseRoot(whitespace1, pauseList, whitespace2) {
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
        "whitespace.1.length": whitespace1.sourceString.length,
        "whitespace.2.length": whitespace2.sourceString.length,
      },
      children: [pauseList.node(context)],
    };
  },

  pauseList(v2PayloadSection1, pausedContainer, v2PayloadSection2) {
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
    const context: RankiLangAstContext = { ...this.args.context };
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
    const parentContext: RankiLangAstContext = { ...this.args.context };
    parentContext.blockDepth++;
    const leafContext: RankiLangAstContext = { ...parentContext };
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
        ...v2FrameConfig.v2FrameConfig(context),
      },
      children: [v2Payload.node(context)],
    };
  },

  // // @ts-expect-error
  // v2PayloadSectionItem_v2(v2) {
  //   return {
  //     message: "hi",
  //   };
  // },

  v2_dfp(directive, directiveConfig, frame, v2FrameConfig, v2Payload, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const directiveArgs: NodeArgsDirectiveV2Config =
      directiveConfig.v2FrameConfig(context);
    const frameArgs: NodeArgsFrameV2Fp_F = v2FrameConfig.v2FrameConfig(context);

    const parseSpecs: RankiLangParseSpecs = {
      theater: context.theater,
      role: context.role,
      inlineDepth: context.inlineDepth,
      blockDepth: context.blockDepth,
      startRule: "v2Payload",
      frame: {
        version: "v2",
        type: frameArgs["frame.v2"].frameType,
        directives: directiveArgs["directive.v2"]["params"]["items"],
        params: frameArgs["frame.v2"]["params"]["items"],
      },
    };
    const newConfig = applyV2Directives(
      context.lang.getConfig().merged,
      directiveArgs["directive.v2"]["params"]["items"],
      // !TODO this function needs to come from the plugin def for a frame's directive
      (i, key, operator, values) => {
        let path: string[];
        switch (i) {
          case 0:
            path = ["content", "prefix"];
            break;
          default:
            throw new Error(
              `UNDEFINED POSITIONAL PARAM: ${values[0].value.toString()}`,
            );
        }

        return {
          path,
          operator,
          values,
        };
      },
    );

    console.log({ newConfig });

    const child = context.lang
      .clone(newConfig)
      .parse({ [context.theater]: v2Payload.sourceString }, parseSpecs);

    const theater = child.theaters[context.theater];

    // // @ts-expect-error
    // frameArgs["frame.v2"]["report"] = theater.stages.ast.report;
    // frameArgs["frame.v2"]["specs"] = {
    //   directives:
    // };

    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        ...directiveArgs,
        ...frameArgs,
      },
      // children: [v2Payload.node(context)],
      children: [theater.stages.ast.root],
      // children: [theater.stages.ast],
    };
  },
};

const v2FrameConfig: ohm.ActionDict<NodeArgsFrameV2> = {
  v2DirectiveConfig_D(wi1, nl, wi2, v2ParamListBlock, whitespace) {
    const context: RankiLangAstContext = { ...this.args.context };
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
    const context: RankiLangAstContext = { ...this.args.context };
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
    const context: RankiLangAstContext = { ...this.args.context };
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
    const context: RankiLangAstContext = { ...this.args.context };
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
    const context: RankiLangAstContext = { ...this.args.context };
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
