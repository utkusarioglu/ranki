import type {
  AstNode,
  AstNodeParentReduced,
  AstNodeParent,
  AstNodeLeafReduced,
  AstNodeLeaf,
  RankiLangContextInstance as R,
} from "@ranki/package-api-v2";
import { getContext as c } from "@ranki/package-api-v2/helpers";
import { joinNodes, zipNodes } from "@ranki/package-api-v2/helpers";
import type * as ohm from "ohm-js";
import type { RankiLangParserPluginParseHandlerFrameV2 as V2 } from "../types/context.mjs";

export const nodeBaseV2: ohm.ActionDict<AstNode> = {
  block_v2(indentation, v2, wi, ender) {
    const context = c<V2>(this).newChild("block");
    return context.enrich<AstNodeParentReduced, AstNodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,

        args: {
          ...context.getContextArgs(),
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
      },
      { subtree: {}, children: [v2.node(context)] },
    );
  },

  v2Payload_P(wi1, nl, pauseRoot) {
    const context = c<V2>(this).newChild("block");
    return context.enrich<AstNodeParentReduced, AstNodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,

        args: {
          ...context.getContextArgs(),
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
      },
      { subtree: {}, children: [pauseRoot.node(context)] },
    );
  },

  v2Payload_p(pauseRoot) {
    const context = c<V2>(this).newChild("block");
    return context.enrich<AstNodeParentReduced, AstNodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,

        args: {
          ...context.getContextArgs(),
          spaces: {},
          separators: [],
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      { subtree: {}, children: [pauseRoot.node(context)] },
    );
  },

  pauseList(v2PayloadSection1, pausedContainer, v2PayloadSection2) {
    const context = c<V2>(this).newChild("block");
    return context.enrich<AstNodeParentReduced, AstNodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,

        args: {
          ...context.getContextArgs(),
          spaces: {},
          // TODO maybe `pausedContainer` should be a separator.
          // after all, that's what it actually does
          separators: [],
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {},
        children: zipNodes(
          context,
          v2PayloadSection1,
          pausedContainer,
          v2PayloadSection2,
        ),
      },
    );
  },

  v2PayloadSection(
    v2PayloadSectionItem1,
    whitespaceSeparator,
    v2PayloadSectionItem2,
    whitespace2,
  ) {
    const context = c<V2>(this).newChild("block");
    return context.enrich<AstNodeParentReduced, AstNodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,

        args: {
          ...context.getContextArgs(),
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
      },
      {
        subtree: {},
        children: joinNodes(
          context,
          v2PayloadSectionItem1,
          v2PayloadSectionItem2,
        ),
      },
    );
  },

  v2PayloadPlain(plain) {
    // TODO i'm so not sure if this is what's supposed to happen here
    // this uses a context that was created in a parent to produce a parser deeper in the chain
    const context = c<V2>(this).newChild("block");

    const child = context.parseAst(plain.sourceString, context);
    return context.enrich<AstNodeParentReduced, AstNodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,

        args: {
          ...context.getContextArgs(),
          spaces: {},
          separators: [],
          // report: child.report,
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      { subtree: {}, children: [child.root] },
    );
  },

  // !TODO are pauseStart and pauseEnd separators or fillers?
  pausedContainer(pauseStart, pausedPayload, pauseEnd) {
    const parentContext = c<V2>(this).newChild("block");
    return parentContext.enrich<AstNodeParentReduced, AstNodeParent>(
      {
        kind: "parent",
        creator: this.ctorName,
        args: {
          ...parentContext.getContextArgs(),
          spaces: {},
          separators: [],
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {},
        children: [
          (() => {
            const leafContext = (parentContext as R<V2>).newChild("inline");
            return leafContext.enrich<AstNodeLeafReduced, AstNodeLeaf>({
              kind: "leaf",
              creator: this.ctorName,
              print: true,
              args: {
                spaces: {},
                separators: [],
              },
              source: {
                type: "raw",
                raw: pausedPayload.sourceString,
              },
            });
          })(),
        ],
      },
    );
  },
};
