import type {
  IAstNodeRelationship,
  AstSourceViewDecoder,
} from "@dqm/package-dqm-api-v2";
import type * as ohm from "ohm-js";

export type WorkedNodeDefinition = [IAstNodeRelationship, ohm.Node[]];

export type LeafDecoder = {
  type: string;
  decoder: AstSourceViewDecoder;
};
