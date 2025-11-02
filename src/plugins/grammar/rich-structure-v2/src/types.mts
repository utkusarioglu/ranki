import type { ParamsV2Spec } from "@ranki/plugin-grammar-params-v2";
import type { AstNodeLeaf, AstNodeParent } from "@ranki/package-api-v2";

export type Single = string;

export interface NodeArgsRichStructureV2 {
  // "richStructure.v2": {
  //   // name: string;
  //   // type: "implicit" | "explicit";
  //   shape: AstNode["shape"] &
  //     Partial<NodeArgsBaseV2> & {
  //       "richStructure.v2.config": Partial<NodeArgsBaseV2>;
  //     };
  //   params: ParamsV2Spec;
  // };
}

export type ParseNodeRichStructureV2 =
  | ParseNodeRichStructureV2Leaf
  | ParseNodeRichStructureV2Parent;

export type ParseNodeRichStructureV2Leaf = Omit<AstNodeLeaf, "shape"> & {
  shape: AstNodeLeaf["shape"];
};

export type ParseNodeRichStructureV2Parent = Omit<AstNodeParent, "shape"> & {
  shape: AstNodeParent["shape"];
};

export interface ArgsAndParamsV2RichStructureV2 {
  shape: NodeArgsRichStructureV2;
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
  "shape" | "parent" | "parser" | "plugins" | "creator" | "source" | "subtree"
> & {
  shape: Omit<ParseNodeRichStructureV2Leaf["shape"], "depth">;
  source?: ParseNodeRichStructureV2Leaf["source"];
};

export type ParseNodeRichStructureV2ParentReduced = Omit<
  ParseNodeRichStructureV2Parent,
  | "shape"
  | "parent"
  | "parser"
  | "plugins"
  | "creator"
  | "source"
  | "subtree"
  | "children"
> & {
  shape: Omit<ParseNodeRichStructureV2Parent["shape"], "depth">;
  source?: ParseNodeRichStructureV2Parent["source"];
};
