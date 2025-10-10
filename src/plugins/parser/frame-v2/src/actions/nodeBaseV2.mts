import type { AstNode, RankiLangAstContext } from "@ranki/package-api";
import { zipNodes } from "@ranki/package-api/helpers";
import type * as ohm from "ohm-js";

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
            value: pausedPayload.sourceString,
          },
        },
      ],
    };
  },
};
