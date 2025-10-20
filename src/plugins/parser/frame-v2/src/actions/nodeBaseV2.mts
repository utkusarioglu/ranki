import type { AstNode, RankiLangAstContext } from "@ranki/package-api-v2";
import { joinNodes, zipNodes } from "@ranki/package-api-v2/helpers";
import type * as ohm from "ohm-js";
import type { RankiLangParserPluginParseHandlerFrameV2 } from "../types/context.mjs";

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
        spaces: {
          prefix: {
            type: "indentation",
            raw: indentation.sourceString,
          },
          v2AndEnder: {
            type: "wi",
            raw: wi.sourceString,
          },
        },
        separators: [],
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {},
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
        spaces: {
          prefix: {
            type: "wi",
            raw: wi1.sourceString,
          },
          wiAndPause: {
            type: "nl",
            raw: nl.sourceString,
          },
        },
        separators: [],
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {},
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
        spaces: {},
        separators: [],
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {},
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
        spaces: {},
        // TODO maybe `pausedContainer` should be a separator.
        // after all, that's what it actually does
        separators: [],
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {},
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
    whitespaceSeparator,
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
        spaces: {
          suffix: {
            type: "whitespace",
            raw: whitespace2.sourceString,
          },
        },
        separators: whitespaceSeparator.separator(context),
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {},
      children: joinNodes(
        context,
        v2PayloadSectionItem1,
        v2PayloadSectionItem2,
      ),
    };
  },

  v2PayloadPlain(plain) {
    // TODO i'm so not sure if this is what's supposed to happen here
    // this uses a context that was created in a parent to produce a parser deeper in the chain
    const context: RankiLangAstContext<RankiLangParserPluginParseHandlerFrameV2> =
      { ...this.args.context };
    context.blockDepth++;
    console.log({ context });

    const parseAst = context.hooks.createAstParser(context);
    const child = parseAst(plain.sourceString);
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
        separators: [],
        // report: child.report,
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {},
      children: [child.root],
    };
  },

  // !TODO are pauseStart and pauseEnd separators or fillers?
  pausedContainer(pauseStart, pausedPayload, pauseEnd) {
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
        spaces: {},
        separators: [],
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {},
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
            spaces: {},
            separators: [],
          },
          source: {
            type: "raw",
            raw: pausedPayload.sourceString,
          },
        },
      ],
    };
  },
};
