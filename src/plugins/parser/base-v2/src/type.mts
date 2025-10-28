import type {
  AstNode,
  AstNodeParent,
  AstNodeLeaf,
  AstNodeLeafReduced,
  AstNodeParentReduced,
} from "@ranki/package-api-v2";

/**
 * @dev
 * This was emptied because the args it defined were no longer needed.
 * But it's still kept for now as a handy insertion point for any plugin that
 * inherits from BaseV2.
 */
export type NodeArgsBaseV2 = AstNode["shape"];
type Single = string;

export interface RankiBaseV2ParserPluginConfig {
  tokens: {
    ignore: Single;
    escape: Single;
  };
}

export type WithRankiBaseV2ParserPluginConfig = {
  RankiBaseV2: RankiBaseV2ParserPluginConfig;
};

type BaseV2PluginDef<T> = Omit<T, "plugins"> & {
  plugins: {
    RankiBaseV2: {};
  };
};

export type BaseV2NodeLeafReduced = AstNodeLeafReduced;
export type BaseV2NodeParentReduced = AstNodeParentReduced;

export type BaseV2NodeLeaf = BaseV2PluginDef<AstNodeLeaf>;
export type BaseV2NodeParent = BaseV2PluginDef<AstNodeParent>;

export type BaseV2Node = BaseV2NodeLeaf | BaseV2NodeParent;
