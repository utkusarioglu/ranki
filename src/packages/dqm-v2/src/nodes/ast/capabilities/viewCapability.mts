import type {
  AstSourceViewBase,
  AstSourceString,
  AstSourceView,
  AstSourceViewDecoder,
} from "@dqm/package-dqm-api-v2";
import { assertLeaf, DqmError } from "@dqm/package-utils";
import type { LeafDecoder } from "../ast-node.types.mjs";

export function viewCapability<T>(self: T) {
  let leafDecoder!: LeafDecoder;

  function defaultLeafDecoder(): LeafDecoder {
    return {
      type: "string",
      decoder: (raw: string) => ({
        type: "string",
        raw,
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
    getLeafView<G extends AstSourceViewBase>(
      raw: AstSourceString,
    ): AstSourceView<G> {
      // @ts-expect-error
      assertLeaf(self, {});
      // const raw = this.getSourceString();
      try {
        if (leafDecoder) {
          // @ts-expect-error #1
          return {
            type: leafDecoder.type,
            raw,
            ...leafDecoder.decoder(raw),
          };
        } else {
          const decoder = defaultLeafDecoder();
          // @ts-expect-error #1
          return decoder.decoder(raw);
        }
      } catch (e) {
        throw new DqmError("AST_DECODER_FAILURE", {
          error: e,
          raw,
          decoder: leafDecoder,
        });
      }
    },

    // @dependsOn("kind")
    setLeafViewDecoder<G extends AstSourceViewBase>(
      type: string,
      decoder: AstSourceViewDecoder<G>,
    ): T {
      // @ts-expect-error
      assertLeaf(self, { type, decoder });
      leafDecoder = {
        type,
        decoder,
      };
      return self;
    },
  };
}
