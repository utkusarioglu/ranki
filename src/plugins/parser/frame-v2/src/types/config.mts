export type Single = string;

export interface RankiFrameV2ParserPluginConfig {
  tokens: {
    pause: Single;
    opener: Single;
    closer: Single;
    separator: {
      param: Single;
    };
  };
}

export type WithRankiFrameV2PluginConfig = {
  RankiFrameV2: RankiFrameV2ParserPluginConfig;
};
