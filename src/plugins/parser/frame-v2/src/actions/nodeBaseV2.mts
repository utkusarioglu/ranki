import type { AstNode, RankiLangAstContext } from "@ranki/package-api-v2";
import { zipNodes } from "@ranki/package-api-v2/helpers";
import type * as ohm from "ohm-js";
import type { RankiLangParserPluginParseHandlerFrameV2 } from "../types.mjs";

export const nodeBaseV2: ohm.ActionDict<AstNode> = {
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

  v2PayloadSection(
    v2PayloadSectionItem1,
    whitespace1,
    v2PayloadSectionItem2,
    whitespace2,
  ) {
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
        whitespace1,
        v2PayloadSectionItem2,
      ),
    };
  },

  v2PayloadPlain(plain) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    // const child = context.lang.parse<RankiLangParserPluginParseHandlerFrameV2>(
    //   { [context.theater]: plain.sourceString },
    //   this.args.context,
    // );
    console.log({ context });
    const child = context.hooks.parseAst(
      plain.sourceString,
      context,
      context.hooks,
    );
    return {
      kind: "parent",
      type: this.ctorName,
      print: true,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        report: child.report,
      },
      // children: [child.theaters[context.theater].stages.ast.root],
      children: [child.root],
      // report: child.report,
      // raw: child.theaters[context.theater].stages.raw,
    };
  },

  // !TODO
  pausedContainer(
    // whitespace1,
    pauseStart,
    pausedPayload,
    pauseEnd,
    // whitespace2,
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
            raw: pausedPayload.sourceString,
          },
        },
      ],
    };
  },
};
