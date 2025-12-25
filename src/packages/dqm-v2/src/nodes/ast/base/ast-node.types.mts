import type {
  IAstNodeRelationship,
  AstSourceViewDecoderCustom,
} from "@dqm/package-dqm-api-v2";
import type * as ohm from "ohm-js";

export type WorkedNodeDefinition = [IAstNodeRelationship, ohm.Node[]];

export type LeafDecoder<T = any> = {
  type: string;
  decode: AstSourceViewDecoderCustom<T>;
};
