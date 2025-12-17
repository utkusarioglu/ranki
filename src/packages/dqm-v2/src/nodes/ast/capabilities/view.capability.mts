import type {
  AstSourceViewAdditional,
  AstSourceString,
  AstSourceView,
  AstSourceViewDecoderCustom,
  IAstNode,
} from "@dqm/package-dqm-api-v2";
import { assertLeaf } from "@dqm/package-dqm-utils";
import type { LeafDecoder } from "../ast-node.types.mjs";
import { DqmAppError } from "../../../errors/dqm-app-error/dqm-app-error.mjs";

export function viewCapability<T extends Pick<IAstNode, "getKind">>(self: T) {
  let leafDecoder!: LeafDecoder;

  function defaultLeafDecoder(): LeafDecoder<string> {
    return {
      type: "string",
      decode: (raw: string) => ({
        type: "string",
        raw,
        value: raw,
      }),
    };
  }

  return {
    getDefinedLeafDecoder(): LeafDecoder {
      return leafDecoder;
    },

    /**
     * @dev
     * #1 I simply don't mind TS1270 here
     */
    // @dependsOn("kind", "ohm")
    getLeafView<G = any>(raw: AstSourceString): AstSourceView<G> {
      assertLeaf(self, { why: "Leaf views are only defined for Leaf nodes" });
      // const raw = this.getSourceString();
      try {
        if (leafDecoder) {
          return {
            type: leafDecoder.type,
            raw,
            ...leafDecoder.decode(raw),
          };
        } else {
          const decoder = defaultLeafDecoder();
          // @ts-expect-error TS2322
          return {
            type: decoder.type,
            raw,
            ...decoder.decode(raw),
          };
        }
      } catch (e) {
        throw new DqmAppError({
          code: "AST_DECODER_FAILURE",
          why: "Source decoding has failed",
          cause: null,
          details: {
            error: e,
            raw,
            decoder: leafDecoder,
          },
        });
      }
    },

    setLeafViewDecoder<G extends AstSourceViewAdditional>(
      type: string,
      decoder: AstSourceViewDecoderCustom<G>,
    ): T {
      assertLeaf(self, {
        why: "leaf view decoder is only needed for leaf nodes",
        details: { type, decoder },
      });
      leafDecoder = {
        type,
        decode: decoder,
      };
      return self;
    },
  };
}
