import type {
  AstSourceViewAdditional,
  AstSourceString,
  AstSourceView,
  AstSourceViewDecoderCustom,
  IAstNode,
} from "@dqm/package-dqm-api-v2";
import { assertLeaf, DqmError } from "@dqm/package-utils";
import type { LeafDecoder } from "../ast-node.types.mjs";

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
      assertLeaf(self, {});
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
        throw new DqmError("AST_DECODER_FAILURE", {
          error: e,
          raw,
          decoder: leafDecoder,
        });
      }
    },

    setLeafViewDecoder<G extends AstSourceViewAdditional>(
      type: string,
      decoder: AstSourceViewDecoderCustom<G>,
    ): T {
      assertLeaf(self, { type, decoder });
      leafDecoder = {
        type,
        decode: decoder,
      };
      return self;
    },
  };
}
