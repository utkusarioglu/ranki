import type { ParamsV2Spec } from "@ranki/plugin-grammar-params-v2";
import type { AstNodeLeaf, AstNodeParent } from "@ranki/package-api-v2";
import { Single } from "./main.mjs";

export interface NodeArgsRichStructureV2 {
  // "richStructure.v2": {
  //   // name: string;
  //   // type: "implicit" | "explicit";
  //   args: AstNode["args"] &
  //     Partial<NodeArgsBaseV2> & {
  //       "richStructure.v2.config": Partial<NodeArgsBaseV2>;
  //     };
  //   params: ParamsV2Spec;
  // };
}

export type ParseNodeRichStructureV2 =
  | ParseNodeRichStructureV2Leaf
  | ParseNodeRichStructureV2Parent;

export type ParseNodeRichStructureV2Leaf = Omit<AstNodeLeaf, "args"> & {
  args: AstNodeLeaf["args"];
};

export type ParseNodeRichStructureV2Parent = Omit<AstNodeParent, "args"> & {
  args: AstNodeParent["args"];
};

export interface ArgsAndParamsV2RichStructureV2 {
  args: NodeArgsRichStructureV2;
  params: ParamsV2Spec;
}
export interface RankiRichStructureV2ParserPluginConfig {
  tokens: {
    delimiter: Single;
  };
}

export type WithRankiRichStructureV2ParserPluginConfig = {
  RankiRichStructureV2: RankiRichStructureV2ParserPluginConfig;
};

export type ParseNodeRichStructureV2Reduced =
  | ParseNodeRichStructureV2LeafReduced
  | ParseNodeRichStructureV2ParentReduced;

export type ParseNodeRichStructureV2LeafReduced = Omit<
  ParseNodeRichStructureV2Leaf,
  "args" | "parent" | "parser"
> & {
  args: Omit<ParseNodeRichStructureV2Leaf["args"], "depth">;
};

export type ParseNodeRichStructureV2ParentReduced = Omit<
  ParseNodeRichStructureV2Parent,
  "args" | "parent" | "parser"
> & {
  args: Omit<ParseNodeRichStructureV2Parent["args"], "depth">;
};
