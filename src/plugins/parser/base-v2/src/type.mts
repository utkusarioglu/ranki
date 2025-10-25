import { AstNode } from "@ranki/package-api-v2";

/**
 * @dev
 * This was emptied because the args it defined were no longer needed.
 * But it's still kept for now as a handy insertion point for any plugin that
 * inherits from BaseV2.
 */
export type NodeArgsBaseV2 = AstNode["args"];
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
